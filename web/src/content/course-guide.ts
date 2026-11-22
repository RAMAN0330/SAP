// Extra detail shown on course pages. Static content: edit here, no database change needed.
// Transaction codes and apps are standard SAP names; roles and fit notes are general guidance, not placement claims.
import type { Track } from '@/lib/api'

export interface ModuleGuide {
  /** Who the module suits best, one sentence. */
  fit: string
  /** Transactions, apps and tools you will use hands-on. */
  tools: string[]
  /** Job titles this module commonly leads to. */
  roles: string[]
}

export const moduleGuide: Record<string, ModuleGuide> = {
  ABAP: {
    fit: 'Graduates with any programming background, and functional consultants who want to read and debug the code behind their configuration.',
    tools: ['SE80 / ADT in Eclipse', 'SE11 Data Dictionary', 'SE18 / SE19 BAdIs', 'ST05 SQL trace', 'SAT runtime analysis', 'SE24 Class Builder', 'CDS views', 'RAP'],
    roles: ['ABAP Developer', 'S/4HANA Technical Consultant', 'RAP / Fiori Back-end Developer'],
  },
  Ariba: {
    fit: 'Procurement, purchasing and vendor-management professionals moving their sourcing experience onto a cloud platform.',
    tools: ['Ariba Sourcing', 'Ariba Contracts', 'Guided Buying', 'Ariba Network', 'Supplier Lifecycle & Performance', 'Cloud Integration Gateway'],
    roles: ['Ariba Functional Consultant', 'Procurement Systems Analyst', 'Source-to-Pay Consultant'],
  },
  Basis: {
    fit: 'System administrators, Linux or database admins and infrastructure engineers who like keeping landscapes healthy.',
    tools: ['STMS transports', 'SM50 / SM66 work processes', 'ST22 dumps', 'ST03N workload', 'SCC4 / SCCL clients', 'SU01 / PFCG', 'HANA Cockpit', 'SUM'],
    roles: ['Basis Administrator', 'SAP Technical Architect', 'HANA Database Administrator'],
  },
  BTP: {
    fit: 'Developers comfortable with JavaScript or Java and ABAP developers moving to cloud-native, clean-core extensions.',
    tools: ['BTP Cockpit', 'SAP Business Application Studio', 'CAP (Node.js)', 'Cloud Foundry CLI', 'XSUAA', 'Destination service', 'Cloud Connector', 'Event Mesh'],
    roles: ['BTP Developer', 'SAP Cloud Architect', 'Full-stack CAP / Fiori Developer'],
  },
  'BW/4HANA': {
    fit: 'Data analysts, SQL developers and reporting specialists who want to own the enterprise warehouse behind finance and sales reports.',
    tools: ['BW Modelling Tools', 'ADSOs', 'Composite Providers', 'Open ODS views', 'ODP extraction', 'BEx / BW Query Designer', 'Process chains', 'SAP Analytics Cloud'],
    roles: ['BW/4HANA Consultant', 'SAP Analytics Developer', 'Data Warehouse Engineer'],
  },
  CPI: {
    fit: 'Integration, API and middleware developers, including people coming from PI/PO, MuleSoft or Boomi.',
    tools: ['Integration Suite', 'iFlow designer', 'Message mapping', 'Groovy scripts', 'OData / SOAP / IDoc adapters', 'Security material', 'Message monitor', 'API Management'],
    roles: ['CPI / Integration Consultant', 'SAP Integration Architect', 'Middleware Developer'],
  },
  EWM: {
    fit: 'Warehouse, logistics and 3PL professionals, and WM consultants moving their customers to S/4HANA.',
    tools: ['/SCWM/MON warehouse monitor', '/SCWM/PRDI inbound', '/SCWM/PRDO outbound', '/SCWM/WAVE', 'RF framework', 'Storage control', 'Physical inventory'],
    roles: ['EWM Functional Consultant', 'Warehouse Solution Architect', 'Logistics Systems Analyst'],
  },
  FICO: {
    fit: 'Accountants, CAs, CMAs, commerce graduates and finance executives who already know the month-end close.',
    tools: ['FB50 / FB60 / FB70 postings', 'F110 payment run', 'OBYC account determination', 'KS01 cost centres', 'AS01 assets', 'Universal Journal (ACDOCA)', 'Fiori Manage Journal Entries'],
    roles: ['FICO Consultant', 'S/4HANA Finance Analyst', 'Controlling Consultant'],
  },
  HCM: {
    fit: 'HR operations and payroll professionals who know how salary, attendance and statutory deductions really work.',
    tools: ['PA30 / PA40 personnel actions', 'PU12 interfaces', 'PC00_M40 India payroll', 'Schemas and PCRs', 'PT60 time evaluation', 'Infotypes', 'Org management PPOME'],
    roles: ['HCM Payroll Consultant', 'Time Management Consultant', 'HRIS Analyst'],
  },
  MM: {
    fit: 'Purchasing, stores and supply-chain professionals who already raise POs and manage vendors.',
    tools: ['ME21N purchase orders', 'ME51N requisitions', 'MIGO goods movements', 'MIRO invoice verification', 'MM60 / MMBE stock', 'Release strategy', 'Pricing procedure'],
    roles: ['MM Consultant', 'Procurement Systems Consultant', 'S/4HANA Sourcing & Procurement Analyst'],
  },
  PM: {
    fit: 'Maintenance engineers, reliability and plant-operations staff who plan or carry out equipment upkeep.',
    tools: ['IE01 equipment', 'IL01 functional locations', 'IW21 notifications', 'IW31 maintenance orders', 'IP41 maintenance plans', 'IP10 scheduling', 'Task lists'],
    roles: ['PM Consultant', 'Asset Management Consultant', 'Maintenance Systems Analyst'],
  },
  PP: {
    fit: 'Production planners, shop-floor supervisors and industrial engineers from discrete or process manufacturing.',
    tools: ['CS01 BOMs', 'CA01 routings', 'MD01N / MD04 MRP', 'CO01 production orders', 'CO11N confirmations', 'Work centres', 'Demand management'],
    roles: ['PP Consultant', 'Manufacturing Systems Analyst', 'S/4HANA Production Consultant'],
  },
  QM: {
    fit: 'Quality engineers, QA/QC analysts and lab staff who run inspections and handle non-conformances.',
    tools: ['QP01 inspection plans', 'QA32 inspection lots', 'QE51N results', 'QA11 usage decision', 'QM01 notifications', 'Quality info records', 'Certificates'],
    roles: ['QM Consultant', 'Quality Systems Analyst', 'Compliance & Validation Consultant'],
  },
  'S/4HANA': {
    fit: 'Experienced ECC consultants in any module who now need to lead or support a move to S/4HANA.',
    tools: ['Readiness Check', 'Simplification List', 'Custom Code Migration app', 'SUM with DMO', 'Migration Cockpit', 'Fiori Launchpad', 'SAP Activate'],
    roles: ['S/4HANA Migration Lead', 'Solution Architect', 'Transformation Consultant'],
  },
  SD: {
    fit: 'Sales operations, order-management, billing and customer-service professionals.',
    tools: ['VA01 sales orders', 'VL01N deliveries', 'VF01 billing', 'V/08 pricing procedure', 'VOV8 document types', 'Credit management', 'Output management'],
    roles: ['SD Consultant', 'Order-to-Cash Consultant', 'S/4HANA Sales Analyst'],
  },
  Security: {
    fit: 'IT audit, access-control and Basis staff who want to own roles, segregation of duties and compliance.',
    tools: ['PFCG roles', 'SU01 / SU10 users', 'SU53 / ST01 traces', 'SUIM reports', 'GRC Access Control', 'Firefighter (EAM)', 'Fiori catalogue security'],
    roles: ['SAP Security Consultant', 'GRC Consultant', 'IT Audit & Controls Analyst'],
  },
  SuccessFactors: {
    fit: 'HR generalists and HRIS professionals moving to cloud HR, including on-premise HCM consultants.',
    tools: ['Employee Central', 'Admin Center', 'Business rules', 'Role-based permissions', 'Recruiting', 'Performance & Goals', 'Integration Center'],
    roles: ['SuccessFactors Consultant', 'Employee Central Specialist', 'HR Technology Analyst'],
  },
  TM: {
    fit: 'Logistics, transport, freight-forwarding and supply-chain professionals who plan or execute shipments.',
    tools: ['Freight units', 'Freight orders', 'Forwarding orders', 'Transportation cockpit', 'Planning profiles', 'Carrier selection', 'Freight settlement', 'Charge management'],
    roles: ['SAP TM Consultant', 'Logistics Solution Consultant', 'Transportation Planning Analyst'],
  },
  WM: {
    fit: 'Warehouse supervisors and logistics staff supporting ECC sites, or preparing for an EWM migration.',
    tools: ['LT01 transfer orders', 'LT12 confirmations', 'LB10 transfer requirements', 'LS01N bins', 'LX02 stock', 'LX23 stock comparison', 'Putaway strategies'],
    roles: ['WM Consultant', 'Warehouse Systems Analyst', 'Logistics Support Consultant'],
  },
}

export interface TrackGuide {
  prerequisites: string[]
}


export const trackGuide: Record<Track, TrackGuide> = {
  Functional: {
    prerequisites: [
      'Comfort with the business process this module covers, from work or study',
      'Basic Excel and confidence explaining a process out loud',
      'No coding needed',
      'A few hours a week for practice between sessions',
    ],
  },
  Technical: {
    prerequisites: [
      'Some programming or system-administration experience, in any language or platform',
      'Basic SQL: SELECT, JOIN, WHERE',
      'A laptop with 8 GB RAM for remote system access',
      'A few hours a week for practice between sessions',
    ],
  },
  Cloud: {
    prerequisites: [
      'Working knowledge of one SAP module or of web development',
      'Comfort with APIs, JSON and the idea of authentication',
      'A free SAP BTP trial account (we help you set it up)',
      'A few hours a week for practice between sessions',
    ],
  },
}

export const courseFaq = [
  {
    q: 'Which level should I choose?',
    a: 'Freshers should start with Level 1: it covers what you need to crack the interview. If you already have 6–18 months on SAP projects, Level 2 gives you the complete module with scenarios. Level 3 is for people with 18–36 months who want to master one topic in depth.',
  },
  {
    q: 'Do I get access to an SAP system?',
    a: 'Yes. SAP server access is included in every level, so you configure and test things yourself instead of only watching slides.',
  },
  {
    q: 'Who teaches the sessions?',
    a: 'Every course is taught by an industry expert with a minimum of 8 years’ SAP experience, who also runs your mock interviews.',
  },
  {
    q: 'What is included apart from the sessions?',
    a: 'Course notes, an interview preparation questionnaire, mock interviews (2 in Level 1, 4 in Level 2), résumé preparation support, SAP Quiz access, documentation preparation and a technical information pack.',
  },
  {
    q: 'How is Level 3 priced?',
    a: 'Level 3 is planned around the topic you want to master, so the number of sessions and the fee depend on that topic. Contact us and we will share a plan and a quote.',
  },
  {
    q: 'Can I pay in instalments?',
    a: 'Online payments are not live yet. Contact us for the current batch dates and payment options.',
  },
]
