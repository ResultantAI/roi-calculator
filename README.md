# Voice Agent ROI Calculator

Interactive ROI calculator for ResultantAI's voice agent services. Built with React + Vite + Stripe.

## Features

- 8-step interactive quiz
- Real-time ROI calculation
- Industry-specific recommendations
- Stripe checkout integration ($29 premium report)
- Lead capture
- Success page with premium content unlock

## Tech Stack

- **Frontend:** React 18, Vite
- **Backend:** Vercel Serverless Functions
- **Payment:** Stripe Checkout
- **Deployment:** Vercel

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your Stripe keys to `.env`:
```
STRIPE_SECRET_KEY=sk_test_...
BASE_URL=http://localhost:3000
```

4. Start dev server:
```bash
npm run dev
```

Frontend runs on http://localhost:3000

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure environment variables:
   - `STRIPE_SECRET_KEY` - Your Stripe secret key (sk_live_...)
   - `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret (whsec_...)
   - `BASE_URL` - Your production URL (e.g., https://roi.resultantai.com)
4. Deploy!

### 3. Configure Stripe Webhook

After deployment, add webhook endpoint in Stripe Dashboard:

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://your-domain.vercel.app/api/webhook`
4. Select events: `checkout.session.completed`
5. Copy webhook secret and add to Vercel env vars as `STRIPE_WEBHOOK_SECRET`
6. Redeploy

## Environment Variables

Required in production:

```
STRIPE_SECRET_KEY=sk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...
BASE_URL=https://roi.resultantai.com
```

## Stripe Configuration

- **Product ID:** `prod_TxmF9h23Zrp39i`
- **Price ID:** `price_1SzqgXGfTp4ABj0BuyQTx8UQ`
- **Amount:** $29 one-time payment

Success URL: `{BASE_URL}/?session_id={CHECKOUT_SESSION_ID}`
Cancel URL: `{BASE_URL}/?canceled=true`

## API Endpoints

- `POST /api/lead` - Capture free lead email
- `POST /api/checkout` - Create Stripe checkout session
- `GET /api/verify/[sessionId]` - Verify payment and restore state
- `POST /api/webhook` - Stripe webhook handler

## Custom Domain (Optional)

To use `roi.resultantai.com`:

1. In Vercel project settings → Domains
2. Add `roi.resultantai.com`
3. Follow DNS setup instructions
4. Update `BASE_URL` env var

## Testing Stripe Integration

Use test card: `4242 4242 4242 4242`
Exp: Any future date
CVC: Any 3 digits
