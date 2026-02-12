import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const answers = JSON.parse(session.metadata.answers || '{}');
      const roi = JSON.parse(session.metadata.roi || '{}');

      console.log('Payment verified:', session.id, session.customer_email);

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
}
