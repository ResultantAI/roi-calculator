# Voice Agent ROI Calculator

Interactive ROI calculator that helps service businesses quantify revenue lost from missed calls and calculate the financial impact of implementing AI voice automation.

**Live at:** [resultantai.com/voice-roi-calculator](https://resultantai.com/voice-roi-calculator)

---

## What It Does

The Voice Agent ROI Calculator helps businesses in HVAC, dental, legal, medical, home services, and other high-call-volume industries understand:

- How much revenue they're losing from missed and after-hours calls
- The financial impact of current no-show rates
- Payback timeline for implementing AI voice automation
- Industry-specific implementation roadmaps and vendor costs

### Features

**Free Analysis:**
- 8-step interactive quiz (60 seconds)
- Real-time ROI calculations based on industry benchmarks
- Monthly and annual revenue loss projections
- Payback period analysis
- Industry-specific case studies

**Premium Report ($29):**
- 4-week implementation roadmap for your industry
- Vendor comparison with real costs (Retell AI, Make.com, CRMs)
- Contract negotiation scripts
- Custom cost breakdown and ROI timeline

---

## Industries Supported

- **HVAC / Plumbing / Trades** - Service call management and emergency dispatch
- **Dental / Medical Practice** - Patient scheduling and no-show reduction
- **Law Firm / Legal Services** - Intake automation and consultation booking
- **MCA / Financial Services** - Lead qualification and deal pipeline
- **Home Services** - Seasonal surge handling and estimate requests
- **Auto Repair / Dealership** - Appointment booking and parts status
- **Real Estate / Property Management** - Tenant inquiries and maintenance requests

---

## Technology

- **Frontend:** React 18 with Vite
- **Backend:** Vercel Serverless Functions
- **Payment Processing:** Stripe Checkout
- **Hosting:** GitHub Pages (frontend) + Vercel (API)

---

## How It Works

1. **Answer 8 Questions** - Industry type, call volume, job values, close rates, pain points
2. **Get Free Analysis** - See your monthly revenue loss, payback timeline, and ROI projections
3. **Optional Upgrade** - Purchase premium report for $29 (one-time) to unlock full implementation roadmap
4. **Stripe Checkout** - Secure payment processing with instant digital delivery
5. **Premium Content** - Full roadmap, vendor costs, and negotiation scripts unlocked immediately

---

## Data Sources

ROI calculations are based on verified industry data:

- Medical practices: $150K/year average loss from no-shows (source: industry studies)
- Service businesses: 29-42% of calls missed during business hours (source: multi-practice analysis)
- Average missed call value: $180-$230 per appointment (source: healthcare benchmarks)
- No-show rates by specialty: 15-30% across dental, medical, and professional services

All benchmarks are from 2023-2025 research studies and vendor analyses.

---

## Architecture

**Frontend (GitHub Pages):**
- Static React bundle served from `resultantai.com`
- Lightweight (178KB JS, 56KB gzipped)
- Mobile-responsive design

**Backend API (Vercel):**
- `/api/lead` - Lead capture for free report
- `/api/checkout` - Stripe session creation
- `/api/verify/[sessionId]` - Payment verification
- `/api/webhook` - Stripe webhook handler

**Integration:**
- Frontend calls backend via configurable API base URL
- CORS-enabled for cross-origin requests
- HIPAA-compliant architecture (encrypted call handling, BAA available)

---

## Open Source

This calculator is built by [ResultantAI](https://resultantai.com) to help service businesses understand the financial impact of missed revenue opportunities.

**Contributing:**
- Report issues or suggest improvements via GitHub Issues
- Industry-specific data improvements welcome (with verified sources)

---

## License

MIT License - See LICENSE file for details

---

## Contact

**ResultantAI**
Revenue systems for service businesses.
Built with AI. Run by humans.

- Website: [resultantai.com](https://resultantai.com)
- Calculator: [resultantai.com/voice-roi-calculator](https://resultantai.com/voice-roi-calculator)
- Book a Demo: [meetings.hubspot.com/resultantai](https://meetings.hubspot.com/resultantai/paper-to-digital)
