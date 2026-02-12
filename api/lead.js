export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, answers, roi } = req.body;

    // Log lead (in production, send to CRM)
    console.log('Lead captured:', {
      timestamp: new Date().toISOString(),
      email,
      answers,
      roi,
      type: 'free_report'
    });

    // TODO: Send to HubSpot/CRM here

    res.json({ success: true });
  } catch (error) {
    console.error('Lead capture error:', error);
    res.status(500).json({ error: 'Failed to capture lead' });
  }
}
