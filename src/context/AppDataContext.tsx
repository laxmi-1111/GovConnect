import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  citizenProfile,
  vaultDocuments,
  initialApplications,
  initialConsents,
  initialGrievances,
  initialNotifications,
} from '../lib/mockData'
import type {
  Application,
  ApplicationStatus,
  CitizenProfile,
  ConsentRecord,
  Grievance,
  AppNotification,
  VaultDocument,
} from '../lib/types'

interface AppDataContextValue {
  profile: CitizenProfile
  documents: VaultDocument[]
  applications: Application[]
  consents: ConsentRecord[]
  grievances: Grievance[]
  notifications: AppNotification[]
  unreadCount: number

  submitApplication: (app: Omit<Application, 'history' | 'status'>) => Application
  grantConsent: (consent: Omit<ConsentRecord, 'status' | 'timestamp' | 'id'>) => void
  denyConsent: (id: string) => void
  revokeConsent: (id: string) => void
  fileGrievance: (g: Pick<Grievance, 'category' | 'description' | 'applicationRef'>) => Grievance
  submitGrievanceFeedback: (id: string, rating: number, comment: string) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

let appCounter = 100000
let consentCounter = 100
let grievanceCounter = 2000

function nowStamp() {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [documents] = useState<VaultDocument[]>(vaultDocuments)
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [consents, setConsents] = useState<ConsentRecord[]>(initialConsents)
  const [grievances, setGrievances] = useState<Grievance[]>(initialGrievances)
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications)

  function submitApplication(app: Omit<Application, 'history' | 'status'>) {
    const record: Application = {
      ...app,
      status: 'Submitted' as ApplicationStatus,
      history: [{ status: 'Submitted', timestamp: nowStamp() }],
    }
    setApplications((prev) => [record, ...prev])
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `${app.serviceName} — submitted`,
        message: `Your application ${app.id} has been received and will be routed to ${app.department}.`,
        read: false,
        timestamp: nowStamp(),
        kind: 'status',
      },
      ...prev,
    ])
    return record
  }

  function grantConsent(consent: Omit<ConsentRecord, 'status' | 'timestamp' | 'id'>) {
    consentCounter += 1
    setConsents((prev) => [
      { ...consent, id: `consent-${consentCounter}`, status: 'allowed', timestamp: nowStamp() },
      ...prev,
    ])
  }

  function denyConsent(id: string) {
    setConsents((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'denied', timestamp: nowStamp() } : c)))
  }

  function revokeConsent(id: string) {
    setConsents((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'revoked', timestamp: nowStamp() } : c)))
  }

  function fileGrievance(g: Pick<Grievance, 'category' | 'description' | 'applicationRef'>) {
    grievanceCounter += 1
    const record: Grievance = {
      id: `GR-2026-${grievanceCounter}`,
      category: g.category,
      description: g.description,
      applicationRef: g.applicationRef,
      status: 'Submitted',
      history: [{ status: 'Submitted', timestamp: nowStamp() }],
    }
    setGrievances((prev) => [record, ...prev])
    return record
  }

  function submitGrievanceFeedback(id: string, rating: number, comment: string) {
    setGrievances((prev) =>
      prev.map((g) => (g.id === id ? { ...g, feedbackRating: rating, feedbackComment: comment } : g)),
    )
  }

  function markNotificationRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <AppDataContext.Provider
      value={{
        profile: citizenProfile,
        documents,
        applications,
        consents,
        grievances,
        notifications,
        unreadCount,
        submitApplication,
        grantConsent,
        denyConsent,
        revokeConsent,
        fileGrievance,
        submitGrievanceFeedback,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}

export function nextApplicationId() {
  appCounter += 1
  return `GC-2026-${appCounter}`
}
