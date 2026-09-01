import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Star } from 'lucide-react'
import { services } from '../lib/mockData'
import type { Department } from '../lib/types'
import { EmptyState } from '../components/ui/EmptyState'
import { useLanguage } from '../context/LanguageContext'

const DEPARTMENTS: Department[] = ['Revenue', 'Education', 'Labour', 'Health', 'Municipal Administration']

export function ServiceCatalog() {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState<Department | 'all'>('all')

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesDept = dept === 'all' || s.department === dept
      const matchesQuery =
        query.trim().length === 0 ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase())
      return matchesDept && matchesQuery
    })
  }, [query, dept])

  const popular = services.filter((s) => s.popular)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-navy-800">{t('home')}</h1>
        <p className="text-sm text-ink/60">Every department, one search. Verified details carry over automatically.</p>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-sm border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-navy-700"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5">
        <button
          onClick={() => setDept('all')}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-standard ${
            dept === 'all' ? 'border-navy-700 bg-navy-700 text-white' : 'border-line text-ink/60 hover:border-navy-400'
          }`}
        >
          {t('allDepartments')}
        </button>
        {DEPARTMENTS.map((d) => (
          <button
            key={d}
            onClick={() => setDept(d)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-standard ${
              dept === d ? 'border-navy-700 bg-navy-700 text-white' : 'border-line text-ink/60 hover:border-navy-400'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {query.trim().length === 0 && dept === 'all' && popular.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink/50">
            <Star size={12} className="fill-marigold-500 text-marigold-500" /> {t('popular')}
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {popular.map((s) => (
              <Link
                key={s.id}
                to={`/apply/${s.id}`}
                className="w-56 flex-none rounded-sm border border-line bg-white p-3.5 hover:border-navy-400"
              >
                <p className="text-[11px] font-medium uppercase tracking-wide text-marigold-600">{s.department}</p>
                <p className="mt-1 text-sm font-medium text-ink">{s.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching services"
          description="Try a different search term, or clear the department filter."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((s) => (
            <Link
              key={s.id}
              to={`/apply/${s.id}`}
              className="group flex flex-col rounded-sm border border-line bg-white p-4 hover:border-navy-400"
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-navy-400">{s.department}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{s.name}</p>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-ink/55">{s.description}</p>
              <span className="mt-3 flex items-center gap-1 text-xs font-medium text-navy-700">
                {t('apply')}
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
