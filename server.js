import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
}

// Lead capture endpoint
app.post('/api/lead', async (req, res) => {
  try {
    const { email, answers, roi } = req.body;

    // Log lead to file (in production, send to CRM/database)
    const leadData = {
      timestamp: new Date().toISOString(),
      email,
      answers,
      roi,
      type: 'free_report'
    };

    const logFile = join(__dirname, 'leads.json');
    let leads = [];

    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, 'utf8');
      leads = JSON.parse(content);
    }

    leads.push(leadData);
    fs.writeFileSync(logFile, JSON.stringify(leads, null, 2));

    console.log('Lead captured:', email);

    res.json({ success: true });
  } catch (error) {
    console.error('Lead capture error:', error);
    res.status(500).json({ error: 'Failed to capture lead' });
  }
});

// Create Stripe checkout session
app.post('/api/checkout', async (req, res) => {
  try {
    const { email, answers, roi } = req.body;

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1SzqgXGfTp4ABj0BuyQTx8UQ', // Your Stripe price ID
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?canceled=true`,
      customer_email: email,
      metadata: {
        email,
        answers: JSON.stringify(answers),
        roi: JSON.stringify(roi)
      },
    });

    // Log purchase attempt
    const logData = {
      timestamp: new Date().toISOString(),
      sessionId: session.id,
      email,
      answers,
      roi,
      type: 'purchase_initiated'
    };

    const logFile = join(__dirname, 'purchases.json');
    let purchases = [];

    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, 'utf8');
      purchases = JSON.parse(content);
    }

    purchases.push(logData);
    fs.writeFileSync(logFile, JSON.stringify(purchases, null, 2));

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Verify payment after redirect
app.get('/api/verify/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

    if (session.payment_status === 'paid') {
      // Parse the stored metadata
      const answers = JSON.parse(session.metadata.answers || '{}');
      const roi = JSON.parse(session.metadata.roi || '{}');

      // Log successful purchase
      const logData = {
        timestamp: new Date().toISOString(),
        sessionId: session.id,
        email: session.customer_email,
        answers,
        roi,
        type: 'purchase_completed'
      };

      const logFile = join(__dirname, 'purchases.json');
      let purchases = [];

      if (fs.existsSync(logFile)) {
        const content = fs.readFileSync(logFile, 'utf8');
        purchases = JSON.parse(content);
      }

      purchases.push(logData);
      fs.writeFileSync(logFile, JSON.stringify(purchases, null, 2));

      res.json({
        paid: true,
        answers,
        roi,
        email: session.customer_email
      });
    } else {
      res.json({ paid: false });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Stripe webhook endpoint (for production)
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('No webhook secret configured');
    return res.sendStatus(200);
  }

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Payment completed:', session.id);

        // Log to file
        const logData = {
          timestamp: new Date().toISOString(),
          sessionId: session.id,
          email: session.customer_email,
          metadata: session.metadata,
          type: 'webhook_payment_completed'
        };

        const logFile = join(__dirname, 'webhooks.json');
        let webhooks = [];

        if (fs.existsSync(logFile)) {
          const content = fs.readFileSync(logFile, 'utf8');
          webhooks = JSON.parse(content);
        }

        webhooks.push(logData);
        fs.writeFileSync(logFile, JSON.stringify(webhooks, null, 2));

        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  WARNING: STRIPE_SECRET_KEY not set!');
  }
});
