import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserRound, FolderLock, Save } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { useLanguage } from '../context/LanguageContext'

const EVENT_TYPES = ['Application status changes', 'Consent activity', 'Grievance updates'] as const
const CHANNELS = ['In-app', 'SMS', 'Email'] as const

export function Profile() {
  const { t, lang, setLang } = useLanguage()
  const { profile, documents } = useAppData()
  const [address, setAddress] = useState(profile.address)
  const [addressDirty, setAddressDirty] = useState(false)
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    'Application status changes-In-app': true,
    'Application status changes-SMS': true,
    'Application status changes-Email': false,
    'Consent activity-In-app': true,
    'Consent activity-SMS': false,
    'Consent activity-Email': false,
    'Grievance updates-In-app': true,
    'Grievance updates-SMS': true,
    'Grievance updates-Email': false,
  })

  function togglePref(key: string) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-100 text-navy-700">
          <UserRound size={22} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-navy-800">{profile.name}</h1>
          <p className="text-xs text-ink/50">Aadhaar-linked ID ending {profile.aadhaarLast4}</p>
        </div>
      </div>

      <section className="rounded-sm border border-line bg-white p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink/40">Personal details</p>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/70">Full name</label>
            <input
              value={profile.name}
              disabled
              className="w-full rounded-sm border border-line bg-navy-50/40 px-3 py-2 text-sm text-ink/70"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/70">Date of birth</label>
            <input
              value={profile.dob}
              disabled
              className="w-full rounded-sm border border-line bg-navy-50/40 px-3 py-2 text-sm text-ink/70"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/70">Residential address</label>
            <textarea
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
                setAddressDirty(e.target.value !== profile.address)
              }}
              rows={2}
              className="w-full rounded-sm border border-line px-3 py-2 text-sm outline-none focus:border-navy-700"
            />
            {addressDirty && (
              <p className="mt-1 text-[11px] text-marigold-600">
                Changing this will flag your address for re-verification with the Revenue Department before it's
                used to pre-fill future forms.
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/70">Mobile number</label>
            <input
              value={profile.phone}
              disabled
              className="w-full rounded-sm border border-line bg-navy-50/40 px-3 py-2 text-sm text-ink/70"
            />
          </div>
        </div>
        <button className="mt-4 flex items-center gap-1.5 rounded-sm bg-navy-700 px-3 py-2 text-xs font-medium text-white hover:bg-navy-800">
          <Save size={13} /> Save changes
        </button>
      </section>

      <section className="mt-4 rounded-sm border border-line bg-white p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/40">Language</p>
        <div className="flex gap-2">
          {(['en', 'mr'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-sm border px-4 py-1.5 text-sm font-medium ${
                lang === l ? 'border-navy-700 bg-navy-50 text-navy-700' : 'border-line text-ink/60'
              }`}
            >
              {l === 'en' ? 'English' : 'मराठी'}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-sm border border-line bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Linked documents</p>
          <Link to="/documents" className="flex items-center gap-1 text-xs font-medium text-navy-700 hover:underline">
            <FolderLock size={12} /> View vault
          </Link>
        </div>
        <p className="text-sm text-ink/60">{documents.length} documents on file across departments.</p>
      </section>

      <section className="mt-4 rounded-sm border border-line bg-white p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/40">Notification channels</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="pb-2 text-left text-xs font-medium text-ink/50">Event</th>
                {CHANNELS.map((c) => (
                  <th key={c} className="pb-2 text-center text-xs font-medium text-ink/50">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EVENT_TYPES.map((event) => (
                <tr key={event} className="border-t border-line">
                  <td className="py-2.5 pr-2 text-xs text-ink/75">{event}</td>
                  {CHANNELS.map((c) => {
                    const key = `${event}-${c}`
                    return (
                      <td key={c} className="text-center">
                        <input
                          type="checkbox"
                          checked={prefs[key]}
                          onChange={() => togglePref(key)}
                          className="h-3.5 w-3.5 accent-navy-700"
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
