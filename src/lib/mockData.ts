import type {
  ServiceDefinition,
  CitizenProfile,
  VaultDocument,
  Application,
  ConsentRecord,
  Grievance,
  AppNotification,
} from './types'

export const citizenProfile: CitizenProfile = {
  name: 'Aditi Rane',
  dob: '14 Mar 2001',
  address: 'Flat 12, Prabhat Society, Kothrud, Pune, Maharashtra 411038',
  phone: '+91 98•••••210',
  aadhaarLast4: '4417',
}

export const vaultDocuments: VaultDocument[] = [
  { id: 'doc-1', name: 'Aadhaar e-KYC record', department: 'Revenue', status: 'verified', issuedDate: '02 Jan 2025' },
  { id: 'doc-2', name: 'Domicile certificate', department: 'Revenue', status: 'verified', issuedDate: '18 Jun 2024' },
  { id: 'doc-3', name: 'Class XII marksheet', department: 'Education', status: 'verified', issuedDate: '30 May 2019' },
  { id: 'doc-4', name: 'Income certificate', department: 'Revenue', status: 'expired', issuedDate: '11 Feb 2023' },
  { id: 'doc-5', name: 'Employment registration', department: 'Labour', status: 'pending', issuedDate: '—' },
]

export const services: ServiceDefinition[] = [
  {
    id: 'income-certificate',
    name: 'Income Certificate',
    department: 'Revenue',
    description: 'An official record of annual household income, used for scholarships, quotas and welfare schemes.',
    popular: true,
    fields: [
      { id: 'name', label: 'Full name', type: 'text', sourceDepartment: 'Revenue', verifiedStatus: 'verified', value: 'Aditi Rane' },
      { id: 'dob', label: 'Date of birth', type: 'date', sourceDepartment: 'Revenue', verifiedStatus: 'verified', value: '14 Mar 2001' },
      { id: 'address', label: 'Residential address', type: 'textarea', sourceDepartment: 'Revenue', verifiedStatus: 'verified', value: 'Flat 12, Prabhat Society, Kothrud, Pune' },
      { id: 'annualIncome', label: 'Annual household income (₹)', type: 'text', sourceDepartment: 'Labour', verifiedStatus: 'stale', value: '' },
      { id: 'occupation', label: 'Occupation', type: 'select', options: ['Salaried', 'Self-employed', 'Student', 'Unemployed', 'Retired'], required: true },
      { id: 'purpose', label: 'Purpose of certificate', type: 'select', options: ['Scholarship', 'Caste-cum-income verification', 'Fee concession', 'Other'], required: true },
    ],
    crossDeptFetches: [
      { department: 'Labour', dataPoint: 'Latest declared annual income', reason: 'To pre-fill and verify your income figure instead of asking you to re-enter it.' },
    ],
  },
  {
    id: 'domicile-certificate',
    name: 'Domicile Certificate',
    department: 'Revenue',
    description: 'Proof of residence in Maharashtra, required for education admissions and government job applications.',
    popular: true,
    fields: [
      { id: 'name', label: 'Full name', type: 'text', sourceDepartment: 'Revenue', verifiedStatus: 'verified', value: 'Aditi Rane' },
      { id: 'address', label: 'Residential address', type: 'textarea', sourceDepartment: 'Revenue', verifiedStatus: 'verified', value: 'Flat 12, Prabhat Society, Kothrud, Pune' },
      { id: 'residedSince', label: 'Resident in Maharashtra since', type: 'date', required: true },
      { id: 'purpose', label: 'Purpose', type: 'select', options: ['Education admission', 'Government recruitment', 'Other'], required: true },
    ],
    crossDeptFetches: [],
  },
  {
    id: 'caste-certificate',
    name: 'Caste Certificate',
    department: 'Revenue',
    description: 'Statutory proof of caste category for reservation benefits in education and employment.',
    fields: [
      { id: 'name', label: 'Full name', type: 'text', sourceDepartment: 'Revenue', verifiedStatus: 'verified', value: 'Aditi Rane' },
      { id: 'fatherName', label: "Father's name", type: 'text', required: true },
      { id: 'caste', label: 'Caste / sub-caste', type: 'text', required: true },
      { id: 'nativePlace', label: 'Native place (taluka, district)', type: 'text', required: true },
    ],
    crossDeptFetches: [],
  },
  {
    id: 'scholarship-post-matric',
    name: 'Post-Matric Scholarship',
    department: 'Education',
    description: 'Financial assistance for students who have cleared Class X, based on family income and marks.',
    popular: true,
    fields: [
      { id: 'name', label: 'Full name', type: 'text', sourceDepartment: 'Revenue', verifiedStatus: 'verified', value: 'Aditi Rane' },
      { id: 'marksheet', label: 'Class X / XII marksheet', type: 'file', sourceDepartment: 'Education', verifiedStatus: 'verified', value: 'Class XII marksheet.pdf' },
      { id: 'income', label: 'Family annual income (₹)', type: 'text', sourceDepartment: 'Revenue', verifiedStatus: 'unavailable', value: '' },
      { id: 'course', label: 'Current course', type: 'text', required: true },
      { id: 'institute', label: 'Institute name', type: 'text', required: true },
    ],
    crossDeptFetches: [
      { department: 'Revenue', dataPoint: 'Family income certificate', reason: "To confirm you meet the scheme's income eligibility without asking for a fresh document." },
    ],
  },
  {
    id: 'ration-card-update',
    name: 'Ration Card — Add Member',
    department: 'Municipal Administration',
    description: 'Add a new family member to an existing household ration card.',
    fee: 50,
    fields: [
      { id: 'cardNumber', label: 'Existing ration card number', type: 'text', required: true },
      { id: 'memberName', label: 'New member full name', type: 'text', required: true },
      { id: 'relation', label: 'Relation to head of household', type: 'select', options: ['Spouse', 'Child', 'Parent', 'Sibling', 'Other'], required: true },
    ],
    crossDeptFetches: [],
  },
  {
    id: 'birth-certificate',
    name: 'Birth Certificate — Duplicate Copy',
    department: 'Municipal Administration',
    description: 'Request a certified duplicate of a birth certificate registered with a Maharashtra municipal body.',
    fee: 100,
    fields: [
      { id: 'name', label: 'Name on original record', type: 'text', required: true },
      { id: 'dob', label: 'Date of birth', type: 'date', required: true },
      { id: 'placeOfBirth', label: 'Place of birth (hospital / area)', type: 'text', required: true },
    ],
    crossDeptFetches: [],
  },
  {
    id: 'employment-registration',
    name: 'Employment Exchange Registration',
    department: 'Labour',
    description: 'Register as a job-seeker with the state employment exchange to access job fairs and referrals.',
    fields: [
      { id: 'name', label: 'Full name', type: 'text', sourceDepartment: 'Revenue', verifiedStatus: 'verified', value: 'Aditi Rane' },
      { id: 'qualification', label: 'Highest qualification', type: 'select', options: ['Below SSC', 'SSC', 'HSC', 'Diploma', "Graduate", "Postgraduate"], required: true },
      { id: 'preferredSector', label: 'Preferred sector', type: 'text', required: true },
    ],
    crossDeptFetches: [],
  },
  {
    id: 'health-scheme-enrolment',
    name: 'Mahatma Phule Jan Arogya Yojana Enrolment',
    department: 'Health',
    description: 'Enrol your household for cashless treatment coverage under the state health assurance scheme.',
    fee: 0,
    fields: [
      { id: 'name', label: 'Head of household', type: 'text', sourceDepartment: 'Revenue', verifiedStatus: 'verified', value: 'Aditi Rane' },
      { id: 'income', label: 'Annual household income (₹)', type: 'text', sourceDepartment: 'Labour', verifiedStatus: 'stale', value: '' },
      { id: 'members', label: 'Number of household members', type: 'text', required: true },
    ],
    crossDeptFetches: [
      { department: 'Labour', dataPoint: 'Latest declared annual income', reason: 'To check your household against the scheme income threshold.' },
    ],
  },
]

export const initialConsents: ConsentRecord[] = [
  {
    id: 'consent-1',
    serviceId: 'scholarship-post-matric',
    serviceName: 'Post-Matric Scholarship',
    department: 'Education',
    dataPoint: 'Class XII marksheet',
    reason: 'To verify your marks without re-uploading the document.',
    status: 'allowed',
    timestamp: '12 Jul 2026, 10:14 AM',
  },
  {
    id: 'consent-2',
    serviceId: 'income-certificate',
    serviceName: 'Income Certificate',
    department: 'Revenue',
    dataPoint: 'Aadhaar e-KYC demographic details',
    reason: 'To pre-fill your name, DOB and address.',
    status: 'allowed',
    timestamp: '02 Jan 2025, 9:02 AM',
  },
]

export const initialApplications: Application[] = [
  {
    id: 'GC-2026-084213',
    serviceId: 'domicile-certificate',
    serviceName: 'Domicile Certificate',
    department: 'Revenue',
    status: 'Under Review',
    history: [
      { status: 'Submitted', timestamp: '24 Aug 2026, 4:41 PM' },
      { status: 'Under Review', timestamp: '25 Aug 2026, 11:02 AM', note: 'Assigned to Tehsildar office, Kothrud circle.' },
    ],
    fields: { name: 'Aditi Rane', purpose: 'Education admission' },
  },
  {
    id: 'GC-2026-079110',
    serviceId: 'scholarship-post-matric',
    serviceName: 'Post-Matric Scholarship',
    department: 'Education',
    status: 'Additional Info Needed',
    history: [
      { status: 'Submitted', timestamp: '02 Aug 2026, 1:15 PM' },
      { status: 'Under Review', timestamp: '04 Aug 2026, 9:30 AM' },
      { status: 'Additional Info Needed', timestamp: '11 Aug 2026, 3:47 PM', note: 'Current-year fee receipt not on file — please attach.' },
    ],
    fields: { institute: 'VNRVJIET' },
  },
  {
    id: 'GC-2026-061007',
    serviceId: 'caste-certificate',
    serviceName: 'Caste Certificate',
    department: 'Revenue',
    status: 'Certificate Issued',
    history: [
      { status: 'Submitted', timestamp: '02 Jun 2026, 10:00 AM' },
      { status: 'Under Review', timestamp: '05 Jun 2026, 2:12 PM' },
      { status: 'Approved', timestamp: '19 Jun 2026, 5:30 PM' },
      { status: 'Certificate Issued', timestamp: '20 Jun 2026, 9:05 AM' },
    ],
    fields: { caste: 'Maratha', nativePlace: 'Satara' },
  },
]

export const initialGrievances: Grievance[] = [
  {
    id: 'GR-2026-01187',
    category: 'Delay in processing',
    description: 'My scholarship application has been in review for over a week beyond the stated SLA.',
    applicationRef: 'GC-2026-079110',
    status: 'In Progress',
    officer: 'R. Deshmukh, Education Dept.',
    history: [
      { status: 'Submitted', timestamp: '13 Aug 2026, 6:20 PM' },
      { status: 'Assigned', timestamp: '14 Aug 2026, 10:00 AM' },
      { status: 'In Progress', timestamp: '18 Aug 2026, 2:40 PM' },
    ],
  },
]

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Additional information needed',
    message: 'Your Post-Matric Scholarship application needs a current-year fee receipt.',
    read: false,
    timestamp: '11 Aug 2026, 3:47 PM',
    kind: 'status',
  },
  {
    id: 'notif-2',
    title: 'Domicile Certificate — under review',
    message: 'Your application GC-2026-084213 was assigned to the Kothrud circle office.',
    read: false,
    timestamp: '25 Aug 2026, 11:02 AM',
    kind: 'status',
  },
  {
    id: 'notif-3',
    title: 'Certificate ready',
    message: 'Your Caste Certificate has been digitally signed and is ready to download.',
    read: true,
    timestamp: '20 Jun 2026, 9:05 AM',
    kind: 'status',
  },
  {
    id: 'notif-4',
    title: 'Grievance update',
    message: 'Your grievance GR-2026-01187 is now In Progress with the Education department.',
    read: true,
    timestamp: '18 Aug 2026, 2:40 PM',
    kind: 'grievance',
  },
]
