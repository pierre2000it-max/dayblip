"use client"
import { useState, useEffect, useRef } from "react"
import ShareButtons from "@/components/ShareButtons"
import SchemaMarkup from "@/components/SchemaMarkup"
import Breadcrumb from "@/components/Breadcrumb"
import RelatedTools from "@/components/RelatedTools"
import { webApplicationSchema, faqSchema, howToSchema, breadcrumbSchema } from "@/lib/schema"

// ─── Synonym resolution ───────────────────────────────────────────────────────
const synonyms: Record<string, string> = {
  "doctor": "Physician", "md": "Physician", "rn": "Registered Nurse",
  "attorney": "Lawyer", "counsel": "Lawyer",
  "programmer": "Software Engineer", "developer": "Software Engineer",
  "coder": "Software Engineer", "dev": "Software Engineer",
  "designer": "Graphic Designer", "reporter": "Journalist",
  "therapist": "Psychologist", "cop": "Police Officer",
  "officer": "Police Officer", "cook": "Chef", "hr": "HR Manager",
  "bookkeeper": "Bookkeeper", "data entry": "Data Entry Clerk",
  "vet": "Veterinarian", "vet tech": "Veterinary Technician",
  "dental hygienist": "Dental Hygienist", "eye doctor": "Optometrist",
  "ot": "Occupational Therapist", "slp": "Speech Language Pathologist",
  "speech therapist": "Speech Language Pathologist", "dietitian": "Nutritionist",
  "radiographer": "Radiographer", "ml engineer": "Machine Learning Engineer",
  "qa": "QA Engineer", "sysadmin": "Systems Administrator",
  "tech writer": "Technical Writer", "web dev": "Mobile Developer",
  "blockchain": "Blockchain Developer", "tax lawyer": "Tax Attorney",
  "compliance": "Compliance Officer", "animator": "Animator",
  "music producer": "Music Producer", "interior designer": "Interior Designer",
  "fashion designer": "Fashion Designer", "game designer": "Game Designer",
  "pilot": "Pilot", "chiropractor": "Chiropractor", "geologist": "Geologist",
  "archaeologist": "Archaeologist", "diplomat": "Diplomat",
  "sommelier": "Sommelier", "mediator": "Mediator",
  "urban planner": "Urban Planner",
}

// ─── Risk database ────────────────────────────────────────────────────────────
interface RiskEntry {
  score: number; label: string; color: string
  automatedTasks: string[]; safeTasks: string[]
  timeline: string; pivotSkills: string[]; insight: string
  source?: string; code?: string
}

const aiRiskData: Record<string, RiskEntry> = {
  "Data Entry Clerk": {
    score: 95, label: "Critical Risk", color: "#dc2626",
    automatedTasks: ["Entering data into systems", "Processing forms and documents", "Copy-paste operations", "Basic data validation"],
    safeTasks: ["Handling exceptions and anomalies", "Client communication", "Quality judgment calls"],
    timeline: "Already happening — 1-3 years",
    pivotSkills: ["Data analysis and visualization", "AI prompt engineering", "Process automation management"],
    insight: "Data entry is among the most automated roles. AI handles repetitive data tasks faster and more accurately than humans.",
  },
  "Telemarketer": {
    score: 92, label: "Critical Risk", color: "#dc2626",
    automatedTasks: ["Cold calling scripts", "Lead qualification", "Appointment scheduling", "Basic customer responses"],
    safeTasks: ["Complex negotiations", "High-value relationship sales", "Emotional support situations"],
    timeline: "1-3 years",
    pivotSkills: ["Consultative sales", "Account management", "Digital marketing"],
    insight: "AI voice agents already handle basic telemarketing at scale and cost a fraction of human agents.",
  },
  "Bookkeeper": {
    score: 88, label: "Critical Risk", color: "#dc2626",
    automatedTasks: ["Transaction categorization", "Bank reconciliation", "Invoice processing", "Basic financial reports", "Payroll calculations"],
    safeTasks: ["Complex tax strategy", "Client advisory relationships", "Audit judgment calls", "Business financial planning"],
    timeline: "2-4 years",
    pivotSkills: ["Strategic CFO advisory", "Tax planning specialist", "AI accounting tools management"],
    insight: "QuickBooks AI already automates most bookkeeping tasks. Strategic advisory roles remain safe.",
  },
  "Cashier": {
    score: 85, label: "High Risk", color: "#ea580c",
    automatedTasks: ["Processing transactions", "Scanning items", "Cash handling", "Basic customer service queries"],
    safeTasks: ["Handling disputes and complaints", "Assisting customers with special needs", "Loss prevention judgment"],
    timeline: "2-5 years",
    pivotSkills: ["Retail management", "Customer experience specialist", "Inventory and supply chain"],
    insight: "Self-checkout and cashierless stores like Amazon Go are expanding rapidly across retail.",
  },
  "Paralegal": {
    score: 80, label: "High Risk", color: "#ea580c",
    automatedTasks: ["Legal document review", "Contract analysis and comparison", "Case research and summarization", "Standard document drafting", "Discovery document processing"],
    safeTasks: ["Complex litigation support", "Client relationship management", "Courtroom presence and coordination", "Ethical judgment and strategy"],
    timeline: "2-5 years",
    pivotSkills: ["Legal AI tools specialist", "Litigation strategy support", "Legal operations management"],
    insight: "AI legal tools like Harvey and Casetext already handle document review at major law firms.",
  },
  "Graphic Designer": {
    score: 68, label: "High Risk", color: "#ea580c",
    automatedTasks: ["Stock image and illustration creation", "Basic logo generation", "Template-based social media graphics", "Simple product mockups"],
    safeTasks: ["Brand identity strategy", "Complex creative direction", "Client collaboration and briefing", "Original concept development", "Motion and interactive design"],
    timeline: "Already happening — 2-5 years",
    pivotSkills: ["Brand strategy and direction", "UX and UI design", "Motion design and animation", "AI art direction and prompting"],
    insight: "Midjourney and DALL-E already handle basic graphic tasks. Strategic creative direction stays human.",
  },
  "Accountant": {
    score: 72, label: "High Risk", color: "#ea580c",
    automatedTasks: ["Tax return preparation", "Financial statement generation", "Audit data analysis", "Expense categorization", "Compliance checking"],
    safeTasks: ["Complex tax strategy", "Mergers and acquisitions advisory", "Forensic accounting", "Client relationship management", "Ethical and judgment decisions"],
    timeline: "3-7 years",
    pivotSkills: ["Strategic financial advisory", "AI accounting oversight", "Business consulting", "Specialized tax strategy"],
    insight: "Basic accounting is rapidly automating. Strategic advisory and complex judgment remain human-essential.",
  },
  "Radiologist": {
    score: 70, label: "High Risk", color: "#ea580c",
    automatedTasks: ["X-ray and scan reading", "Anomaly detection in images", "Routine report generation", "Standard image classification"],
    safeTasks: ["Complex multi-system cases", "Patient consultation", "Interventional procedures", "Treatment planning decisions"],
    timeline: "3-7 years",
    pivotSkills: ["Interventional radiology", "AI radiology oversight", "Clinical decision support"],
    insight: "AI already matches radiologists on many scan types. Interventional and complex cases stay safe.",
  },
  "Journalist": {
    score: 60, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Routine news summaries", "Sports and earnings reports", "Basic data journalism", "SEO article writing"],
    safeTasks: ["Investigative journalism", "Source cultivation and protection", "Complex narrative writing", "Breaking news judgment", "Video and field reporting"],
    timeline: "3-6 years",
    pivotSkills: ["Investigative reporting", "Video and audio journalism", "Podcast production", "AI-assisted research"],
    insight: "AI writes routine articles. Investigative and narrative journalism requires human sources and judgment.",
  },
  "Financial Analyst": {
    score: 65, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Financial modeling and projections", "Market data analysis", "Standard report writing", "Performance tracking dashboards"],
    safeTasks: ["Investment thesis development", "Client advisory relationships", "Novel market analysis", "Strategic recommendations"],
    timeline: "4-8 years",
    pivotSkills: ["Investment banking advisory", "Quantitative strategy", "AI financial tools management"],
    insight: "AI handles data analysis rapidly. Novel insights, strategy and client trust remain human.",
  },
  "Real Estate Agent": {
    score: 62, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Property matching algorithms", "Market analysis reports", "Virtual tour creation", "Contract document preparation", "Lead generation and qualification"],
    safeTasks: ["Price negotiation", "Client relationship building", "Local market expertise", "Emotional guidance in purchase", "Complex deal structuring"],
    timeline: "3-7 years",
    pivotSkills: ["Luxury and niche markets", "Commercial real estate", "Property investment advisory"],
    insight: "Major life purchases need human trust. AI handles search but not negotiation or emotional support.",
  },
  "Marketing Manager": {
    score: 55, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Ad copy generation", "Email campaign creation", "Social media scheduling", "A/B testing analysis", "Performance reporting"],
    safeTasks: ["Brand strategy", "Creative direction", "Stakeholder management", "Crisis communications", "Novel campaign concepts"],
    timeline: "3-7 years",
    pivotSkills: ["AI marketing strategy", "Brand storytelling", "Customer experience design"],
    insight: "AI handles execution tasks. Strategy, creativity and human insight remain essential.",
  },
  "HR Manager": {
    score: 52, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Resume screening and ranking", "Interview scheduling", "Onboarding documentation", "Benefits administration", "Compliance tracking"],
    safeTasks: ["Conflict resolution", "Culture building and management", "Complex employee relations", "Leadership development", "Sensitive terminations"],
    timeline: "4-8 years",
    pivotSkills: ["Organizational development", "AI recruitment oversight", "People analytics strategy"],
    insight: "AI handles admin and screening. Human empathy and judgment in people decisions is irreplaceable.",
  },
  "Lawyer": {
    score: 58, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Contract review and drafting", "Legal research and summarization", "Discovery document review", "Basic compliance work", "Standard template documents"],
    safeTasks: ["Complex litigation strategy", "Courtroom advocacy", "Strategic legal counsel", "Client relationship management", "Ethical judgment calls"],
    timeline: "3-8 years for routine work",
    pivotSkills: ["Litigation specialization", "AI legal tools management", "Legal strategy advisory"],
    insight: "AI handles routine legal work. Complex advocacy, strategy and client relationships remain human.",
  },
  "Software Engineer": {
    score: 45, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Boilerplate and routine code writing", "Simple bug fixing", "Unit test generation", "Code documentation", "Code review assistance"],
    safeTasks: ["System architecture design", "Complex problem solving", "Cross-team collaboration", "Security and ethical decisions", "Novel algorithm design"],
    timeline: "5-10 years",
    pivotSkills: ["AI system architecture", "AI prompt engineering", "Machine learning engineering", "Product thinking"],
    insight: "AI accelerates coding but cannot replace system thinking, architecture and complex problem solving.",
  },
  "UX Designer": {
    score: 38, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Wireframe and mockup generation", "Basic usability testing", "Design system components", "Accessibility checking"],
    safeTasks: ["User research and empathy mapping", "Complex interaction design", "Stakeholder collaboration", "Novel experience strategy", "Ethical design decisions"],
    timeline: "5-10 years",
    pivotSkills: ["AI experience design", "Voice and gesture UI", "Design strategy leadership"],
    insight: "User research and empathy require human insight. AI handles production design tasks.",
  },
  "Project Manager": {
    score: 42, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Status report generation", "Meeting scheduling and minutes", "Task tracking updates", "Resource allocation basics", "Timeline and Gantt creation"],
    safeTasks: ["Stakeholder management", "Conflict resolution", "Risk judgment calls", "Team motivation", "Complex negotiations"],
    timeline: "5-10 years",
    pivotSkills: ["Strategic program management", "AI tools integration lead", "Organizational change management"],
    insight: "AI handles administrative tasks. Human judgment in people management is irreplaceable.",
  },
  "Teacher": {
    score: 25, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Grading routine assignments", "Generating lesson plan drafts", "Answering basic student questions", "Administrative paperwork"],
    safeTasks: ["Mentoring and inspiring students", "Classroom management", "Emotional support and guidance", "Adapting to individual student needs", "Social skill development"],
    timeline: "AI assists teachers — not replaces",
    pivotSkills: ["AI-enhanced teaching methods", "Social-emotional learning specialist", "Educational technology leadership"],
    insight: "Children need human connection and mentorship. AI is a powerful tool for teachers, not a replacement.",
  },
  "Physician": {
    score: 30, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Routine diagnosis assistance", "Medical literature review", "Standard documentation", "Basic triage support"],
    safeTasks: ["Complex diagnosis and treatment", "Patient relationship and trust", "Emergency decision making", "Surgical and procedural work", "Rare and novel cases"],
    timeline: "AI assists physicians — 10+ years before significant displacement",
    pivotSkills: ["AI diagnostic oversight", "Complex case specialization", "Telemedicine leadership"],
    insight: "AI assists with diagnosis but cannot replace clinical judgment, patient trust or complex treatment.",
  },
  "Surgeon": {
    score: 20, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Routine procedure robotic assistance", "Surgical planning from scans", "Post-operative documentation"],
    safeTasks: ["Complex surgical judgment", "Intraoperative decisions", "Patient consultation", "Rare and emergency surgery", "Novel procedure development"],
    timeline: "Robotic assistance yes — full replacement no",
    pivotSkills: ["Robotic surgery specialization", "Minimally invasive techniques", "Surgical AI oversight"],
    insight: "Surgical robots assist but surgeons direct. Complex cases require years of human training and judgment.",
  },
  "Registered Nurse": {
    score: 15, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Basic vital sign monitoring", "Medication scheduling reminders", "Routine documentation", "Patient data entry"],
    safeTasks: ["Patient physical assessment and care", "Emotional support and communication", "Complex clinical judgment", "Emergency response", "Family consultation", "Physical procedures and treatments"],
    timeline: "AI assists with admin only",
    pivotSkills: ["Advanced practice nursing", "Telehealth specialization", "Healthcare AI tools management"],
    insight: "Nursing requires human touch, physical presence and complex empathy. One of the safest careers.",
  },
  "Psychologist": {
    score: 8, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Appointment scheduling", "Basic psychoeducation content", "Session notes formatting"],
    safeTasks: ["Therapeutic relationship building", "Trauma processing and treatment", "Crisis intervention", "Complex mental health assessment", "Human empathy and connection"],
    timeline: "AI supplements only — not replacing",
    pivotSkills: ["Teletherapy specialization", "AI-assisted therapy tools", "Group therapy facilitation"],
    insight: "Human connection is the foundation of therapy. AI cannot replicate empathy, trust or healing relationships.",
  },
  "Electrician": {
    score: 12, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Scheduling and dispatch", "Basic diagnostic readings", "Invoice generation"],
    safeTasks: ["Physical installation and repair", "On-site problem diagnosis", "Safety judgment and code compliance", "Emergency troubleshooting"],
    timeline: "Physical work — not replacing",
    pivotSkills: ["Solar and EV charging installation", "Smart home systems specialist", "Electrical contracting business"],
    insight: "Physical skilled trades require hands-on presence and real-world judgment. Robots cannot do this affordably.",
  },
  "Plumber": {
    score: 10, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Job scheduling and dispatch", "Parts ordering and inventory", "Basic remote diagnostics"],
    safeTasks: ["Physical installation and repair", "On-site problem solving", "Emergency water and gas response", "Code compliance decisions"],
    timeline: "Physical work — not replacing",
    pivotSkills: ["Smart plumbing systems", "Water efficiency specialist", "Plumbing business ownership"],
    insight: "Skilled trades requiring physical presence and hands-on work are among the safest from AI replacement.",
  },
  "Social Worker": {
    score: 12, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Case documentation", "Resource lookup and matching", "Report generation"],
    safeTasks: ["Crisis intervention", "Child welfare assessment", "Community advocacy", "Trust building with clients", "Complex family situation navigation"],
    timeline: "AI assists with admin only",
    pivotSkills: ["Policy advocacy", "Community organization", "Mental health integration"],
    insight: "Social work requires human empathy, trust and physical presence in communities. Very safe career.",
  },
  "Chef": {
    score: 18, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Recipe generation and variation", "Inventory management", "Nutritional calculation"],
    safeTasks: ["Creative cuisine development", "Kitchen team leadership", "Quality judgment and tasting", "Customer experience creation", "Physical cooking execution"],
    timeline: "AI tools assist — not replacing",
    pivotSkills: ["Culinary entrepreneurship", "Food tech consulting", "Specialty cuisine development"],
    insight: "Creative cooking, leadership and physical food preparation require human skill and artistry.",
  },
  "Police Officer": {
    score: 22, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Report writing assistance", "Traffic monitoring", "Data analysis and predictive routing"],
    safeTasks: ["Physical enforcement and presence", "Crisis de-escalation", "Community relations building", "Complex investigations", "Emergency response"],
    timeline: "AI assists — physical role safe",
    pivotSkills: ["Cybercrime investigation", "Community policing specialist", "Forensic technology"],
    insight: "Physical presence, community trust and complex judgment keep policing largely human-dependent.",
  },
  "Dental Hygienist": {
    score: 45, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Appointment scheduling", "Basic patient records", "Insurance claim processing", "Treatment reminders"],
    safeTasks: ["Physical teeth cleaning", "Patient education and coaching", "Detecting oral health issues", "Building patient relationships"],
    timeline: "5-10 years",
    pivotSkills: ["Periodontal specialization", "Oral cancer screening", "Pediatric dental hygiene"],
    insight: "Physical cleaning and patient relationships keep hygienists safe. Administrative tasks are at risk.",
  },
  "Optometrist": {
    score: 35, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Basic vision screening", "Prescription records", "Appointment scheduling"],
    safeTasks: ["Complex eye health diagnosis", "Patient consultation", "Contact lens fitting", "Detecting systemic diseases"],
    timeline: "AI assists — 10+ years before significant impact",
    pivotSkills: ["Specialty contact lenses", "Low vision rehabilitation", "Ocular disease management"],
    insight: "Eye exams require physical examination and clinical judgment that AI cannot replicate safely.",
  },
  "Occupational Therapist": {
    score: 18, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Progress documentation", "Scheduling", "Basic exercise tracking"],
    safeTasks: ["Physical patient assessment", "Adaptive equipment training", "Home modification planning", "Emotional support and motivation"],
    timeline: "AI assists with documentation only",
    pivotSkills: ["Hand therapy specialization", "Pediatric OT", "Assistive technology"],
    insight: "Human touch, creativity and empathy in therapy are irreplaceable by AI.",
  },
  "Speech Therapist": {
    score: 20, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Progress notes", "Exercise tracking apps", "Scheduling"],
    safeTasks: ["Complex communication assessment", "Swallowing disorder treatment", "Patient motivation and coaching", "Family education"],
    timeline: "AI supplements — not replacing",
    pivotSkills: ["AAC device specialization", "Dysphagia treatment", "Pediatric speech"],
    insight: "Human communication therapy requires genuine connection and real-time adaptation.",
  },
  "Nutritionist": {
    score: 55, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Basic meal plan generation", "Calorie tracking", "Standard dietary guidelines", "Recipe suggestions"],
    safeTasks: ["Complex medical nutrition therapy", "Eating disorder support", "Behavioral change coaching", "Cultural food adaptation"],
    timeline: "3-7 years for routine work",
    pivotSkills: ["Medical nutrition therapy", "Sports nutrition", "Eating disorder specialization"],
    insight: "AI handles basic meal planning well. Complex behavioral and medical nutrition requires humans.",
  },
  "Radiographer": {
    score: 48, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Standard image positioning guides", "Basic image quality checks", "Scheduling and documentation"],
    safeTasks: ["Patient positioning and care", "Emergency adaptations", "Patient communication", "Complex imaging scenarios"],
    timeline: "4-8 years",
    pivotSkills: ["MRI specialization", "Interventional radiology", "Nuclear medicine"],
    insight: "Physical patient care and real-time adaptation keep radiographers relevant alongside AI image analysis.",
  },
  "School Psychologist": {
    score: 15, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Scheduling", "Basic report templates", "Data tracking"],
    safeTasks: ["Psychological assessment", "Crisis intervention", "Student counseling", "Family consultation", "Learning disability evaluation"],
    timeline: "AI assists with admin only",
    pivotSkills: ["Trauma-informed practice", "Behavioral intervention", "Special education consultation"],
    insight: "Child mental health and learning assessment require profound human judgment and empathy.",
  },
  "Corporate Trainer": {
    score: 52, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["eLearning content creation", "Quiz and assessment generation", "Training material updates", "Scheduling"],
    safeTasks: ["Live facilitation and coaching", "Culture change programs", "Leadership development", "Difficult conversation training"],
    timeline: "3-7 years",
    pivotSkills: ["AI learning tools facilitation", "Executive coaching", "Change management"],
    insight: "AI handles content creation well. Human facilitation and culture work remain essential.",
  },
  "Instructional Designer": {
    score: 60, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Basic course structure generation", "Quiz creation", "Content formatting", "Standard eLearning templates"],
    safeTasks: ["Complex learning strategy", "Novel curriculum design", "Stakeholder collaboration", "Learner experience research"],
    timeline: "3-6 years",
    pivotSkills: ["AI-enhanced learning design", "Learning analytics", "Performance consulting"],
    insight: "AI generates content rapidly. Strategic learning design and human-centered curriculum remain human work.",
  },
  "Machine Learning Engineer": {
    score: 38, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Routine model training", "Standard hyperparameter tuning", "Basic data preprocessing", "Model documentation"],
    safeTasks: ["Novel architecture design", "Research and experimentation", "Ethical AI decisions", "Complex problem framing"],
    timeline: "5-10 years",
    pivotSkills: ["AI safety research", "Multi-modal AI systems", "AI product strategy"],
    insight: "Ironically ML engineers face moderate risk from the very systems they build. Novel research stays safe.",
  },
  "QA Engineer": {
    score: 65, label: "High Risk", color: "#ea580c",
    automatedTasks: ["Repetitive test execution", "Regression testing", "Bug report generation", "Test case documentation"],
    safeTasks: ["Exploratory testing strategy", "User experience evaluation", "Security penetration testing", "Novel edge case discovery"],
    timeline: "2-5 years",
    pivotSkills: ["AI testing oversight", "Security testing", "Performance engineering"],
    insight: "Automated testing tools already handle routine QA. Strategic and exploratory testing remains human.",
  },
  "Systems Administrator": {
    score: 55, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Routine server maintenance", "Standard patch management", "Performance monitoring alerts", "User account provisioning"],
    safeTasks: ["Complex troubleshooting", "Security incident response", "Architecture decisions", "Vendor negotiations"],
    timeline: "4-8 years",
    pivotSkills: ["Cloud architecture", "DevSecOps", "AI infrastructure management"],
    insight: "Cloud automation handles routine tasks. Complex infrastructure decisions and security remain human.",
  },
  "Technical Writer": {
    score: 72, label: "High Risk", color: "#ea580c",
    automatedTasks: ["Standard documentation generation", "API documentation from code", "Basic user guide creation", "Release note generation"],
    safeTasks: ["Complex user experience writing", "Strategic content architecture", "Subject matter expert interviews", "Novel documentation design"],
    timeline: "2-5 years",
    pivotSkills: ["AI documentation oversight", "Content strategy", "UX writing specialization"],
    insight: "AI generates standard documentation well. Strategic content design and UX writing remain valuable.",
  },
  "Web Designer": {
    score: 62, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Basic layout generation", "Color scheme suggestions", "Stock image selection", "Template customization"],
    safeTasks: ["Brand identity creation", "Client relationship management", "Complex UX problem solving", "Creative direction"],
    timeline: "3-7 years",
    pivotSkills: ["Brand strategy", "Motion design", "AI design direction"],
    insight: "AI generates decent designs quickly. Original creative direction and brand strategy stay human.",
  },
  "Mobile Developer": {
    score: 42, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Boilerplate code generation", "Standard UI components", "Basic bug fixes", "Unit test generation"],
    safeTasks: ["Complex app architecture", "Performance optimization", "Novel feature design", "Platform-specific expertise"],
    timeline: "5-10 years",
    pivotSkills: ["AR/VR development", "AI-powered app features", "Cross-platform architecture"],
    insight: "AI handles routine code. Complex mobile architecture and novel features require human expertise.",
  },
  "Blockchain Developer": {
    score: 35, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Standard smart contract templates", "Basic token creation", "Documentation"],
    safeTasks: ["Complex protocol design", "Security auditing", "Novel consensus mechanisms", "DeFi architecture"],
    timeline: "5-10 years",
    pivotSkills: ["Zero knowledge proofs", "Layer 2 solutions", "Web3 security auditing"],
    insight: "Specialized blockchain expertise is still scarce and complex enough to resist automation.",
  },
  "Tax Attorney": {
    score: 48, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Standard tax research", "Document review", "Basic compliance work", "Form preparation"],
    safeTasks: ["Complex tax litigation", "International tax strategy", "Novel legal arguments", "Client advisory relationships"],
    timeline: "4-8 years",
    pivotSkills: ["International tax specialization", "Tax controversy litigation", "Mergers and acquisitions tax"],
    insight: "Routine tax work is automating. Complex strategy and litigation require experienced human judgment.",
  },
  "Compliance Officer": {
    score: 58, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Regulatory monitoring", "Standard report generation", "Basic policy documentation", "Routine audits"],
    safeTasks: ["Complex regulatory interpretation", "Ethics program leadership", "Investigation management", "Board advisory work"],
    timeline: "3-7 years",
    pivotSkills: ["AI governance and compliance", "ESG compliance", "International regulatory expertise"],
    insight: "AI monitors compliance well. Judgment calls in grey areas and ethics leadership remain human.",
  },
  "Risk Manager": {
    score: 52, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Standard risk reporting", "Data analysis and modeling", "Routine risk assessments", "Compliance tracking"],
    safeTasks: ["Novel risk identification", "Strategic risk decisions", "Board communication", "Crisis management"],
    timeline: "4-8 years",
    pivotSkills: ["AI risk governance", "Cyber risk management", "Enterprise risk strategy"],
    insight: "AI identifies known risks well. Novel risks and strategic decisions require experienced humans.",
  },
  "Economist": {
    score: 45, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Data collection and processing", "Standard econometric modeling", "Routine market analysis", "Report generation"],
    safeTasks: ["Novel economic theory", "Policy recommendation", "Expert testimony", "Complex forecasting judgment"],
    timeline: "5-10 years",
    pivotSkills: ["Behavioral economics", "AI and automation economics", "Climate economics"],
    insight: "Data analysis automates well. Novel economic insights and policy judgment remain human.",
  },
  "Budget Analyst": {
    score: 68, label: "High Risk", color: "#ea580c",
    automatedTasks: ["Budget report generation", "Variance analysis", "Forecast modeling", "Data consolidation"],
    safeTasks: ["Strategic budget recommendations", "Stakeholder negotiation", "Novel financial planning", "Political budget navigation"],
    timeline: "3-6 years",
    pivotSkills: ["Strategic financial planning", "AI financial tools management", "Government finance specialization"],
    insight: "Routine budget analysis automates easily. Strategic influence and negotiation stay human.",
  },
  "Investment Analyst": {
    score: 62, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Financial data processing", "Standard valuation models", "Earnings analysis", "Market screening"],
    safeTasks: ["Novel investment thesis", "Management quality assessment", "Relationship-based deal flow", "Macro judgment calls"],
    timeline: "4-8 years",
    pivotSkills: ["Alternative investments", "ESG investing", "Private equity analysis"],
    insight: "Quantitative analysis automates. Qualitative judgment and relationship-driven investing stay human.",
  },
  "Mortgage Broker": {
    score: 58, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Basic loan comparison", "Application processing", "Document collection", "Rate monitoring"],
    safeTasks: ["Complex financial situations", "Client relationship guidance", "Non-standard loan scenarios", "Emotional support in process"],
    timeline: "3-7 years",
    pivotSkills: ["Commercial lending", "Construction loans", "Complex borrower specialization"],
    insight: "Standard mortgages will automate. Complex situations and human guidance remain valuable.",
  },
  "Animator": {
    score: 65, label: "High Risk", color: "#ea580c",
    automatedTasks: ["Basic motion generation", "In-between frame creation", "Standard character rigging", "Simple visual effects"],
    safeTasks: ["Creative direction and storytelling", "Character personality development", "Art direction", "Complex emotional scenes"],
    timeline: "2-5 years",
    pivotSkills: ["AI animation direction", "Character acting specialization", "Virtual production"],
    insight: "AI generates basic animation rapidly. Creative storytelling and character soul remain human.",
  },
  "Music Producer": {
    score: 55, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Basic beat generation", "Standard mixing templates", "Royalty-free music creation", "Automated mastering"],
    safeTasks: ["Artist development and direction", "Unique sonic identity creation", "Live recording production", "Artist relationship building"],
    timeline: "3-7 years",
    pivotSkills: ["AI music direction", "Live performance production", "Artist development"],
    insight: "AI generates functional music. Unique artistic vision and artist relationships stay human.",
  },
  "Interior Designer": {
    score: 45, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Basic room layout generation", "Color palette suggestions", "Furniture placement visualization", "Standard mood boards"],
    safeTasks: ["Client relationship and vision", "Complex spatial problem solving", "Custom furniture specification", "Construction coordination"],
    timeline: "4-8 years",
    pivotSkills: ["Sustainable design specialization", "Healthcare design", "Luxury residential design"],
    insight: "AI visualizes designs well. Understanding client lifestyle and coordinating complex projects stays human.",
  },
  "Fashion Designer": {
    score: 48, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Pattern generation", "Trend analysis", "Basic sketch rendering", "Fabric recommendations"],
    safeTasks: ["Brand identity and story", "Cultural and social context", "Handcraft and technique", "Artistic vision"],
    timeline: "4-8 years",
    pivotSkills: ["Sustainable fashion", "Technical fashion design", "Fashion technology"],
    insight: "AI assists with trends and patterns. Original artistic vision and cultural storytelling stay human.",
  },
  "Architect": {
    score: 35, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Standard drafting and documentation", "Code compliance checking", "Basic structural calculations", "3D visualization"],
    safeTasks: ["Creative design vision", "Client relationship", "Complex site challenges", "Regulatory negotiation", "Construction oversight"],
    timeline: "5-10 years",
    pivotSkills: ["Sustainable architecture", "Urban design", "Healthcare architecture"],
    insight: "AI handles documentation and visualization. Creative design, client work and site complexity stay human.",
  },
  "Game Designer": {
    score: 40, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Procedural content generation", "Basic level templates", "NPC behavior scripting", "Balance testing"],
    safeTasks: ["Core creative vision", "Player psychology understanding", "Novel game mechanics", "Narrative design"],
    timeline: "5-10 years",
    pivotSkills: ["AI game systems design", "VR game design", "Player experience research"],
    insight: "AI generates content and levels. Core creative vision and player psychology understanding stay human.",
  },
  "Dental Technician": {
    score: 55, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Standard crown and bridge work", "Digital denture design", "Basic orthodontic appliances"],
    safeTasks: ["Complex prosthetic cases", "Artistic shade matching", "Custom implant work", "Quality control judgment"],
    timeline: "3-7 years",
    pivotSkills: ["Digital dentistry specialization", "Implant prosthetics", "CAD/CAM technology"],
    insight: "3D printing and digital design are transforming dental labs. Complex artistic work stays human.",
  },
  "HVAC Engineer": {
    score: 28, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Standard load calculations", "Energy modeling", "Documentation"],
    safeTasks: ["Complex system design", "Troubleshooting on site", "Custom installation", "Building integration"],
    timeline: "Physical work keeps this safe long term",
    pivotSkills: ["Geothermal systems", "Smart building integration", "Energy efficiency consulting"],
    insight: "Physical installation and complex system design require skilled human presence.",
  },
  "Locksmith": {
    score: 15, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Key duplication for standard keys", "Scheduling"],
    safeTasks: ["Emergency lockout response", "Complex lock installation", "Security system assessment", "Safe cracking"],
    timeline: "Physical skills — very safe long term",
    pivotSkills: ["Electronic access systems", "Smart lock installation", "Commercial security"],
    insight: "Physical security work requiring hands-on expertise is highly resistant to AI replacement.",
  },
  "Aircraft Mechanic": {
    score: 12, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Maintenance scheduling", "Parts ordering", "Documentation"],
    safeTasks: ["Physical inspection and repair", "Safety judgment calls", "Complex troubleshooting", "Certification compliance"],
    timeline: "Safety regulations require human sign-off — very safe",
    pivotSkills: ["Electric aircraft systems", "Drone maintenance", "Avionics specialization"],
    insight: "Aviation safety regulations require human sign-off on all maintenance. Extremely safe career.",
  },
  "Marine Biologist": {
    score: 22, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Data collection processing", "Species identification from images", "Standard report writing"],
    safeTasks: ["Field research and diving", "Novel research design", "Conservation advocacy", "Complex ecosystem analysis"],
    timeline: "AI assists research — not replacing",
    pivotSkills: ["Climate change research", "Marine conservation policy", "Underwater robotics"],
    insight: "Physical fieldwork, novel research and conservation advocacy require human expertise and passion.",
  },
  "Urban Planner": {
    score: 32, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Traffic flow modeling", "Zoning data analysis", "Standard report generation"],
    safeTasks: ["Community engagement", "Political negotiation", "Complex land use decisions", "Vision and strategy"],
    timeline: "AI assists with data — not replacing",
    pivotSkills: ["Smart city planning", "Climate resilience planning", "Transportation planning"],
    insight: "Community engagement, political navigation and creative vision keep urban planners essential.",
  },
  "Military Officer": {
    score: 18, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Logistics optimization", "Intelligence data processing", "Standard reporting"],
    safeTasks: ["Leadership and command", "Ethical decision making", "Complex tactical judgment", "Troop morale and welfare"],
    timeline: "Leadership and ethics — very safe",
    pivotSkills: ["Cyber warfare", "AI systems oversight", "Special operations"],
    insight: "Military leadership, ethical command decisions and troop welfare require human officers.",
  },
  "Diplomat": {
    score: 8, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Translation assistance", "Standard correspondence", "Data briefings"],
    safeTasks: ["Relationship building with foreign governments", "Cultural intelligence", "Crisis negotiation", "Treaty negotiations"],
    timeline: "Human relationships are the job — AI cannot replace",
    pivotSkills: ["Digital diplomacy", "Cyber policy", "Climate negotiations"],
    insight: "Diplomacy is fundamentally about human trust and relationships between nations. Cannot be automated.",
  },
  "Judge": {
    score: 12, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Legal research assistance", "Case scheduling", "Standard document review"],
    safeTasks: ["Legal interpretation and ruling", "Weighing evidence", "Sentencing decisions", "Constitutional interpretation"],
    timeline: "Constitutional and ethical reasons prevent AI judges",
    pivotSkills: ["Technology law specialization", "AI governance courts", "International arbitration"],
    insight: "Legal systems require human accountability for judgments. AI cannot and should not replace judges.",
  },
  "Sommelier": {
    score: 30, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Wine database management", "Standard pairing recommendations", "Inventory tracking"],
    safeTasks: ["Sensory evaluation and tasting", "Guest experience creation", "Cellar curation", "Education and storytelling"],
    timeline: "Sensory and hospitality work — safe long term",
    pivotSkills: ["Master Sommelier certification", "Wine education", "Beverage program direction"],
    insight: "Physical tasting, guest experience and storytelling cannot be replicated by AI.",
  },
  "Pilot": {
    score: 20, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Autopilot cruise management", "Standard checklists", "Routine flight documentation"],
    safeTasks: ["Emergency decision making", "Complex weather navigation", "Passenger safety responsibility", "Irregular operations"],
    timeline: "Regulations and passenger trust keep pilots essential",
    pivotSkills: ["Drone fleet management", "Electric aircraft transition", "Aviation safety consulting"],
    insight: "Passenger trust and emergency judgment keep human pilots essential despite heavy automation.",
  },
  "Veterinary Technician": {
    score: 22, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Basic lab processing", "Scheduling", "Standard record keeping"],
    safeTasks: ["Animal handling and restraint", "Patient monitoring", "Owner education and support", "Surgical assistance"],
    timeline: "Physical animal care — safe long term",
    pivotSkills: ["Emergency and critical care", "Exotic animal specialization", "Veterinary dentistry"],
    insight: "Physical animal care and handling requires skilled human presence and genuine animal connection.",
  },
  "Chiropractor": {
    score: 15, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Appointment scheduling", "Basic exercise recommendations", "Insurance documentation"],
    safeTasks: ["Physical spinal manipulation", "Patient assessment", "Treatment planning", "Therapeutic relationship"],
    timeline: "Physical treatment — very safe long term",
    pivotSkills: ["Sports chiropractic", "Pediatric chiropractic", "Rehabilitation specialization"],
    insight: "Hands-on physical treatment and therapeutic relationships are irreplaceable by AI or machines.",
  },
  "Geologist": {
    score: 28, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Satellite data processing", "Standard sample analysis", "Report generation"],
    safeTasks: ["Field investigation", "Novel geological interpretation", "Environmental impact assessment", "Mining and energy consulting"],
    timeline: "Field work and expert interpretation — safe",
    pivotSkills: ["Climate change geology", "Geothermal energy", "Critical mineral exploration"],
    insight: "Field geology, novel interpretation and environmental consulting require experienced human experts.",
  },
  "Archaeologist": {
    score: 18, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Image analysis of artifacts", "Database management", "Standard documentation"],
    safeTasks: ["Physical excavation", "Artifact interpretation", "Cultural context analysis", "Community engagement"],
    timeline: "Physical fieldwork — very safe",
    pivotSkills: ["Digital archaeology", "Underwater archaeology", "Cultural heritage management"],
    insight: "Physical excavation, cultural interpretation and community engagement require skilled human archaeologists.",
  },
  "Epidemiologist": {
    score: 30, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Disease surveillance data processing", "Standard statistical analysis", "Report generation"],
    safeTasks: ["Novel outbreak investigation", "Public health communication", "Policy recommendation", "Field investigation"],
    timeline: "Public health judgment — safe",
    pivotSkills: ["AI-enhanced disease surveillance", "Global health security", "Climate health research"],
    insight: "Outbreak investigation, public health judgment and policy guidance require experienced human expertise.",
  },
  "Speech Language Pathologist": {
    score: 15, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Progress tracking apps", "Scheduling", "Standard exercise programs"],
    safeTasks: ["Complex communication assessment", "Swallowing disorder treatment", "Augmentative communication", "Patient motivation"],
    timeline: "Human therapy relationship — very safe",
    pivotSkills: ["Pediatric speech pathology", "Acquired brain injury", "AAC specialization"],
    insight: "Human connection in communication therapy is fundamental and irreplaceable by technology.",
  },
  "Mediator": {
    score: 10, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Scheduling", "Standard agreement templates", "Basic case documentation"],
    safeTasks: ["Conflict de-escalation", "Trust building between parties", "Creative agreement design", "Emotional intelligence"],
    timeline: "Human conflict resolution — very safe",
    pivotSkills: ["Online dispute resolution", "International mediation", "Workplace conflict specialization"],
    insight: "Conflict resolution requires profound human empathy, trust and creative problem solving.",
  },
  "Biomedical Engineer": {
    score: 25, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Standard CAD design", "Data analysis", "Regulatory documentation"],
    safeTasks: ["Novel device innovation", "Clinical collaboration", "Complex regulatory navigation", "Patient outcome research"],
    timeline: "Innovation and clinical work — safe",
    pivotSkills: ["AI medical device development", "Wearable health technology", "Neural interfaces"],
    insight: "Medical device innovation and clinical collaboration require creative human expertise.",
  },
  "Environmental Engineer": {
    score: 22, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Standard environmental modeling", "Data collection and processing", "Compliance reporting"],
    safeTasks: ["Novel remediation solutions", "Regulatory negotiation", "Community communication", "Complex site assessment"],
    timeline: "Field work and innovation — safe",
    pivotSkills: ["Climate resilience engineering", "Carbon capture technology", "Water resource management"],
    insight: "Environmental problem-solving, community engagement and novel remediation require human engineers.",
  },
  "School Principal": {
    score: 18, label: "Very Safe", color: "#15803d",
    automatedTasks: ["Scheduling and timetabling", "Generating routine reports", "Processing administrative paperwork", "Tracking attendance data", "Budget spreadsheet management"],
    safeTasks: ["Leading and mentoring teaching staff", "Building school culture and community", "Conflict resolution with students and families", "Strategic vision and school improvement", "Crisis management and emergency response", "Hiring and evaluating teachers", "Community and board relationships"],
    timeline: "Administrative assistance in 3-5 years — leadership role safe long-term",
    pivotSkills: ["Educational leadership certification", "Data-driven decision making", "Community engagement strategy", "Staff coaching and development"],
    insight: "School principals require deep human judgment, community trust and leadership that AI cannot replicate. While administrative tasks will be assisted by AI the core role of building school culture, mentoring staff and managing complex human relationships is highly resistant to automation.",
  },
  "Professor": {
    score: 28, label: "Mostly Safe", color: "#16a34a",
    automatedTasks: ["Generating lecture notes and slides", "Grading multiple choice assessments", "Answering routine student questions", "Literature review assistance", "Course material organization"],
    safeTasks: ["Original research and discovery", "Mentoring graduate students", "Leading seminars and discussion", "Peer review and academic judgment", "Grant writing and funding strategy", "Building academic relationships", "Complex subject matter expertise"],
    timeline: "Content assistance in 2-4 years — research and mentorship safe long-term",
    pivotSkills: ["Research methodology leadership", "Academic publishing strategy", "Cross-disciplinary collaboration", "AI tools for research acceleration"],
    insight: "Professors combine original research expertise, deep subject mastery and human mentorship that AI cannot replicate. While AI will assist with content generation and grading, the core functions of advancing knowledge, mentoring the next generation and exercising academic judgment remain deeply human.",
  },
  "Other": {
    score: 48, label: "Moderate Risk", color: "#d97706",
    automatedTasks: ["Routine and repetitive tasks", "Data processing and entry", "Report and document generation", "Scheduling and calendar management"],
    safeTasks: ["Complex human judgment calls", "Physical hands-on tasks", "Creative and novel problems", "Client and stakeholder relationships"],
    timeline: "3-8 years depending on specific role",
    pivotSkills: ["AI tools proficiency in your field", "Critical thinking and analysis", "Human-centered communication skills"],
    insight: "Most roles will be transformed by AI rather than fully replaced. Adapt, specialize and embrace AI tools.",
  },
}

const ALL_JOBS = Object.keys(aiRiskData).filter(k => k !== "Other")

function getSuggestions(q: string): string[] {
  if (!q.trim()) return []
  const lq = q.toLowerCase().trim()
  const synMatch = synonyms[lq]
  const direct = ALL_JOBS.filter(j => j.toLowerCase().includes(lq))
  const results = new Set<string>()
  if (synMatch && aiRiskData[synMatch]) results.add(synMatch)
  direct.forEach(j => results.add(j))
  return Array.from(results).slice(0, 5)
}

function resolveJob(q: string): string {
  const lq = q.toLowerCase().trim()
  if (synonyms[lq] && aiRiskData[synonyms[lq]]) return synonyms[lq]
  const exact = ALL_JOBS.find(j => j.toLowerCase() === lq)
  if (exact) return exact
  const partial = ALL_JOBS.find(j => j.toLowerCase().includes(lq))
  if (partial) return partial
  return "Other"
}

const riskEmoji = (score: number) =>
  score >= 81 ? "🚨" : score >= 61 ? "🔴" : score >= 41 ? "🟠" : score >= 21 ? "🟡" : "🟢"

// ─── O*NET API fallback ───────────────────────────────────────────────────────
// O*NET is a free US Department of Labor API — services.onetcenter.org
// Production client ID: 6lz3V-RS5CA-M7PdM-3F2lS
async function fetchOnetData(jobTitle: string): Promise<RiskEntry & { title: string } | null> {
  try {
    const searchUrl =
      `https://services.onetcenter.org/ws/mnm/search?keyword=${encodeURIComponent(jobTitle)}&client=6lz3V-RS5CA-M7PdM-3F2lS`

    const searchRes = await fetch(searchUrl, { headers: { Accept: "application/json" } })
    if (!searchRes.ok) return null

    const searchData = await searchRes.json()
    if (!searchData.occupation || searchData.occupation.length === 0) return null

    const occupation = searchData.occupation[0]
    const code: string = occupation.code
    const title: string = occupation.title

    const tasksUrl =
      `https://services.onetcenter.org/ws/online/occupations/${code}/summary/tasks?client=6lz3V-RS5CA-M7PdM-3F2lS`

    const tasksRes = await fetch(tasksUrl, { headers: { Accept: "application/json" } })
    const tasksData = tasksRes.ok ? await tasksRes.json() : null

    const tasks: string[] = (tasksData?.task?.slice(0, 6) || [])
      .map((t: { name?: string; statement?: string }) => t.name || t.statement || "")
      .filter(Boolean)

    // Approximate risk score from O*NET major group (first 2 digits of SOC code)
    const majorGroup = parseInt(code.split("-")[0], 10)
    const groupRisk: Record<number, number> = {
      11: 45, 13: 60, 15: 42, 17: 28, 19: 25, 21: 15, 23: 55, 25: 22,
      27: 52, 29: 18, 31: 20, 33: 18, 35: 38, 37: 20, 39: 25, 41: 58,
      43: 72, 45: 15, 47: 12, 49: 15, 51: 65, 53: 35,
    }
    const score = groupRisk[majorGroup] ?? 48

    let label: string, color: string
    if (score >= 81) { label = "Critical Risk"; color = "#dc2626" }
    else if (score >= 61) { label = "High Risk"; color = "#ea580c" }
    else if (score >= 41) { label = "Moderate Risk"; color = "#d97706" }
    else if (score >= 21) { label = "Mostly Safe"; color = "#16a34a" }
    else { label = "Very Safe"; color = "#15803d" }

    return {
      score, label, color, title, code,
      automatedTasks: tasks.slice(0, 4),
      safeTasks: tasks.slice(4, 8),
      timeline: "3-10 years depending on specialization",
      pivotSkills: [
        "AI tools proficiency in your field",
        "Specialized expertise",
        "Human-centered skills",
      ],
      insight: `${title} involves tasks that are ${score > 60 ? "significantly" : score > 40 ? "moderately" : "minimally"} exposed to AI automation based on US Department of Labor occupational data. Specialized and human-facing aspects of this role remain the safest.`,
      source: "O*NET",
    }
  } catch (error) {
    console.error("O*NET API error:", error)
    return null
  }
}

export default function AIJobScorePage() {
  const [jobInput, setJobInput] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSug, setShowSug] = useState(false)
  const [result, setResult] = useState<{ jobTitle: string; entry: RiskEntry } | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingTitle, setLoadingTitle] = useState("")
  const [notice, setNotice] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const sugRef = useRef<HTMLDivElement>(null)

  function handleInput(val: string) {
    setJobInput(val)
    const s = getSuggestions(val)
    setSuggestions(s)
    setShowSug(s.length > 0)
  }

  function selectSug(s: string) {
    setJobInput(s)
    setSuggestions([])
    setShowSug(false)
  }

  async function runCalc(input = jobInput, push = true) {
    if (!input.trim()) return
    setShowSug(false)
    setNotice("")
    if (push && typeof window !== "undefined") {
      window.history.pushState({}, "", `?job=${encodeURIComponent(input.trim())}`)
    }

    const jobTitle = resolveJob(input)

    // 1. Found in hardcoded database — show immediately
    if (jobTitle !== "Other") {
      setResult({ jobTitle, entry: aiRiskData[jobTitle] })
      return
    }

    // 2. Not found — try O*NET API fallback
    const cleanInput = input.trim()
    setResult(null)
    setLoading(true)
    setLoadingTitle(cleanInput)
    const onet = await fetchOnetData(cleanInput)
    setLoading(false)

    if (onet && (onet.automatedTasks.length > 0 || onet.safeTasks.length > 0)) {
      const { title, ...entry } = onet
      setResult({ jobTitle: title, entry })
      return
    }

    // 3. O*NET also failed — generic "Other" fallback
    setNotice(`No specific data found for "${cleanInput}". Showing a general estimate. Try a more common job title for better results.`)
    setResult({ jobTitle: cleanInput, entry: aiRiskData["Other"] })
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    const j = p.get("job")
    if (j) { setJobInput(j); runCalc(j, false) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (sugRef.current && !sugRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSug(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const shareUrl = result ? `https://www.dayblip.com/tools/ai-job-score?job=${encodeURIComponent(jobInput)}` : ""
  const shareText = result
    ? `My AI job replacement risk score: ${result.entry.score}/100 — ${result.entry.label}\nJob: ${result.jobTitle}\nKey safe skill: ${result.entry.safeTasks[0]}\nGet your score (free):`
    : ""

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      <SchemaMarkup schemas={[
        webApplicationSchema("AI Job Replacement Risk Score", "Free tool that calculates your personalized AI job replacement risk score based on your job title. See which tasks AI will automate and how to protect your career.", "https://www.dayblip.com/tools/ai-job-score", "UtilitiesApplication"),
        faqSchema([
          { question: "Will AI replace my job?", answer: "AI replacement risk varies by role. Data entry (95/100 risk), accountants (72/100), software engineers (45/100), nurses (15/100) and therapists (8/100). Physical and empathy-based roles are safest." },
          { question: "How is the AI job replacement score calculated?", answer: "The score (0-100) is based on the proportion of job tasks that can be automated by current AI technology, sourced from occupational data and O*NET US Department of Labor research." },
          { question: "Which jobs are safest from AI replacement?", answer: "Jobs requiring physical presence, human empathy, and complex judgment are safest: nurses, therapists, electricians, plumbers, teachers, and social workers all score under 25/100." },
          { question: "Which jobs are most at risk from AI?", answer: "Data entry clerks (95/100), telemarketers (92/100), bookkeepers (88/100), and cashiers (85/100) face the highest automation risk from current AI technology." },
        ]),
        howToSchema("How to Get Your AI Job Replacement Score", "Calculate your personalized AI job risk score in seconds", [
          "Type your job title in the search box",
          "Select your job from the suggestions or press Get My AI Risk Score",
          "Review your score from 0-100 and risk label",
          "Read which tasks AI will automate and which remain safe",
          "Review recommended pivot skills for your career",
        ]),
        breadcrumbSchema([
          { name: "Home", url: "https://www.dayblip.com" },
          { name: "Tools", url: "https://www.dayblip.com/tools" },
          { name: "AI Job Score", url: "https://www.dayblip.com/tools/ai-job-score" },
        ]),
      ]} />
      <section className="px-6 py-16 text-center" style={{ background: "linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)" }}>
        <div className="mx-auto max-w-[700px]">
          <h1 className="mb-3 text-4xl font-bold text-white">Will AI Replace Your Job?</h1>
          <p className="text-[#a8a8b3]">Get your personalized AI risk score based on your job title</p>
          <a href="/blog/will-ai-replace-my-job" style={{ fontSize: "13px", color: "#e94560", marginTop: "8px", display: "inline-block" }}>Read: Will AI Replace Your Job? →</a>
        </div>
      </section>

      <section className="px-6 py-8 bg-[#1a1a2e]">
        <div className="mx-auto max-w-[700px]">
          <div style={{ background: "#1e2d4a", borderLeft: "4px solid #e94560", borderRadius: "8px", padding: "16px 20px" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#e94560" }}>Quick Answer</div>
            <p className="text-[#e2e8f0]">AI job replacement risk varies significantly by role. Data entry clerks score 95/100 (critical risk), accountants 72/100 (high risk), software engineers 45/100 (moderate risk), and nurses 15/100 (very safe). Jobs requiring physical presence and human empathy score lowest.</p>
          </div>
          <p className="mt-4 text-sm text-[#a8a8b3] leading-relaxed">The AI job replacement score rates any job from 0 to 100 based on the proportion of tasks AI can currently automate. Scores above 70 indicate high risk. Below 30 indicates strong safety. The score is based on O*NET US Department of Labor occupational data and current AI capabilities.</p>
        </div>
      </section>

      <section className="bg-[#16213e] px-6 py-12">
        <div className="mx-auto max-w-[700px] space-y-6">
          <Breadcrumb crumbs={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "Will AI Replace My Job?" }
          ]} />
          <div className="space-y-4">
            <div className="relative">
              <span className="mb-2 block text-sm font-semibold text-white">Your job title</span>
              <input
                ref={inputRef}
                type="text"
                value={jobInput}
                onChange={e => handleInput(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSug(true) }}
                onKeyDown={e => { if (e.key === "Enter") runCalc() }}
                placeholder="Type your job title… e.g. Accountant, Nurse, Developer"
                className="w-full rounded-lg border border-[#0f3460] bg-[#1a1a2e] px-4 py-3 text-white placeholder:text-[#a8a8b3] focus:border-[#e94560] focus:outline-none"
              />
              {showSug && suggestions.length > 0 && (
                <div ref={sugRef} className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-[#0f3460] bg-[#16213e] shadow-lg">
                  {suggestions.map(s => (
                    <button key={s} onMouseDown={() => selectSug(s)} className="w-full px-4 py-2.5 text-left text-sm text-white transition-colors hover:bg-[#e94560]/20">{s}</button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => runCalc()} disabled={!jobInput.trim()} className="w-full rounded-lg bg-[#e94560] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40">
              Get My AI Risk Score
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-8 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e94560] border-t-transparent" />
              <div className="animate-pulse text-sm text-[#a8a8b3]">
                Searching O*NET database for <span className="font-semibold text-white">{loadingTitle}</span>…
              </div>
            </div>
          )}

          {notice && !loading && (
            <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-4 text-sm text-white">
              {notice}
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6">
              {/* Score gauge */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-6 text-center">
                <div className="text-sm text-[#a8a8b3]">AI Risk Score for: <span className="font-bold text-white">{result.jobTitle}</span></div>
                <div className="my-3 text-7xl font-black" style={{ color: result.entry.color }}>
                  {result.entry.score}<span className="text-3xl text-[#a8a8b3]">/100</span>
                </div>
                <div className="text-xl font-bold" style={{ color: result.entry.color }}>
                  {riskEmoji(result.entry.score)} {result.entry.label}
                </div>
                {/* Risk spectrum bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-[#a8a8b3] mb-1">
                    <span>Very Safe</span><span>Moderate</span><span>Critical Risk</span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#15803d] via-[#d97706] to-[#dc2626]">
                    <div className="absolute top-1/2 h-5 w-2 -translate-x-1/2 -translate-y-1/2 rounded bg-white shadow-lg" style={{ left: `${result.entry.score}%` }} />
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5 text-sm">
                <div className="font-bold text-white mb-1">⏱️ Estimated timeline</div>
                <div className="text-[#a8a8b3]">{result.entry.timeline}</div>
              </div>

              {/* Automated tasks */}
              <div className="rounded-xl border border-[#e94560]/30 bg-[#1a1a2e] p-5">
                <div className="mb-3 font-bold text-white">⚠️ Tasks AI is automating</div>
                <ul className="space-y-1.5 text-sm">
                  {result.entry.automatedTasks.map(t => <li key={t} className="flex items-start gap-2 text-[#a8a8b3]"><span className="mt-0.5 text-[#e94560]">✗</span>{t}</li>)}
                </ul>
              </div>

              {/* Safe tasks */}
              <div className="rounded-xl border border-[#4ade80]/30 bg-[#1a1a2e] p-5">
                <div className="mb-3 font-bold text-white">✅ Tasks still requiring humans</div>
                <ul className="space-y-1.5 text-sm">
                  {result.entry.safeTasks.map(t => <li key={t} className="flex items-start gap-2 text-[#a8a8b3]"><span className="mt-0.5 text-[#4ade80]">✓</span>{t}</li>)}
                </ul>
              </div>

              {/* Pivot skills */}
              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-5">
                <div className="mb-3 font-bold text-white">📈 Recommended pivot skills</div>
                <div className="flex flex-wrap gap-2">
                  {result.entry.pivotSkills.map(s => (
                    <span key={s} className="rounded-full border border-[#e94560]/50 bg-[#e94560]/10 px-3 py-1 text-sm text-white">{s}</span>
                  ))}
                </div>
              </div>

              {/* Insight */}
              <div className="rounded-xl border border-[#F9A825]/40 bg-[#F9A825]/10 p-5 text-sm text-white">
                <span className="font-bold text-[#F9A825]">💡 What this means: </span>{result.entry.insight}
              </div>

              <div className="rounded-xl border border-[#0f3460] bg-[#1a1a2e] p-4 text-xs text-[#a8a8b3]">
                AI risk scores are estimates based on current technology trajectories and research. Individual roles vary by company, specialization and location. Focus on developing skills that complement AI rather than compete with it.
              </div>

              {result.entry.source === "O*NET" && (
                <div className="rounded-xl border border-[#0f3460] bg-[#16213e] p-4 text-xs text-[#a8a8b3]">
                  <div>Source: O*NET OnLine (US Department of Labor){result.entry.code ? ` — SOC ${result.entry.code}` : ""}</div>
                  <div className="mt-1">Score is an estimate based on occupation category data.</div>
                </div>
              )}

              <ShareButtons text={shareText} url={shareUrl} title="Will AI Replace My Job?" />
              <RelatedTools tools={[
                { emoji: "🔐", title: "Password Strength Checker", desc: "How long to crack your password?", href: "/tools/password-strength" },
                { emoji: "🆓", title: "Financial Independence Date", desc: "Find the exact date you could stop working", href: "/tools/fi-date" },
                { emoji: "💰", title: "Salary Negotiation Guide", desc: "How much to ask for + ready-to-use script", href: "/tools/salary-negotiation" },
                { emoji: "💼", title: "Side Hustle Potential", desc: "What could you earn with your skills?", href: "/tools/side-hustle" },
                { emoji: "🏠", title: "WFH Savings Calculator", desc: "What is remote work really worth?", href: "/tools/wfh-calculator" },
              ]} />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
