import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Login } from './pages/Login'
import { ServiceCatalog } from './pages/ServiceCatalog'
import { DynamicForm } from './pages/DynamicForm'
import { Consents } from './pages/Consents'
import { DocumentVault } from './pages/DocumentVault'
import { ApplicationTracking } from './pages/ApplicationTracking'
import { ApplicationDetail } from './pages/ApplicationDetail'
import Tracking from './pages/tracking'
import { Notifications } from './pages/Notifications'
import { Grievances } from './pages/Grievances'
import { GrievanceDetail } from './pages/GrievanceDetail'
import { Profile } from './pages/Profile'

export default function App() {
  // Testing ke liye login bypass (true rakha hai)
  const [authed, setAuthed] = useState(true)

  if (!authed) {
    return <Login onComplete={() => setAuthed(true)} />
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<ServiceCatalog />} />
        <Route path="/apply/:serviceId" element={<DynamicForm />} />

        {/* 1. Original My Applications View */}
        <Route path="/applications" element={<ApplicationTracking />} />
        <Route path="/applications/:id" element={<ApplicationDetail />} />

        {/* 2. Naya Dedicated Drawer-based Live Tracker */}
        <Route path="/tracking" element={<Tracking />} />

        <Route path="/documents" element={<DocumentVault />} />
        <Route path="/consents" element={<Consents />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/grievances" element={<Grievances />} />
        <Route path="/grievances/:id" element={<GrievanceDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}