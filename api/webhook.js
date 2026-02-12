import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('No webhook secret configured');
    return res.status(200).json({ received: true });
  }

  try {
    const buf = await buffer(req);
    const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Webhook: Payment completed:', session.id, session.customer_email);

        // TODO: Send confirmation email, update CRM, etc.

        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}
