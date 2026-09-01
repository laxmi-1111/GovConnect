export type Department =
  | 'Revenue'
  | 'Education'
  | 'Labour'
  | 'Health'
  | 'Municipal Administration'

export type FieldType = 'text' | 'date' | 'select' | 'textarea' | 'file'

export interface FormField {
  id: string
  label: string
  type: FieldType
  options?: string[]
  /** If set, this field is populated from a department that already verified it (once-only principle). */
  sourceDepartment?: Department
  /** Current verification state for a sourced field. */
  verifiedStatus?: 'verified' | 'stale' | 'unavailable'
  value?: string
  required?: boolean
}

export interface ServiceDefinition {
  id: string
  name: string
  department: Department
  description: string
  popular?: boolean
  fee?: number
  fields: FormField[]
  /** Data points that must be pulled from other departments to complete this service, each needing consent. */
  crossDeptFetches: { department: Department; dataPoint: string; reason: string }[]
}

export type ConsentStatus = 'pending' | 'allowed' | 'denied' | 'revoked'

export interface ConsentRecord {
  id: string
  serviceId: string
  serviceName: string
  department: Department
  dataPoint: string
  reason: string
  status: ConsentStatus
  timestamp: string
}

export type ApplicationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Additional Info Needed'
  | 'Approved'
  | 'Rejected'
  | 'Certificate Issued'

export interface ApplicationHistoryEntry {
  status: ApplicationStatus
  timestamp: string
  note?: string
}

export interface Application {
  id: string
  serviceId: string
  serviceName: string
  department: Department
  status: ApplicationStatus
  history: ApplicationHistoryEntry[]
  fields: Record<string, string>
}

export type DocumentStatus = 'verified' | 'pending' | 'expired'

export interface VaultDocument {
  id: string
  name: string
  department: Department
  status: DocumentStatus
  issuedDate: string
}

export type GrievanceStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved'

export interface Grievance {
  id: string
  category: string
  description: string
  applicationRef?: string
  status: GrievanceStatus
  officer?: string
  history: { status: GrievanceStatus; timestamp: string }[]
  feedbackRating?: number
  feedbackComment?: string
}

export interface AppNotification {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: string
  kind: 'status' | 'consent' | 'grievance' | 'system'
}

export interface CitizenProfile {
  name: string
  dob: string
  address: string
  phone: string
  aadhaarLast4: string
}
