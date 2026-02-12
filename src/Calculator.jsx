import { useState, useEffect, useRef } from "react";

const INDUSTRIES = {
  hvac: {
    label: "HVAC / Plumbing / Trades", icon: "🔧",
    painStats: "67% of HVAC calls come outside business hours. The average missed service call costs $487.",
    caseStudy: { company: "Wayne Conn Plumbing", result: "From 40% missed calls to 100% capture. +$5K/mo in 60 days.", payback: "18 days" },
    roadmap: [
      { week: "Week 1", title: "Discovery + Voice Agent Configuration", items: ["Map service areas, hours, emergency vs. routine routing", "Configure AI with pricing tiers, services, qualification questions", "Set up after-hours greeting and emergency dispatch logic", "Integrate with ServiceTitan / Housecall Pro / scheduling system"] },
      { week: "Week 2", title: "CRM + Dispatch Integration", items: ["Connect HubSpot or existing CRM for lead capture", "Build automated job creation from qualified calls", "Set up technician notification (SMS/email/app)", "Configure priority routing: emergency vs. estimate vs. existing customer"] },
      { week: "Week 3", title: "Testing + Staff Training", items: ["Shadow mode alongside current phone handling", "Test 50+ scenarios: emergency, scheduling, pricing, complaints", "Train team on dashboard and override procedures", "Fine-tune scripts based on real call patterns"] },
      { week: "Week 4", title: "Go Live + Optimization", items: ["Full 24/7/365 deployment", "Daily call review for first week", "Weekly reporting: calls handled, leads captured, jobs booked", "30-day support with dedicated Slack channel"] },
    ],
    vendors: [
      { name: "Retell AI", role: "Voice platform", cost: "$0.07-0.15/min", note: "Best conversation quality" },
      { name: "Make.com", role: "Automation", cost: "$16-29/mo", note: "Connects voice to CRM + dispatch" },
      { name: "ServiceTitan / HCP", role: "Scheduling", cost: "Existing", note: "Job creation + dispatch" },
    ],
  },
  dental: {
    label: "Dental / Medical Practice", icon: "🦷",
    painStats: "Dental practices lose $125K/year from missed calls. 35% of new patient calls go unanswered.",
    caseStudy: { company: "Multi-Location Dental Group", result: "Cut missed calls 73%. AI books appointments, confirms insurance, reduces no-shows 40%.", payback: "22 days" },
    roadmap: [
      { week: "Week 1", title: "Practice Configuration", items: ["Map appointment types, durations, provider availability", "Configure insurance verification + pre-qualification", "New patient intake vs. existing patient routing", "Integrate Dentrix / Eaglesoft / Open Dental API"] },
      { week: "Week 2", title: "Patient Communication", items: ["Appointment confirmation + reminder sequences", "Waitlist management for cancelled slots", "After-hours emergency routing to on-call", "Patient callback queue with priority scoring"] },
      { week: "Week 3", title: "Testing + Compliance", items: ["50+ simulated calls across appointment types", "HIPAA compliance review of data handling", "Staff training on dashboard + escalation", "Fine-tune insurance + payment responses"] },
      { week: "Week 4", title: "Launch + No-Show Reduction", items: ["Full deployment all locations", "Automated no-show follow-up activated", "Daily review for first week", "30-day optimization with weekly reporting"] },
    ],
    vendors: [
      { name: "Retell AI", role: "Voice platform", cost: "$0.07-0.15/min", note: "HIPAA-compliant config" },
      { name: "Make.com", role: "Automation", cost: "$16-29/mo", note: "Connects to scheduling + records" },
      { name: "Dentrix / Open Dental", role: "Practice mgmt", cost: "Existing", note: "Real-time scheduling API" },
    ],
  },
  legal: {
    label: "Law Firm / Legal Services", icon: "⚖️",
    painStats: "Law firms miss 35-50% of intake calls. Average missed legal lead: $4,200 in billable work.",
    caseStudy: { company: "Regional PI Law Firm", result: "100% after-hours capture. 3X qualified consultations. $12K/mo recovered.", payback: "14 days" },
    roadmap: [
      { week: "Week 1", title: "Intake Flow Design", items: ["Map practice areas + case qualification criteria", "Conflict-of-interest screening questions", "Urgency detection for statute of limitations", "Attorney routing by practice area + availability"] },
      { week: "Week 2", title: "CRM + Calendar Integration", items: ["Connect Clio / MyCase / PracticePanther", "Automated consultation booking", "Lead scoring by case type, urgency, value", "Retainer + engagement letter automation"] },
      { week: "Week 3", title: "Compliance + Testing", items: ["Attorney-client privilege protocol review", "Test intake across all practice areas", "Staff training on overrides + escalation", "After-hours + weekend coverage config"] },
      { week: "Week 4", title: "Deployment + Recovery", items: ["24/7 intake coverage live", "Lost-lead recovery campaign activated", "Daily quality review first week", "30-day support with weekly reporting"] },
    ],
    vendors: [
      { name: "Retell AI", role: "Voice platform", cost: "$0.07-0.15/min", note: "Legal intake compliance" },
      { name: "Make.com", role: "Automation", cost: "$16-29/mo", note: "Intake to case management" },
      { name: "Clio / MyCase", role: "Practice mgmt", cost: "Existing", note: "Calendar + lead capture" },
    ],
  },
  mca: {
    label: "MCA / Financial Services", icon: "💰",
    painStats: "MCA companies responding within 5 min are 100X more likely to close. Avg response without AI: 47 min.",
    caseStudy: { company: "HometownCap", result: "200+ daily AI calls. Automated qualification, booking, follow-up. 18-day payback.", payback: "18 days" },
    roadmap: [
      { week: "Week 1", title: "Lead Qualification Engine", items: ["Configure criteria: revenue, time in business, credit range", "Instant response system (under 60 sec to first contact)", "Multi-touch follow-up for unqualified leads", "Integrate lead sources (UFG, merchant lists, web forms)"] },
      { week: "Week 2", title: "CRM + Dialer Integration", items: ["Connect HubSpot / Salesforce for pipeline", "Automated deal creation from qualified calls", "Power dialing for outbound campaigns", "Real-time lead scoring + routing to closers"] },
      { week: "Week 3", title: "Scale Testing", items: ["Stress-test 200+ daily calls", "A/B test scripts for conversion optimization", "Train closers on warm handoff from AI", "Compliance disclosures + recording protocols"] },
      { week: "Week 4", title: "Full Volume Launch", items: ["Full capacity across all lead sources", "Daily reporting: calls, qualified, appointments", "Predictive dialing for optimal contact rates", "30-day optimization with weekly analysis"] },
    ],
    vendors: [
      { name: "Retell AI", role: "Voice platform", cost: "$0.07-0.15/min", note: "200+ daily calls at scale" },
      { name: "Make.com", role: "Automation", cost: "$16-29/mo", note: "Lead flow + CRM orchestration" },
      { name: "HubSpot", role: "CRM + Pipeline", cost: "$45-800/mo", note: "Deal tracking + reporting" },
    ],
  },
  home_services: {
    label: "Home Services", icon: "🏠",
    painStats: "40-60% of leads lost outside business hours. Homeowners call the next company within 3 minutes.",
    caseStudy: { company: "Regional Roofing Co", result: "24/7 storm damage capture. 2.5X estimates booked. Never misses peak season.", payback: "21 days" },
    roadmap: [
      { week: "Week 1", title: "Service + Scheduling", items: ["Map services, pricing, seasonal variations", "Emergency vs. estimate vs. existing customer routing", "Service area validation by ZIP code", "Integrate Jobber / Housecall Pro"] },
      { week: "Week 2", title: "Lead Capture + CRM", items: ["Automated estimate request workflow", "CRM lead tracking + follow-up sequences", "Seasonal surge handling (storm, winter)", "Callback scheduling with confirmation"] },
      { week: "Week 3", title: "Testing + Training", items: ["Test emergency, estimate, and inquiry scenarios", "Train office staff on dashboard + escalation", "Fine-tune pricing scripts + upsell triggers", "Post-service review request automation"] },
      { week: "Week 4", title: "Go Live", items: ["24/7 deployment all phone lines", "Seasonal templates ready for activation", "Daily monitoring first week", "30-day support + optimization"] },
    ],
    vendors: [
      { name: "Retell AI", role: "Voice platform", cost: "$0.07-0.15/min", note: "Handles seasonal spikes" },
      { name: "Make.com", role: "Automation", cost: "$16-29/mo", note: "Scheduling + estimates" },
      { name: "Jobber / HCP", role: "Field service", cost: "Existing", note: "Job creation + dispatch" },
    ],
  },
  auto: {
    label: "Auto Repair / Dealership", icon: "🚗",
    painStats: "Auto shops miss 25-40% of peak-hour calls. Average missed repair call: $640.",
    caseStudy: { company: "Multi-Bay Auto Service", result: "AI books appointments, sends reminders, handles parts status. 20 hrs/week freed.", payback: "24 days" },
    roadmap: [
      { week: "Week 1", title: "Service Menu Config", items: ["Map service types, durations, bay availability", "Appointment booking with real-time calendar", "Parts status inquiry + notifications", "Integrate Shop-Ware / Tekmetric"] },
      { week: "Week 2", title: "Customer Communication", items: ["Service reminder + follow-up sequences", "Estimate approval workflow via phone", "Loaner/shuttle coordination", "Warranty + recall notification handling"] },
      { week: "Week 3", title: "Testing + Training", items: ["Test booking, status, estimate scenarios", "Train service advisors on dashboard", "Fine-tune maintenance upsell scripts", "Customer satisfaction follow-up config"] },
      { week: "Week 4", title: "Launch + Retention", items: ["Full deployment all service lines", "Automated reminder campaigns active", "Daily review first week", "30-day support + retention tracking"] },
    ],
    vendors: [
      { name: "Retell AI", role: "Voice platform", cost: "$0.07-0.15/min", note: "Natural service conversations" },
      { name: "Make.com", role: "Automation", cost: "$16-29/mo", note: "Voice to shop management" },
      { name: "Tekmetric", role: "Shop mgmt", cost: "Existing", note: "Scheduling + parts tracking" },
    ],
  },
  real_estate: {
    label: "Real Estate / Property Mgmt", icon: "🏢",
    painStats: "Leads not contacted in 5 min are 80% less likely to convert. PMs spend 15+ hrs/week on routine calls.",
    caseStudy: { company: "Property Mgmt Group", result: "AI handles maintenance, showings, tenant inquiries 24/7. 60% office call reduction.", payback: "19 days" },
    roadmap: [
      { week: "Week 1", title: "Property + Tenant Config", items: ["Map properties, unit types, availability", "Maintenance request intake + urgency classification", "Showing scheduling with agent calendars", "Tenant verification + lease inquiry handling"] },
      { week: "Week 2", title: "Workflow + Vendor Integration", items: ["Connect AppFolio / Buildium", "Maintenance dispatch to preferred vendors", "Rent payment inquiry + late payment handling", "Prospect follow-up for showings"] },
      { week: "Week 3", title: "Testing + Compliance", items: ["Test maintenance, showing, tenant flows", "Fair housing compliance review", "Train PMs on dashboard + escalation", "After-hours emergency maintenance routing"] },
      { week: "Week 4", title: "Deployment", items: ["Full deployment all property lines", "Proactive tenant communication active", "Daily monitoring first week", "30-day support + satisfaction reporting"] },
    ],
    vendors: [
      { name: "Retell AI", role: "Voice platform", cost: "$0.07-0.15/min", note: "High-volume tenant calls" },
      { name: "Make.com", role: "Automation", cost: "$16-29/mo", note: "Property mgmt + vendors" },
      { name: "AppFolio / Buildium", role: "Property mgmt", cost: "Existing", note: "Maintenance + tenants" },
    ],
  },
  other: {
    label: "Other Service Business", icon: "📞",
    painStats: "Service businesses miss 30% of calls. 85% of voicemail callers never call back.",
    caseStudy: { company: "HometownCap", result: "200+ daily AI calls. Automated qualification, booking, follow-up. 18-day payback.", payback: "18 days" },
    roadmap: [
      { week: "Week 1", title: "Business Logic Config", items: ["Map services, pricing, qualification criteria", "Call routing by type + urgency", "Appointment/estimate booking", "CRM integration or new pipeline"] },
      { week: "Week 2", title: "Automation + Integration", items: ["Connect to existing tools + workflows", "Automated follow-up sequences", "Reporting dashboard for analytics", "High-priority lead notifications"] },
      { week: "Week 3", title: "Testing + Training", items: ["50+ call scenarios all service types", "Team training on dashboard + overrides", "Fine-tune from real patterns", "QA + call review workflows"] },
      { week: "Week 4", title: "Launch + Optimize", items: ["Full 24/7 deployment", "Daily review first week", "Weekly reporting: calls, leads, conversions", "30-day dedicated support"] },
    ],
    vendors: [
      { name: "Retell AI", role: "Voice platform", cost: "$0.07-0.15/min", note: "Best conversation quality" },
      { name: "Make.com", role: "Automation", cost: "$16-29/mo", note: "Connects everything" },
      { name: "HubSpot CRM", role: "Lead mgmt", cost: "Free-$45/mo", note: "Track every lead" },
    ],
  },
};

const JOB_VALUES = {
  hvac: [{ value: "250", label: "$150-$350 (service call)" }, { value: "750", label: "$350-$1,200 (repair)" }, { value: "3000", label: "$1,200-$5,000 (replacement)" }, { value: "8000", label: "$5,000+ (install)" }],
  dental: [{ value: "200", label: "$100-$300 (cleaning)" }, { value: "750", label: "$300-$1,200 (crown)" }, { value: "3000", label: "$1,200-$5,000 (implant)" }, { value: "8000", label: "$5,000+ (cosmetic)" }],
  legal: [{ value: "2000", label: "$1K-$3K (filing)" }, { value: "5000", label: "$3K-$7.5K (case)" }, { value: "15000", label: "$7.5K-$25K (complex)" }, { value: "50000", label: "$25K+ (major)" }],
  mca: [{ value: "3000", label: "$1K-$5K (small)" }, { value: "10000", label: "$5K-$15K (mid)" }, { value: "25000", label: "$15K-$50K (large)" }, { value: "75000", label: "$50K+ (enterprise)" }],
  default: [{ value: "200", label: "Under $300" }, { value: "750", label: "$300-$1,200" }, { value: "3000", label: "$1,200-$5,000" }, { value: "8000", label: "$5K-$15K" }, { value: "25000", label: "$15K+" }],
};

function calcROI(a) {
  const calls = parseInt(a.monthly_calls)||300, miss = parseInt(a.missed_pct)||20;
  const job = parseInt(a.avg_job_value)||1500, close = parseInt(a.close_rate)||20;
  const staff = parseInt(a.receptionist_cost)||0;
  const missed = Math.round(calls*miss/100), recovered = Math.round(missed*0.85);
  const deals = Math.round(recovered*close/100), monthRev = deals*job, yearRev = monthRev*12;
  const agentCost = 497, savings = staff>0?Math.round(staff*0.6):0;
  const net = Math.max(agentCost-savings,1), roi = Math.round(monthRev/net*100);
  const payback = monthRev>0?Math.max(Math.round(agentCost/(monthRev/30)),1):999;
  const ahMap = {rarely:0.08,sometimes:0.18,often:0.32,constantly:0.45};
  const ahCalls = Math.round(calls*(ahMap[a.after_hours]||0.18));
  const ahRev = Math.round(ahCalls*0.85*close/100*job);
  return {missed,recovered,deals,monthRev,yearRev,agentCost,savings,net,roi,payback,ahCalls,ahRev,staff};
}

function fmt(n) {
  if(n>=1e6) return `$${(n/1e6).toFixed(1)}M`;
  if(n>=1e5) return `$${Math.round(n/1e3)}K`;
  if(n>=1e3) return `$${(n/1e3).toFixed(n>=1e4?0:1)}K`;
  return `$${n.toLocaleString()}`;
}
// Appended to data.js to create full app

const STEPS = [
  { id: "business_type", q: "What type of business do you run?", type: "select",
    opts: Object.entries(INDUSTRIES).map(([v,d])=>({value:v,label:`${d.icon}  ${d.label}`})) },
  { id: "monthly_calls", q: "How many inbound calls per month?", type: "select",
    opts: [{value:"100",label:"Under 100"},{value:"300",label:"100-300"},{value:"600",label:"300-600"},{value:"1000",label:"600-1,000"},{value:"2000",label:"1,000-2,000"},{value:"5000",label:"2,000+"}] },
  { id: "missed_pct", q: "What % of calls go unanswered?", sub: "Include after-hours, hold abandons, unreturned voicemails.", type: "select", showPain: true,
    opts: [{value:"10",label:"~10% (pretty good)"},{value:"20",label:"~20% (industry average)"},{value:"30",label:"~30% (we know it's a problem)"},{value:"40",label:"40%+ (it's costing us)"}] },
  { id: "avg_job_value", q: "Average job or deal value?", type: "select", dynamic: true },
  { id: "close_rate", q: "What % of answered calls become customers?", type: "select",
    opts: [{value:"5",label:"~5%"},{value:"10",label:"~10%"},{value:"20",label:"~20%"},{value:"30",label:"~30%"},{value:"40",label:"40%+"}] },
  { id: "after_hours", q: "Volume outside business hours?", sub: "Evenings, weekends, holidays.", type: "select",
    opts: [{value:"rarely",label:"Under 10%"},{value:"sometimes",label:"10-25%"},{value:"often",label:"25-40%"},{value:"constantly",label:"40%+"}] },
  { id: "receptionist_cost", q: "Monthly spend on phone staff?", sub: "Receptionist, answering service, office manager on phones.", type: "select",
    opts: [{value:"0",label:"Nothing (I answer myself)"},{value:"1500",label:"Under $2K/mo"},{value:"3500",label:"$2K-$5K/mo"},{value:"7500",label:"$5K-$10K/mo"},{value:"15000",label:"$10K+/mo"}] },
  { id: "pain_point", q: "Your #1 phone frustration?", type: "select",
    opts: [{value:"missed",label:"Losing leads to missed calls"},{value:"quality",label:"Staff doesn't qualify well"},{value:"after_hours",label:"Zero nights/weekend coverage"},{value:"cost",label:"Phone staff costs too much"},{value:"scale",label:"Can't handle busy season"}] },
  { id: "email", q: "Where should we send your report?", sub: "Custom ROI analysis with implementation roadmap. Instant delivery.", type: "email" },
];

function Landing({onStart}) {
  const [a,setA]=useState(false);
  useEffect(()=>{setTimeout(()=>setA(true),50)},[]);
  const cs={fontFamily:"'IBM Plex Sans',sans-serif"};
  const cm={fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.03em"};
  const cf={fontFamily:"'Instrument Serif',Georgia,serif",fontWeight:400};
  return (
    <div style={{opacity:a?1:0,transform:a?"translateY(0)":"translateY(20px)",transition:"all 0.6s ease"}}>
      <div style={{textAlign:"center",marginBottom:48}}>
        <div style={{...cm,fontSize:11,color:"#f97316",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12}}>Free ROI Calculator</div>
        <h1 style={{...cf,fontSize:38,color:"#f1f5f9",lineHeight:1.2,margin:"0 0 16px"}}>
          Your missed calls are<br/><span style={{color:"#f97316"}}>someone else's revenue</span>
        </h1>
        <p style={{...cs,maxWidth:480,margin:"0 auto 32px",fontSize:16,color:"#94a3b8",lineHeight:1.6}}>
          Answer 8 questions. See exactly how much revenue your business loses every month from unanswered calls.
        </p>
        <button onClick={onStart} style={{padding:"14px 28px",border:"none",borderRadius:10,cursor:"pointer",background:"linear-gradient(135deg,#f97316,#ea580c)",color:"#fff",fontSize:16,fontWeight:600,...cs}}>
          Calculate My Lost Revenue
        </button>
        <p style={{...cm,fontSize:11,color:"#475569",marginTop:12}}>60 seconds. No credit card.</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:48}}>
        {[{s:"85%",l:"of voicemail callers never call back"},{s:"30-40%",l:"of service calls go unanswered"},{s:"$4,200",l:"avg missed inbound lead value"}].map((x,i)=>(
          <div key={i} style={{padding:18,background:"rgba(30,41,59,0.4)",border:"1px solid rgba(51,65,85,0.3)",borderRadius:12,textAlign:"center"}}>
            <div style={{...cf,fontSize:26,color:"#f97316",marginBottom:4}}>{x.s}</div>
            <div style={{...cs,fontSize:11,color:"#94a3b8",lineHeight:1.4}}>{x.l}</div>
          </div>
        ))}
      </div>

      <div style={{padding:24,background:"rgba(30,41,59,0.3)",border:"1px solid rgba(51,65,85,0.3)",borderRadius:14,marginBottom:48}}>
        <div style={{...cm,fontSize:11,color:"#f97316",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:18}}>Your free report includes</div>
        {[{t:"Revenue Loss Analysis",d:"Exact dollar amount lost monthly from missed and after-hours calls"},
          {t:"Industry Benchmarks",d:"How your numbers compare to top performers in your vertical"},
          {t:"ROI Projection",d:"What an AI voice agent recovers and how fast you'd see payback"}].map((x,i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:i<2?14:0}}>
            <div style={{width:26,height:26,borderRadius:7,flexShrink:0,background:"rgba(249,115,22,0.1)",border:"1px solid rgba(249,115,22,0.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#f97316",fontSize:13,fontWeight:700,marginTop:2}}>{i+1}</div>
            <div>
              <div style={{...cs,fontWeight:600,color:"#e2e8f0",fontSize:14,marginBottom:2}}>{x.t}</div>
              <div style={{...cs,fontSize:13,color:"#94a3b8"}}>{x.d}</div>
            </div>
          </div>
        ))}
        <div style={{marginTop:20,paddingTop:20,borderTop:"1px solid rgba(51,65,85,0.3)"}}>
          <div style={{...cm,fontSize:11,color:"#f97316",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14}}>Upgrade for $29 (optional)</div>
          {["4-week implementation roadmap for YOUR industry","Vendor comparison with real costs","Negotiation scripts for phone contracts","Case study from a business like yours","Full cost breakdown + ROI timeline"].map((x,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:7}}>
              <span style={{color:"#f97316",fontSize:14,flexShrink:0}}>+</span>
              <span style={{...cs,fontSize:13,color:"#cbd5e1"}}>{x}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginBottom:48}}>
        <div style={{...cm,fontSize:11,color:"#f97316",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:20,textAlign:"center"}}>Built by the team behind</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[{c:"HometownCap",r:"200+ daily AI calls",m:"18-day payback"},{c:"Wayne Conn Plumbing",r:"100% call capture",m:"+$5K/mo revenue"},
            {c:"Adleg Marketing",r:"97% time reduction",m:"$200K+ new revenue"},{c:"Beaver Pumice",r:"Zero lost tickets",m:"5-week payback"}].map((x,i)=>(
            <div key={i} style={{padding:14,background:"rgba(15,23,42,0.6)",border:"1px solid rgba(51,65,85,0.3)",borderRadius:10}}>
              <div style={{...cs,fontWeight:600,color:"#e2e8f0",fontSize:13,marginBottom:3}}>{x.c}</div>
              <div style={{...cs,fontSize:12,color:"#f97316",marginBottom:2}}>{x.r}</div>
              <div style={{...cm,fontSize:11,color:"#64748b"}}>{x.m}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{textAlign:"center"}}>
        <button onClick={onStart} style={{padding:"14px 28px",border:"none",borderRadius:10,cursor:"pointer",background:"linear-gradient(135deg,#f97316,#ea580c)",color:"#fff",fontSize:16,fontWeight:600,...cs}}>
          Calculate My Lost Revenue
        </button>
      </div>
    </div>
  );
}

function Question({step,value,onChange,onNext,onBack,idx,answers}) {
  const [v,setV]=useState(value||"");
  const [anim,setAnim]=useState(true);
  useEffect(()=>{setAnim(true);setV(value||"");setTimeout(()=>setAnim(false),50)},[step.id,value]);
  const cs={fontFamily:"'IBM Plex Sans',sans-serif"};
  const cm={fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.03em"};
  const cf={fontFamily:"'Instrument Serif',Georgia,serif",fontWeight:400};
  const sel=(val)=>{setV(val);onChange(val);setTimeout(onNext,300)};
  let opts=step.opts;
  if(step.dynamic){const b=answers.business_type||"default";opts=JOB_VALUES[b]||JOB_VALUES.default;}
  const ind=INDUSTRIES[answers.business_type];
  return (
    <div style={{opacity:anim?0:1,transform:anim?"translateY(12px)":"translateY(0)",transition:"all 0.35s ease"}}>
      <h2 style={{...cf,fontSize:26,color:"#f1f5f9",lineHeight:1.3,marginBottom:step.sub?8:24}}>{step.q}</h2>
      {step.sub&&<p style={{...cs,fontSize:14,color:"#64748b",marginBottom:24}}>{step.sub}</p>}
      {step.showPain&&ind&&(
        <div style={{padding:"10px 14px",marginBottom:16,borderRadius:8,background:"rgba(249,115,22,0.06)",border:"1px solid rgba(249,115,22,0.15)",...cs,fontSize:12,color:"#94a3b8",lineHeight:1.5}}>{ind.painStats}</div>
      )}
      {step.type==="select"&&opts&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {opts.map(o=>(
            <button key={o.value} onClick={()=>sel(o.value)} style={{padding:"13px 18px",textAlign:"left",cursor:"pointer",background:v===o.value?"rgba(249,115,22,0.1)":"rgba(30,41,59,0.4)",border:v===o.value?"1px solid rgba(249,115,22,0.35)":"1px solid rgba(51,65,85,0.4)",borderRadius:10,color:v===o.value?"#fb923c":"#cbd5e1",...cs,fontSize:14,fontWeight:500,transition:"all 0.15s ease",outline:"none"}}>{o.label}</button>
          ))}
        </div>
      )}
      {step.type==="email"&&(
        <div>
          <input type="email" value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&v.includes("@")){onChange(v);onNext()}}}
            placeholder="your@email.com" style={{width:"100%",padding:"14px 18px",boxSizing:"border-box",background:"rgba(30,41,59,0.4)",border:"1px solid rgba(51,65,85,0.4)",borderRadius:10,color:"#f1f5f9",fontSize:15,...cs,outline:"none"}}/>
          <button onClick={async()=>{if(v.includes("@")){onChange(v);const roi=calcROI({...answers,email:v});fetch("/api/lead",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:v,answers:{...answers,email:v},roi})}).catch(()=>{});onNext()}}} disabled={!v.includes("@")}
            style={{width:"100%",marginTop:14,padding:"14px 28px",border:"none",borderRadius:10,cursor:v.includes("@")?"pointer":"not-allowed",background:v.includes("@")?"linear-gradient(135deg,#f97316,#ea580c)":"rgba(30,41,59,0.5)",color:"#fff",fontSize:16,fontWeight:600,...cs,opacity:v.includes("@")?1:0.4}}>
            Generate My ROI Report
          </button>
          <p style={{...cm,fontSize:11,color:"#475569",textAlign:"center",marginTop:10}}>No spam. Unsubscribe anytime.</p>
        </div>
      )}
      {idx>0&&<button onClick={onBack} style={{marginTop:18,padding:"6px 0",background:"none",border:"none",color:"#64748b",fontSize:12,cursor:"pointer",...cm}}>← Back</button>}
    </div>
  );
}

function Results({answers,roi,initiallyUnlocked}) {
  const [full,setFull]=useState(initiallyUnlocked||false);
  const [a,setA]=useState(false);
  const [generating,setGenerating]=useState(false);
  useEffect(()=>{setTimeout(()=>setA(true),100)},[]);
  useEffect(()=>{if(initiallyUnlocked)setFull(true)},[initiallyUnlocked]);
  const cs={fontFamily:"'IBM Plex Sans',sans-serif"};
  const cm={fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.03em"};
  const cf={fontFamily:"'Instrument Serif',Georgia,serif",fontWeight:400};
  const ind=INDUSTRIES[answers.business_type]||INDUSTRIES.other;

  const Stat=({label,value,sub,hi,big})=>(
    <div style={{padding:big?24:18,background:hi?"rgba(249,115,22,0.07)":"rgba(30,41,59,0.35)",border:hi?"1px solid rgba(249,115,22,0.2)":"1px solid rgba(51,65,85,0.25)",borderRadius:12,gridColumn:big?"1/-1":undefined}}>
      <div style={{...cm,fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5}}>{label}</div>
      <div style={{...cf,fontSize:big?40:30,color:hi?"#fb923c":"#f1f5f9",lineHeight:1.1}}>{value}</div>
      {sub&&<div style={{...cs,fontSize:12,color:"#94a3b8",marginTop:3}}>{sub}</div>}
    </div>
  );

  return (
    <div style={{opacity:a?1:0,transform:a?"translateY(0)":"translateY(20px)",transition:"all 0.6s ease"}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{...cm,fontSize:11,color:"#f97316",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12}}>Your ROI Analysis</div>
        <h1 style={{...cf,fontSize:36,color:"#f1f5f9",lineHeight:1.2,margin:0}}>
          You're losing <span style={{color:"#f97316"}}>{fmt(roi.yearRev)}/year</span> in missed calls
        </h1>
        <p style={{...cs,fontSize:15,color:"#94a3b8",marginTop:10,lineHeight:1.5}}>
          {roi.missed.toLocaleString()} calls/mo go unanswered. That's ~{roi.deals} lost deals worth {fmt(roi.monthRev)}.
        </p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        <Stat label="Monthly Revenue Lost" value={fmt(roi.monthRev)} sub="From unanswered calls" hi big/>
        <Stat label="Payback Period" value={`${roi.payback} days`} sub="Time to recoup investment" hi/>
        <Stat label="After-Hours Revenue" value={fmt(roi.ahRev)} sub={`${roi.ahCalls} calls outside hours`}/>
        <Stat label="Calls Recovered" value={`${roi.recovered}/mo`} sub={`of ${roi.missed} currently missed`}/>
        <Stat label="ROI" value={`${roi.roi}%`} sub="Return on voice agent cost"/>
      </div>

      {roi.staff>0&&(
        <div style={{padding:16,marginBottom:20,borderRadius:12,background:"rgba(34,197,94,0.05)",border:"1px solid rgba(34,197,94,0.15)"}}>
          <div style={{...cm,fontSize:10,color:"#4ade80",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Staff savings</div>
          <div style={{...cs,fontSize:13,color:"#cbd5e1",lineHeight:1.5}}>Replace {fmt(roi.staff)}/mo phone staff with {fmt(roi.agentCost)}/mo AI agent. Save {fmt(roi.savings)}/mo with better call handling.</div>
        </div>
      )}

      <div style={{padding:18,marginBottom:20,borderRadius:12,background:"rgba(15,23,42,0.5)",border:"1px solid rgba(51,65,85,0.3)"}}>
        <div style={{...cm,fontSize:10,color:"#f97316",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Proof: {ind.label}</div>
        <div style={{...cf,fontSize:18,color:"#f1f5f9",marginBottom:4}}>{ind.caseStudy.company}</div>
        <div style={{...cs,fontSize:13,color:"#94a3b8",lineHeight:1.5}}>{ind.caseStudy.result}</div>
        <div style={{...cm,fontSize:12,color:"#f97316",marginTop:6}}>Payback: {ind.caseStudy.payback}</div>
      </div>

      {/* PREMIUM GATED CONTENT */}
      <div style={{position:"relative",marginBottom:24}}>
        <div style={{padding:24,background:"rgba(30,41,59,0.35)",borderRadius:14,border:"1px solid rgba(51,65,85,0.25)",filter:full?"none":"blur(5px)",userSelect:full?"auto":"none",pointerEvents:full?"auto":"none",transition:"filter 0.5s ease"}}>
          <h3 style={{...cf,fontSize:20,color:"#f1f5f9",marginTop:0,marginBottom:4}}>4-Week Implementation Roadmap</h3>
          <p style={{...cs,fontSize:12,color:"#64748b",marginBottom:20}}>Built for {ind.label.toLowerCase()} businesses</p>
          {ind.roadmap.map(p=>(
            <div key={p.week} style={{marginBottom:20}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                <div style={{...cm,fontSize:10,color:"#f97316",background:"rgba(249,115,22,0.1)",padding:"3px 8px",borderRadius:5}}>{p.week}</div>
                <div style={{...cs,fontSize:14,fontWeight:600,color:"#e2e8f0"}}>{p.title}</div>
              </div>
              {p.items.map((item,j)=>(
                <div key={j} style={{display:"flex",gap:8,marginBottom:4,paddingLeft:4}}>
                  <span style={{color:"#334155",fontSize:7,marginTop:6,flexShrink:0}}>●</span>
                  <span style={{...cs,fontSize:12,color:"#94a3b8",lineHeight:1.4}}>{item}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{marginTop:24,paddingTop:20,borderTop:"1px solid rgba(51,65,85,0.3)"}}>
            <h3 style={{...cf,fontSize:18,color:"#f1f5f9",marginTop:0,marginBottom:14}}>Vendor + Cost Breakdown</h3>
            {ind.vendors.map((v,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:12,background:"rgba(15,23,42,0.4)",borderRadius:8,marginBottom:8}}>
                <div><div style={{...cs,fontWeight:600,color:"#e2e8f0",fontSize:13}}>{v.name}</div><div style={{...cs,fontSize:11,color:"#64748b"}}>{v.role}</div></div>
                <div style={{textAlign:"right"}}><div style={{...cm,fontSize:12,color:"#fb923c"}}>{v.cost}</div><div style={{...cs,fontSize:10,color:"#64748b"}}>{v.note}</div></div>
              </div>
            ))}
            <div style={{marginTop:12,padding:12,borderRadius:8,background:"rgba(249,115,22,0.06)",border:"1px solid rgba(249,115,22,0.15)"}}>
              <div style={{...cs,fontSize:12,color:"#cbd5e1",lineHeight:1.5}}>
                <strong style={{color:"#fb923c"}}>Total est. monthly:</strong> {fmt(roi.agentCost)}/mo to recover {fmt(roi.yearRev)}/year. <strong style={{color:"#4ade80"}}>{roi.roi}% ROI.</strong>
              </div>
            </div>
          </div>

          <div style={{marginTop:24,paddingTop:20,borderTop:"1px solid rgba(51,65,85,0.3)"}}>
            <h3 style={{...cf,fontSize:18,color:"#f1f5f9",marginTop:0,marginBottom:14}}>Negotiation Scripts</h3>
            {[{label:"If you have an answering service",script:"We're testing an AI system for 30 days. I'd like to pause our contract rather than cancel. If it doesn't perform, we'll be back. Can you freeze with no penalty?"},
              {label:"If you're hiring a receptionist",script:"Before we post this role, I want to test an AI phone system for 30 days. If it handles 80%+ of calls, we redirect that salary budget to revenue activities. If not, we hire."}].map((s,i)=>(
              <div key={i} style={{padding:12,background:"rgba(15,23,42,0.4)",borderRadius:8,marginBottom:8}}>
                <div style={{...cm,fontSize:10,color:"#f97316",textTransform:"uppercase",marginBottom:6}}>{s.label}</div>
                <div style={{...cs,fontSize:12,color:"#94a3b8",lineHeight:1.5,fontStyle:"italic"}}>"{s.script}"</div>
              </div>
            ))}
          </div>
        </div>

        {!full&&(
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",borderRadius:14,background:"linear-gradient(180deg,rgba(15,23,42,0) 0%,rgba(15,23,42,0.95) 35%)"}}>
            <div style={{padding:32,textAlign:"center",maxWidth:380}}>
              <div style={{...cf,fontSize:24,color:"#f1f5f9",marginBottom:8}}>Unlock Full Report</div>
              <div style={{...cs,fontSize:13,color:"#94a3b8",marginBottom:16,lineHeight:1.5}}>
                Your custom {ind.label.toLowerCase()} implementation plan, vendor costs, scripts, and case study.
              </div>
              {["4-week industry-specific roadmap",`${ind.caseStudy.company} case study`,"Vendor comparison with real costs","Contract negotiation scripts","Cost breakdown + ROI timeline"].map((x,i)=>(
                <div key={i} style={{...cs,fontSize:12,color:"#cbd5e1",display:"flex",gap:8,marginBottom:4,textAlign:"left"}}>
                  <span style={{color:"#f97316"}}>✓</span>{x}
                </div>
              ))}
              <button onClick={async()=>{
                setGenerating(true);
                try{
                  const res=await fetch("/api/checkout",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({email:answers.email,answers,roi})
                  });
                  const {url}=await res.json();
                  window.location.href=url;
                }catch(err){
                  console.error(err);
                  setGenerating(false);
                }
              }} disabled={generating} style={{marginTop:20,padding:"16px 36px",border:"none",borderRadius:10,cursor:generating?"wait":"pointer",background:"linear-gradient(135deg,#f97316,#ea580c)",color:"#fff",fontSize:17,fontWeight:600,...cs,boxShadow:"0 4px 30px rgba(249,115,22,0.35)",opacity:generating?0.7:1}}>
                {generating?"Processing...":"Get Full Report - $29"}
              </button>
              <div style={{...cm,fontSize:11,color:"#475569",marginTop:10}}>One-time. Instant delivery. No subscription.</div>
            </div>
          </div>
        )}
      </div>

      {/* DONE FOR YOU */}
      <div style={{padding:24,borderRadius:14,textAlign:"center",background:"linear-gradient(135deg,rgba(249,115,22,0.06),rgba(234,88,12,0.03))",border:"1px solid rgba(249,115,22,0.15)",marginBottom:20}}>
        <div style={{...cm,fontSize:11,color:"#f97316",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Done-For-You</div>
        <h3 style={{...cf,fontSize:22,color:"#f1f5f9",margin:"0 0 8px"}}>Want us to build it for you?</h3>
        <p style={{...cs,fontSize:13,color:"#94a3b8",marginBottom:20,lineHeight:1.5,maxWidth:400,margin:"0 auto 20px"}}>
          Custom AI voice agents for {ind.label.toLowerCase()}. Flat rate. Live in 2-4 weeks. You own everything.
        </p>
        <button onClick={()=>window.open("https://meetings.hubspot.com/resultantai/paper-to-digital","_blank")}
          style={{padding:"14px 28px",borderRadius:10,cursor:"pointer",background:"transparent",border:"1px solid rgba(249,115,22,0.35)",color:"#fb923c",fontSize:15,fontWeight:600,...cs}}>
          Book a Free Strategy Call
        </button>
        <div style={{...cm,fontSize:11,color:"#475569",marginTop:10}}>30 min. No pitch deck.</div>
      </div>

      <div style={{textAlign:"center",paddingTop:20,borderTop:"1px solid rgba(51,65,85,0.2)"}}>
        <div style={{...cm,fontSize:11,color:"#334155"}}>ResultantAI | AI Growth Systems That Pay for Themselves in 30 Days</div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen,setScreen]=useState("landing");
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({});
  const [unlocked,setUnlocked]=useState(false);
  const ref=useRef(null);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const sessionId=params.get("session_id");
    if(sessionId){
      fetch(`/api/verify/${sessionId}`)
        .then(r=>r.json())
        .then(data=>{
          if(data.paid&&data.answers){
            setAnswers(data.answers);
            setScreen("results");
            setUnlocked(true);
          }
        })
        .catch(()=>{});
    }
  },[]);

  useEffect(()=>{ref.current?.scrollTo({top:0,behavior:"smooth"})},[step,screen]);

  const roi=calcROI(answers);
  const cm={fontFamily:"'IBM Plex Mono',monospace",letterSpacing:"0.03em"};

  return (
    <div ref={ref} style={{minHeight:"100vh",background:"#0f172a",display:"flex",justifyContent:"center",padding:"40px 20px",boxSizing:"border-box",overflowY:"auto"}}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <div style={{width:"100%",maxWidth:560}}>
        {screen==="landing"&&<Landing onStart={()=>setScreen("quiz")}/>}
        {screen==="quiz"&&(
          <>
            <div style={{width:"100%",marginBottom:32}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,...cm,fontSize:11,color:"#64748b"}}>
                <span>Question {step+1} of {STEPS.length}</span>
                <span>{Math.round((step+1)/STEPS.length*100)}%</span>
              </div>
              <div style={{width:"100%",height:3,background:"#1e293b",borderRadius:2,overflow:"hidden"}}>
                <div style={{width:`${(step+1)/STEPS.length*100}%`,height:"100%",borderRadius:2,background:"linear-gradient(90deg,#f97316,#fb923c)",transition:"width 0.5s ease"}}/>
              </div>
            </div>
            <Question step={STEPS[step]} value={answers[STEPS[step].id]} onChange={v=>setAnswers(p=>({...p,[STEPS[step].id]:v}))}
              onNext={()=>step<STEPS.length-1?setStep(s=>s+1):setScreen("results")} onBack={()=>step>0?setStep(s=>s-1):setScreen("landing")} idx={step} answers={answers}/>
          </>
        )}
        {screen==="results"&&<Results answers={answers} roi={roi} initiallyUnlocked={unlocked}/>}
      </div>
    </div>
  );
}
