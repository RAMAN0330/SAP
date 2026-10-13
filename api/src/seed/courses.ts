// Demo catalogue. Prices, counts and instructors are placeholders — replace before launch.
type Level = 'Beginner' | 'Intermediate' | 'Advanced'
type Track = 'Functional' | 'Technical' | 'Cloud'
type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface SeedCourse {
  slug: string
  module: string
  title: string
  track: Track
  level: Level
  weeks: number
  lessons: number
  questions: number
  price: number
  demand: 1 | 2 | 3
  role: string
  description: string
  overview: string
  topics: [string, string, string]
  integration: string
  learn: string[]
  qa: { q: string; a: string; d: Difficulty }[]
}

export const seedCourses: SeedCourse[] = [
  {
    slug: 'sap-abap', module: 'ABAP', title: 'ABAP Developer Track', track: 'Technical', level: 'Intermediate',
    weeks: 12, lessons: 58, questions: 380, price: 4499, demand: 3, role: 'ABAP Developer',
    description: 'Modern ABAP for the coding round: OO patterns, CDS views, RAP basics and performance-safe SQL.',
    overview: 'You will write ABAP the way S/4HANA projects expect it today — clean OO classes, CDS-based data models and enhancement techniques that survive upgrades — and rehearse the live-coding and code-review questions panels lean on.',
    topics: ['Open SQL, internal tables and performance', 'OO ABAP, BAdIs and enhancement framework', 'CDS views and the RESTful programming model'],
    integration: 'Exposing CDS views as OData services and calling BAPIs from custom code.',
    learn: ['Readable, testable OO ABAP', 'CDS views with associations and annotations', 'Choosing user exits vs BAdIs vs implicit enhancements', 'Diagnosing slow selects with SQL trace (ST05)'],
    qa: [
      { d: 'Easy', q: 'What is the difference between a standard, sorted and hashed internal table?', a: 'Standard tables are index-based and searched linearly unless you sort and use BINARY SEARCH. Sorted tables keep a key order, so reads use a binary search automatically. Hashed tables need a unique key and give near-constant read time — ideal for large lookups by full key.' },
      { d: 'Medium', q: 'When would you choose a BAdI over an implicit enhancement?', a: 'Prefer a BAdI whenever SAP offers one at that point: it is an official, upgrade-stable interface with filter support and multiple implementations. Implicit enhancements are a fallback for places without an exit, and they need regression checks after every support pack.' },
      { d: 'Medium', q: 'Why push logic down into CDS views on HANA?', a: 'Aggregations, joins and calculations run in the database next to the data instead of pulling rows into the application server. That cuts data transfer and lets the same model feed Fiori apps, analytics and OData without duplicating logic.' },
      { d: 'Hard', q: 'A report that ran in 2 minutes now takes 40 after go-live. How do you investigate?', a: 'Reproduce it, then trace with ST05 and SAT to separate database time from ABAP time. Typical culprits are SELECTs inside loops, missing WHERE conditions on key fields, or FOR ALL ENTRIES on an empty table. Fix the access pattern first; add indexes only after checking the query plan.' },
    ],
  },
  {
    slug: 'sap-ariba', module: 'Ariba', title: 'Ariba Procurement Track', track: 'Cloud', level: 'Intermediate',
    weeks: 8, lessons: 32, questions: 160, price: 3999, demand: 2, role: 'Ariba Consultant',
    description: 'Sourcing events, contract workspaces and guided buying, plus the S/4HANA integration questions that sink most candidates.',
    overview: 'Covers the source-to-pay story end to end in Ariba: running sourcing events, managing contracts, configuring guided buying and connecting suppliers on the Ariba Network — with the integration and approval-flow scenarios panels love.',
    topics: ['Sourcing events and supplier management', 'Contract workspaces and compliance', 'Guided buying and approval flows'],
    integration: 'Cloud Integration Gateway between Ariba and S/4HANA purchasing.',
    learn: ['Run an RFP sourcing event end to end', 'Design approval rules that auditors accept', 'Supplier enablement on Ariba Network', 'Troubleshoot CIG document failures'],
    qa: [
      { d: 'Easy', q: 'What is the role of Ariba Network in source-to-pay?', a: 'It is the supplier-facing marketplace where purchase orders, order confirmations, ship notices and invoices are exchanged electronically, replacing email and paper with tracked documents.' },
      { d: 'Medium', q: 'How does a purchase order flow from S/4HANA to a supplier through Ariba?', a: 'The PO is created in S/4HANA, sent through the Cloud Integration Gateway to Ariba Network, and delivered to the supplier account. Confirmations and invoices travel back the same route and post against the PO.' },
      { d: 'Medium', q: 'What is guided buying and why do companies adopt it?', a: 'A consumer-style buying front end that steers employees to catalogues, preferred suppliers and policy-compliant forms, which raises spend under management and cuts maverick buying.' },
      { d: 'Hard', q: 'Invoices are stuck in "failed" status in CIG. Walk through your diagnosis.', a: 'Open the CIG transaction tracker to read the exact error, then check cross-reference mapping such as supplier IDs, unit of measure and tax codes. Correct the master data or mapping, reprocess, and add a monitoring alert so the next failure is caught early.' },
    ],
  },
  {
    slug: 'sap-basis', module: 'Basis', title: 'Basis Administration Track', track: 'Technical', level: 'Advanced',
    weeks: 10, lessons: 42, questions: 230, price: 4799, demand: 2, role: 'Basis Administrator',
    description: 'System landscapes, transports, client copies, kernel upgrades and the performance triage scenarios asked in senior rounds.',
    overview: 'Learn to run an SAP landscape like an on-call administrator: transport strategy, user and client management, monitoring, HANA basics and upgrade planning — practised through outage and slowness scenarios.',
    topics: ['Landscape, clients and the transport system', 'Monitoring, work processes and performance', 'HANA administration and upgrades'],
    integration: 'Connecting systems with RFC destinations, SSO and Cloud Connector.',
    learn: ['Design a three-system transport route', 'Read SM50/SM66 and ST22 like a pro', 'Plan a kernel and support-pack upgrade', 'Backup and recovery basics on HANA'],
    qa: [
      { d: 'Easy', q: 'What is the purpose of a transport request?', a: 'It packages configuration and development changes so they can move in a controlled sequence from development to quality to production, keeping every system consistent and auditable.' },
      { d: 'Medium', q: 'Users report the system is slow. What do you check first?', a: 'Look at work-process load in SM50/SM66, then ST03N for response-time breakdown, ST06 for CPU and memory, and database time. That tells you whether it is a single runaway job, resource exhaustion or a database problem.' },
      { d: 'Medium', q: 'Explain the difference between a local and remote client copy.', a: 'A local copy duplicates a client inside the same system; a remote copy pulls data across systems over RFC. Remote is slower and network-sensitive, so large copies usually use client export and import instead.' },
      { d: 'Hard', q: 'A transport failed with return code 8 in production during a cutover. What now?', a: 'Read the import log to find the failing object, check for missing prerequisite transports or version conflicts, and agree a fix with the owning developer. Never re-import blindly — re-import only after the dependency is resolved, and log it in the cutover runbook.' },
    ],
  },
  {
    slug: 'sap-btp', module: 'BTP', title: 'BTP Extension Track', track: 'Cloud', level: 'Advanced',
    weeks: 9, lessons: 36, questions: 190, price: 4999, demand: 3, role: 'BTP Developer',
    description: 'Side-by-side extensions on Business Technology Platform with CAP, destinations, XSUAA security and event-driven patterns.',
    overview: 'The clean-core story every S/4HANA programme now tells: build extensions on BTP instead of modifying the core. You will model services with CAP, secure them, connect to S/4HANA and explain the architecture choices in an interview.',
    topics: ['BTP account model, subaccounts and services', 'CAP services and data modelling', 'Security with XSUAA and role collections'],
    integration: 'Destinations, Cloud Connector and events from S/4HANA to BTP.',
    learn: ['Explain clean core to a business sponsor', 'Build and deploy a CAP service', 'Secure apps with role collections', 'Choose Cloud Foundry vs Kyma'],
    qa: [
      { d: 'Easy', q: 'What does "clean core" mean?', a: 'Keeping the S/4HANA core close to standard by moving custom logic into released APIs and side-by-side extensions, so upgrades stay fast and low-risk.' },
      { d: 'Medium', q: 'What is the role of a destination in BTP?', a: 'A destination stores the URL, authentication and proxy settings for a target system, so applications reference a name instead of hard-coding credentials and endpoints.' },
      { d: 'Medium', q: 'When would you choose Kyma over Cloud Foundry?', a: 'Kyma suits teams that want Kubernetes-native workloads, containers and event-driven microservices. Cloud Foundry is simpler for standard CAP and Node or Java apps that do not need container control.' },
      { d: 'Hard', q: 'Design an extension that reacts when a sales order is created in S/4HANA.', a: 'Publish the business event from S/4HANA to SAP Event Mesh, subscribe with a CAP service on BTP, and call back through a destination via Cloud Connector if write-back is needed. Add retries and dead-letter handling so events are never silently lost.' },
    ],
  },
  {
    slug: 'sap-bw4hana', module: 'BW/4HANA', title: 'BW/4HANA Analytics Track', track: 'Technical', level: 'Advanced',
    weeks: 9, lessons: 38, questions: 185, price: 4599, demand: 2, role: 'BW Consultant',
    description: 'ADSOs, composite providers, extraction and query design for data-warehouse interviews.',
    overview: 'Model a warehouse the BW/4HANA way: from source extraction through ADSOs and composite providers to queries that business users trust. Includes load-failure and reconciliation scenarios.',
    topics: ['Data flows, ODP extraction and ADSOs', 'Composite providers and Open ODS views', 'BW queries and reporting performance'],
    integration: 'Feeding SAP Analytics Cloud and mixing BW with native HANA views.',
    learn: ['Design a layered data flow', 'Pick the right ADSO type', 'Delta handling with ODP', 'Reconcile BW totals with source'],
    qa: [
      { d: 'Easy', q: 'What replaced InfoCubes and classic DSOs in BW/4HANA?', a: 'The Advanced DataStore Object (ADSO) covers both roles, with settings that make it behave like a staging, standard or cube-like object.' },
      { d: 'Medium', q: 'How does delta extraction work through ODP?', a: 'The ODP framework keeps a delta queue per subscriber, so BW requests only records changed since the last successful load and can repeat a failed request safely.' },
      { d: 'Medium', q: 'When would you use a composite provider?', a: 'To combine several providers with unions or joins at query time, giving one reporting layer without physically copying the data.' },
      { d: 'Hard', q: 'Finance says the revenue report is off by 2% versus FI. How do you reconcile?', a: 'Compare at the lowest common grain — company code, period, G/L account — layer by layer from source to query. Check delta failures, filters in transformations, currency conversion and timing of the loads, then document the root cause and add a reconciliation check.' },
    ],
  },
  {
    slug: 'sap-cpi', module: 'CPI', title: 'Cloud Integration Track', track: 'Cloud', level: 'Intermediate',
    weeks: 8, lessons: 34, questions: 175, price: 4299, demand: 3, role: 'Integration Consultant',
    description: 'Integration flows, adapters, mappings and error handling on SAP Integration Suite.',
    overview: 'Build and support integration flows the way projects run them: adapter choice, message mapping, Groovy scripts, security material and monitoring — with interface-failure scenarios for the interview.',
    topics: ['iFlow design and adapter choice', 'Mapping, scripting and content modifiers', 'Security, keystores and monitoring'],
    integration: 'Connecting S/4HANA, SuccessFactors and third-party APIs through Integration Suite.',
    learn: ['Pick SOAP, OData, IDoc or REST adapters', 'Write maintainable Groovy scripts', 'Configure OAuth and certificates', 'Build a retry and alerting pattern'],
    qa: [
      { d: 'Easy', q: 'What is an iFlow?', a: 'An integration flow: a graphical model of how a message enters, is transformed and routed, and leaves SAP Cloud Integration.' },
      { d: 'Medium', q: 'When would you use a Groovy script instead of a message mapping?', a: 'For logic a graphical mapping cannot express cleanly — dynamic headers, complex conditions or calling helper functions. Keep simple field mapping graphical so it stays readable for support teams.' },
      { d: 'Medium', q: 'How do you handle authentication to a third-party REST API?', a: 'Store credentials or OAuth client details as security material, reference them in the HTTP adapter, and rotate them without touching the iFlow.' },
      { d: 'Hard', q: 'Orders fail intermittently with timeouts to a partner API. Design a fix.', a: 'Add exception subprocess handling with a JMS queue so failed messages are persisted and retried with backoff, alert after a threshold, and agree a timeout and rate limit with the partner. Monitor message volume to confirm the root cause.' },
    ],
  },
  {
    slug: 'sap-ewm', module: 'EWM', title: 'EWM Warehouse Track', track: 'Functional', level: 'Advanced',
    weeks: 9, lessons: 40, questions: 205, price: 4699, demand: 2, role: 'EWM Consultant',
    description: 'Inbound, outbound and internal warehouse processes in Extended Warehouse Management, including RF and wave picking.',
    overview: 'Configure a warehouse in embedded EWM: structure, process-oriented storage control, waves and RF frameworks — and practise the go-live hypercare tickets that interviewers ask about.',
    topics: ['Warehouse structure and master data', 'Inbound and outbound processes', 'Waves, RF framework and storage control'],
    integration: 'EWM with S/4HANA inventory management, delivery and quality inspection.',
    learn: ['Model storage types and bins', 'Configure putaway and picking strategies', 'Set up waves for outbound', 'Explain embedded vs decentralised EWM'],
    qa: [
      { d: 'Easy', q: 'What is a warehouse task in EWM?', a: 'The document that moves stock — putaway, picking or internal movement — from a source bin to a destination bin, confirmed by a worker or automation.' },
      { d: 'Medium', q: 'Explain process-oriented storage control.', a: 'It breaks a movement into steps such as unloading, counting, deconsolidation and putaway, so goods pass through work centres in a defined sequence instead of moving in one hop.' },
      { d: 'Medium', q: 'Embedded or decentralised EWM — how do you choose?', a: 'Embedded runs inside S/4HANA and suits most warehouses. Decentralised runs separately for very high-volume or 24/7 sites that must keep working if the ERP is down.' },
      { d: 'Hard', q: 'After go-live, pickers see no tasks for a wave. How do you troubleshoot?', a: 'Check the wave release status and template, warehouse order creation rules, queue assignment to the resource and the RF user setup. Usually the tasks exist but sit in a queue the device is not assigned to.' },
    ],
  },
  {
    slug: 'sap-fico', module: 'FICO', title: 'FICO Finance Track', track: 'Functional', level: 'Intermediate',
    weeks: 10, lessons: 48, questions: 340, price: 4499, demand: 3, role: 'FICO Consultant',
    description: 'General ledger, payables, receivables, assets and controlling — taught as the period-close story panels walk you through.',
    overview: 'Built for accountants moving into SAP as much as for existing consultants: configure the finance backbone of S/4HANA, run a month-end close, and answer the integration and scenario questions that decide FICO interviews.',
    topics: ['Enterprise structure, G/L and the Universal Journal', 'Payables, receivables and asset accounting', 'Cost centres, profit centres and product costing'],
    integration: 'Account determination with MM and SD, and how logistics postings land in finance.',
    learn: ['Configure company codes and ledgers', 'Run a month-end and year-end close', 'Explain the Universal Journal (ACDOCA)', 'Trace MM and SD postings to G/L'],
    qa: [
      { d: 'Easy', q: 'What are the key organisational units in SAP FI and CO?', a: 'Client, company code, chart of accounts, fiscal year variant and business area on the FI side; controlling area, cost centres and profit centres on the CO side. The company-code-to-controlling-area assignment links them.' },
      { d: 'Medium', q: 'What changed with the Universal Journal in S/4HANA?', a: 'FI and CO postings land in one table, ACDOCA, so reconciliation ledgers and many totals tables disappear. Reporting reads line items directly and FI-CO reconciliation is no longer a separate step.' },
      { d: 'Medium', q: 'How does a goods receipt create an accounting entry?', a: 'Automatic account determination (OBYC) uses the valuation class, transaction key and movement type to debit inventory and credit the GR/IR clearing account in the same document.' },
      { d: 'Hard', q: 'Month-end close is blocked by a GR/IR balance nobody can explain. Your steps?', a: 'Run the GR/IR analysis (F.19 or its Fiori successor) by vendor and PO, separate timing differences from quantity or price variances, clear what is matched, and agree adjustments with procurement. Then fix the root cause — usually invoices posted against the wrong PO line.' },
    ],
  },
  {
    slug: 'sap-hcm', module: 'HCM', title: 'HCM Payroll & Time Track', track: 'Functional', level: 'Intermediate',
    weeks: 9, lessons: 40, questions: 210, price: 3999, demand: 1, role: 'HCM Consultant',
    description: 'Organisational management, personnel administration, time and payroll schemas for on-premise HR roles.',
    overview: 'For HR professionals and existing consultants supporting on-premise HCM: org structure, infotypes, time evaluation and payroll schemas and rules, plus the support tickets that dominate HCM interviews.',
    topics: ['Org management and personnel administration', 'Time management and evaluation', 'Payroll schemas, rules and posting'],
    integration: 'Payroll posting to FI and replication to SuccessFactors.',
    learn: ['Model positions and org units', 'Read and debug a payroll log', 'Configure time types and quotas', 'Plan a hybrid HCM–SuccessFactors landscape'],
    qa: [
      { d: 'Easy', q: 'What is an infotype?', a: 'A logical group of employee data such as address, basic pay or bank details, stored with validity dates so the history is kept.' },
      { d: 'Medium', q: 'What is the difference between a schema and a PCR?', a: 'A schema is the ordered list of functions payroll executes; a personnel calculation rule (PCR) holds the detailed logic applied to wage types inside those steps.' },
      { d: 'Medium', q: 'How are payroll results posted to finance?', a: 'Posting runs create documents from payroll results, mapping wage types to symbolic accounts and then to G/L accounts, before transferring to FI.' },
      { d: 'Hard', q: 'An employee was overpaid after a retro change. How do you investigate?', a: 'Compare payroll logs before and after the retro run, find which infotype change triggered recalculation, and check the wage-type processing in the PCRs. Agree a recovery with HR and fix the rule or data for future periods.' },
    ],
  },
  {
    slug: 'sap-mm', module: 'MM', title: 'MM Procurement Track', track: 'Functional', level: 'Beginner',
    weeks: 9, lessons: 44, questions: 290, price: 3999, demand: 3, role: 'MM Consultant',
    description: 'Procure-to-pay from purchase requisition to invoice verification, with the integration questions every MM panel asks.',
    overview: 'A strong first module for supply-chain and purchasing professionals: master data, purchasing documents, inventory and invoice verification, connected into one procure-to-pay story you can tell confidently in an interview.',
    topics: ['Material and vendor master data', 'Purchasing documents and release strategies', 'Inventory management and invoice verification'],
    integration: 'Valuation and account determination with FI, and MRP links with PP.',
    learn: ['Run procure-to-pay end to end', 'Configure release strategies', 'Explain movement types and valuation', 'Handle three-way-match variances'],
    qa: [
      { d: 'Easy', q: 'List the main steps of procure-to-pay in SAP.', a: 'Purchase requisition, purchase order, goods receipt, invoice verification and payment — with each step creating documents that link back to the PO.' },
      { d: 'Medium', q: 'What is a release strategy?', a: 'An approval workflow for purchase requisitions or orders, triggered by classification characteristics such as value, plant or material group.' },
      { d: 'Medium', q: 'What happens in three-way match?', a: 'Invoice verification compares PO price and quantity, goods-receipt quantity and invoice amount. Variances beyond tolerance block the invoice for payment.' },
      { d: 'Hard', q: 'Stock shows in the system but the warehouse cannot find it. What do you check?', a: 'Material documents for recent movements, stock type (unrestricted, quality, blocked), storage location and special stocks such as consignment. Then reconcile with a physical inventory and fix the process that posted to the wrong place.' },
    ],
  },
  {
    slug: 'sap-pm', module: 'PM', title: 'Plant Maintenance Track', track: 'Functional', level: 'Intermediate',
    weeks: 8, lessons: 34, questions: 160, price: 3799, demand: 1, role: 'PM Consultant',
    description: 'Technical objects, notifications, maintenance orders and preventive plans for asset-heavy industries.',
    overview: 'Designed for engineers and maintenance professionals: model equipment and functional locations, run corrective and preventive maintenance, and settle costs — with the scenario questions from manufacturing and utilities projects.',
    topics: ['Functional locations and equipment', 'Notifications and maintenance orders', 'Preventive maintenance plans and scheduling'],
    integration: 'Spare parts with MM, cost settlement with CO.',
    learn: ['Design a technical object hierarchy', 'Run a breakdown order end to end', 'Schedule time- and counter-based plans', 'Settle order costs correctly'],
    qa: [
      { d: 'Easy', q: 'What is the difference between equipment and a functional location?', a: 'A functional location is a place in the plant where work happens; equipment is the individual asset installed there and can be moved between locations with its history kept.' },
      { d: 'Medium', q: 'How does a maintenance plan generate orders?', a: 'Scheduling the plan creates call objects at each due date or counter reading — notifications or orders based on the task list.' },
      { d: 'Medium', q: 'Where do maintenance order costs go?', a: 'Planned and actual costs collect on the order and are settled by settlement rule, typically to a cost centre or asset.' },
      { d: 'Hard', q: 'Preventive orders are not being created for some equipment. Why?', a: 'Check the plan scheduling status and parameters, the call horizon, counter readings for performance-based plans, and whether the equipment or plan is deactivated. Run scheduling overview to confirm.' },
    ],
  },
  {
    slug: 'sap-pp', module: 'PP', title: 'Production Planning Track', track: 'Functional', level: 'Intermediate',
    weeks: 9, lessons: 40, questions: 200, price: 3999, demand: 2, role: 'PP Consultant',
    description: 'BOMs, routings, MRP and production orders for discrete and process manufacturing interviews.',
    overview: 'From demand to finished goods: master data, MRP and capacity, production orders and confirmations — taught with the shop-floor problems that come up in PP interviews.',
    topics: ['BOMs, routings and work centres', 'Demand management and MRP', 'Production orders, confirmations and costing'],
    integration: 'Material staging with MM and WM, order costing with CO.',
    learn: ['Run MRP and read the stock/requirements list', 'Convert planned orders to production orders', 'Configure backflush and confirmations', 'Explain discrete vs process vs repetitive'],
    qa: [
      { d: 'Easy', q: 'What does MRP do?', a: 'It compares requirements with available stock and receipts and proposes planned orders or purchase requisitions to cover shortages on time.' },
      { d: 'Medium', q: 'What is backflushing?', a: 'Automatically posting component goods issues when an operation is confirmed, instead of issuing each component manually.' },
      { d: 'Medium', q: 'Discrete versus repetitive manufacturing — when to use which?', a: 'Discrete uses individual production orders for varying lots; repetitive suits steady, high-volume production on lines with period-based planning and costing.' },
      { d: 'Hard', q: 'MRP keeps proposing orders even though stock exists. Investigate.', a: 'Check stock type and MRP area, safety stock, lot-sizing and rounding, special procurement keys and whether the stock is in a storage location excluded from MRP.' },
    ],
  },
  {
    slug: 'sap-qm', module: 'QM', title: 'Quality Management Track', track: 'Functional', level: 'Beginner',
    weeks: 7, lessons: 30, questions: 150, price: 3499, demand: 1, role: 'QM Consultant',
    description: 'Inspection lots, plans, results recording and usage decisions for regulated and manufacturing industries.',
    overview: 'A practical way in for quality engineers and lab professionals: inspection planning, inspection lots, results and usage decisions, plus quality notifications — tied to the procurement and production processes they protect.',
    topics: ['Master inspection characteristics and plans', 'Inspection lots and results recording', 'Usage decisions and quality notifications'],
    integration: 'Inspection at goods receipt (MM) and in production (PP).',
    learn: ['Build an inspection plan', 'Activate inspection types per material', 'Record results and usage decisions', 'Handle defects with notifications'],
    qa: [
      { d: 'Easy', q: 'What is an inspection lot?', a: 'A request to inspect a specific quantity of material, created manually or automatically, for example at goods receipt.' },
      { d: 'Medium', q: 'What does the usage decision control?', a: 'Whether the inspected stock is accepted or rejected and which stock posting follows — unrestricted, blocked or scrap.' },
      { d: 'Medium', q: 'How is inspection triggered at goods receipt?', a: 'By activating inspection type 01 in the material master QM view, so every relevant GR creates a lot and posts stock to quality inspection.' },
      { d: 'Hard', q: 'Lots are not being created at goods receipt for one plant. Why?', a: 'Check the inspection setup for that material and plant, the movement type configuration, and whether QM in procurement or a quality info record is blocking the flow.' },
    ],
  },
  {
    slug: 'sap-s4hana', module: 'S/4HANA', title: 'S/4HANA Conversion Track', track: 'Functional', level: 'Advanced',
    weeks: 8, lessons: 36, questions: 220, price: 4999, demand: 3, role: 'S/4HANA Lead',
    description: 'Greenfield vs brownfield, simplification items, Fit-to-Standard and the Activate methodology.',
    overview: 'For consultants stepping into S/4HANA programmes: transition paths, readiness checks, data migration and Fiori — practised through programme-level questions asked of leads and senior consultants.',
    topics: ['Transition paths and readiness checks', 'Activate methodology and Fit-to-Standard', 'Data migration cockpit and cutover'],
    integration: 'How Fiori, embedded analytics and BTP change cross-module design.',
    learn: ['Compare greenfield, brownfield and selective', 'Read a simplification item list', 'Plan a migration cockpit load', 'Run a cutover rehearsal'],
    qa: [
      { d: 'Easy', q: 'What are the main S/4HANA transition paths?', a: 'New implementation (greenfield), system conversion (brownfield) and selective data transition, which mixes the two.' },
      { d: 'Medium', q: 'What is a simplification item?', a: 'A documented functional or technical change in S/4HANA versus ECC — such as Business Partner replacing customer and vendor masters — that a conversion must address.' },
      { d: 'Medium', q: 'What happens in a Fit-to-Standard workshop?', a: 'Business users walk through standard processes in a preconfigured system, and gaps are logged as configuration needs, extensions or accepted changes.' },
      { d: 'Hard', q: 'Customer–vendor integration fails during conversion. How do you approach it?', a: 'Run the CVI checks, fix missing number ranges, groupings and mandatory fields, and synchronise in batches via MDS_LOAD_COCKPIT, resolving errors per category before the technical conversion.' },
    ],
  },
  {
    slug: 'sap-sd', module: 'SD', title: 'SD Order-to-Cash Track', track: 'Functional', level: 'Beginner',
    weeks: 9, lessons: 44, questions: 280, price: 3999, demand: 3, role: 'SD Consultant',
    description: 'Order-to-cash: sales documents, pricing, availability check, delivery and billing.',
    overview: 'A popular first module for sales and customer-service professionals: master data, sales documents, the condition technique, delivery and billing — joined into the order-to-cash story interviewers ask you to narrate.',
    topics: ['Sales organisation and customer master', 'Sales documents and the condition technique', 'Delivery, shipping and billing'],
    integration: 'Availability check with MM and PP, revenue postings to FI.',
    learn: ['Run order-to-cash end to end', 'Configure pricing procedures', 'Explain copy control', 'Fix billing-to-accounting errors'],
    qa: [
      { d: 'Easy', q: 'What makes up a sales area?', a: 'Sales organisation, distribution channel and division. Customer master sales data and many controls are maintained per sales area.' },
      { d: 'Medium', q: 'Explain the condition technique in pricing.', a: 'Pricing procedures list condition types; each type uses an access sequence that searches condition tables from specific to general to find the right price, discount or surcharge.' },
      { d: 'Medium', q: 'What does copy control do?', a: 'It defines how data flows from one document to the next — order to delivery, delivery to invoice — including item categories, pricing and quantities.' },
      { d: 'Hard', q: 'Invoices are created but not released to accounting. What do you check?', a: 'Look at the billing document posting status and error log, then account determination (VKOA), missing G/L accounts or tax codes, and blocked periods in FI. Fix the cause and release via the billing release function.' },
    ],
  },
  {
    slug: 'sap-security', module: 'Security', title: 'Security & GRC Track', track: 'Technical', level: 'Intermediate',
    weeks: 8, lessons: 32, questions: 170, price: 4199, demand: 2, role: 'Security Consultant',
    description: 'Roles, authorisations, segregation of duties and audit readiness across S/4HANA and Fiori.',
    overview: 'Design roles that pass audit and still let people work: PFCG roles, authorisation objects, Fiori catalogues and GRC access control — with the access-issue and audit-finding scenarios panels use.',
    topics: ['PFCG roles and authorisation objects', 'Fiori catalogues, groups and spaces', 'GRC access control and SoD'],
    integration: 'Identity provisioning and SSO with BTP and Azure AD.',
    learn: ['Build single and composite roles', 'Troubleshoot with SU53 and ST01', 'Design SoD rules', 'Prepare for an access audit'],
    qa: [
      { d: 'Easy', q: 'What is the difference between a single and a composite role?', a: 'A single role holds transactions, apps and authorisation values; a composite role bundles several single roles for easier assignment.' },
      { d: 'Medium', q: 'A user gets "no authorisation" in a Fiori app. How do you troubleshoot?', a: 'Check the app is in an assigned catalogue, the backend role has the OData service and authorisations, and use SU53 or a trace (STAUTHTRACE) on the backend to find the failing object.' },
      { d: 'Medium', q: 'What is segregation of duties?', a: 'Ensuring no single user can complete a risky end-to-end process alone — for example create a vendor and pay it — by splitting conflicting access between people.' },
      { d: 'Hard', q: 'Auditors found 40 users with SAP_ALL in production. Your plan?', a: 'Remove standing SAP_ALL, move genuine needs to firefighter (emergency) access with logging and review, and document a remediation timeline with owners. Add a monitoring control so it cannot recur silently.' },
    ],
  },
  {
    slug: 'sap-successfactors', module: 'SuccessFactors', title: 'SuccessFactors Employee Central Track', track: 'Cloud', level: 'Intermediate',
    weeks: 9, lessons: 38, questions: 200, price: 4299, demand: 3, role: 'SuccessFactors Consultant',
    description: 'Employee Central foundation, role-based permissions, workflows and integrations for cloud HR roles.',
    overview: 'Configure the cloud HR core that most HR transformations start with: foundation objects, data models, permissions and workflows, plus the integration scenarios to payroll and S/4HANA.',
    topics: ['Foundation objects and data models', 'Role-based permissions', 'Business rules and workflows'],
    integration: 'Employee replication to S/4HANA and payroll via Integration Center.',
    learn: ['Configure the corporate data model', 'Design RBP groups and roles', 'Build rules for hire and job change', 'Plan an EC rollout'],
    qa: [
      { d: 'Easy', q: 'What are foundation objects?', a: 'Organisational, job and pay structures such as legal entity, department, job classification and pay grade that employee records reference.' },
      { d: 'Medium', q: 'How do role-based permissions work?', a: 'Permission roles define what can be seen or done; permission groups define who is granted and which target population they act on.' },
      { d: 'Medium', q: 'What is a business rule used for in EC?', a: 'To default values, validate data or trigger workflows on events such as hire, change or save.' },
      { d: 'Hard', q: 'Managers can see salary data they should not. How do you fix it?', a: 'Audit the permission roles granted to managers, check target populations and field-level permissions for compensation fields, correct the role, and re-test with proxy before closing.' },
    ],
  },
  {
    slug: 'sap-wm', module: 'WM', title: 'Warehouse Management Track', track: 'Functional', level: 'Beginner',
    weeks: 7, lessons: 30, questions: 140, price: 3499, demand: 1, role: 'WM Consultant',
    description: 'Classic WM: storage types, transfer orders and strategies — and how it maps to EWM.',
    overview: 'For warehouse and logistics professionals supporting ECC landscapes: storage structure, transfer requirements and orders, putaway and picking strategies — with a bridge to EWM for migration conversations.',
    topics: ['Warehouse structure and storage types', 'Transfer requirements and transfer orders', 'Putaway and picking strategies'],
    integration: 'Inventory management link with MM and delivery picking for SD.',
    learn: ['Configure storage types and bins', 'Create and confirm transfer orders', 'Pick strategies like FIFO and fixed bin', 'Map WM concepts to EWM'],
    qa: [
      { d: 'Easy', q: 'What is a transfer order?', a: 'The WM document that executes a physical stock movement between bins, created from a transfer requirement or directly.' },
      { d: 'Medium', q: 'Name common putaway strategies.', a: 'Fixed bin, open storage, next empty bin and addition to existing stock — chosen per storage type.' },
      { d: 'Medium', q: 'How does WM link to inventory management?', a: 'IM tracks stock at storage-location level; WM manages it at bin level. Goods movements create transfer requirements that WM fulfils with transfer orders.' },
      { d: 'Hard', q: 'IM and WM stock no longer match. How do you reconcile?', a: 'Compare stock per material with LX23 or similar reports, check open transfer requirements and interim storage types, and clear or post differences after root-cause analysis.' },
    ],
  },
]

// Itinerary used for every course; lessons 2–4 come from each course's topics.
export function lessonsFor(c: SeedCourse) {
  return [
    { title: `Orientation: ${c.module} roles and the interview map`, description: 'Where this module sits on a project, who hires for it, and the question patterns you will meet.', minutes: 30 },
    { title: c.topics[0], description: 'Configuration walkthrough with the business reason behind each setting.', minutes: 75 },
    { title: c.topics[1], description: 'Build it in the system, then explain it back as you would to a panel.', minutes: 80 },
    { title: c.topics[2], description: 'The deeper layer senior interviewers probe for.', minutes: 70 },
    { title: 'Integration touchpoints', description: c.integration, minutes: 55 },
    { title: 'Support tickets and rollout scenarios', description: 'Realistic incidents and change requests, solved step by step.', minutes: 65 },
    { title: 'Question bank drill', description: 'Rapid-fire and scenario rounds with model answers.', minutes: 90 },
    { title: 'Mock panel and debrief', description: 'A recorded panel-style round scored on a written rubric.', minutes: 60 },
    { title: 'Résumé and outreach plan', description: 'Turn your preparation into a profile that clears screening.', minutes: 40 },
  ]
}
