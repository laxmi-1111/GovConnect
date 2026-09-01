import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  X, 
  FileText, 
  Search
} from 'lucide-react';

interface TimelineItem {
  stage: string;
  date: string;
  status: 'completed' | 'current' | 'action_required' | 'pending';
  remark: string;
}

interface Application {
  id: string;
  service: string;
  department: string;
  applicant: string;
  appliedDate: string;
  status: 'under_review' | 'action_required' | 'issued';
  progressPercent: number;
  currentStage: string;
  timeline: TimelineItem[];
}

const mockApplications: Application[] = [
  {
    id: 'GC-2026-084213',
    service: 'Domicile Certificate',
    department: 'Revenue & Forest Department',
    applicant: 'Aditi Rane',
    appliedDate: '24 Aug 2026',
    status: 'under_review',
    progressPercent: 75,
    currentStage: 'Under Review by Tehsildar',
    timeline: [
      {
        stage: 'Application Submitted',
        date: '24 Aug 2026, 04:41 PM',
        status: 'completed',
        remark: 'Application successfully received at digital gateway.'
      },
      {
        stage: 'Document Verification',
        date: '25 Aug 2026, 09:30 AM',
        status: 'completed',
        remark: 'Proof of Identity, Ration Card, and Proof of Residence verified online.'
      },
      {
        stage: 'Field / Local Inquiry',
        date: '25 Aug 2026, 11:02 AM',
        status: 'current',
        remark: 'Assigned to Tehsildar office, Kothrud circle.'
      },
      {
        stage: 'Certificate Issuance',
        date: 'Pending',
        status: 'pending',
        remark: 'Final digital signature pending by issuing authority.'
      }
    ]
  },
  {
    id: 'GC-2026-079110',
    service: 'Post-Matric Scholarship',
    department: 'Social Justice & Special Assistance',
    applicant: 'Aditi Rane',
    appliedDate: '18 Aug 2026',
    status: 'action_required',
    progressPercent: 40,
    currentStage: 'Additional Document Required',
    timeline: [
      {
        stage: 'Application Submitted',
        date: '18 Aug 2026, 02:15 PM',
        status: 'completed',
        remark: 'College verification form submitted.'
      },
      {
        stage: 'Scrutiny & Assessment',
        date: '20 Aug 2026, 11:00 AM',
        status: 'action_required',
        remark: 'Income Certificate for FY 2025-26 needs re-upload.'
      },
      {
        stage: 'Disbursement Order',
        date: 'Pending',
        status: 'pending',
        remark: 'Awaiting student resolution.'
      }
    ]
  },
  {
    id: 'GC-2026-061007',
    service: 'Caste Certificate',
    department: 'Revenue Department',
    applicant: 'Aditi Rane',
    appliedDate: '10 Aug 2026',
    status: 'issued',
    progressPercent: 100,
    currentStage: 'Certificate Issued & Digitally Signed',
    timeline: [
      {
        stage: 'Application Submitted',
        date: '10 Aug 2026, 10:12 AM',
        status: 'completed',
        remark: 'Initial application submitted with lineage affidavits.'
      },
      {
        stage: 'Sub-Divisional Officer Review',
        date: '12 Aug 2026, 03:40 PM',
        status: 'completed',
        remark: 'All lineage proof approved.'
      },
      {
        stage: 'Certificate Issued',
        date: '14 Aug 2026, 05:20 PM',
        status: 'completed',
        remark: 'Digitally signed document ready for download in DigiLocker Vault.'
      }
    ]
  }
];

export default function Tracking() {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = mockApplications.filter(app => 
    app.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={13} className="text-blue-600" />
            Under Review
          </span>
        );
      case 'action_required':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle size={13} className="text-amber-600" />
            Additional Info Needed
          </span>
        );
      case 'issued':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} className="text-emerald-600" />
            Certificate Issued
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Track My Application</h1>
        <p className="text-sm text-slate-500 mt-0.5">Live status drawer & real-time government tracking file.</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Search by Application ID or Service name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
        />
      </div>

      <div className="space-y-3">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            onClick={() => setSelectedApp(app)}
            className="group bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-slate-50 text-slate-700 rounded-md border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {app.service}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{app.id}</span>
                  <span>•</span>
                  <span>Applied on {app.appliedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {getStatusBadge(app.status)}
              <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedApp(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Live Tracking File</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">{selectedApp.service}</h2>
                  <p className="font-mono text-xs text-slate-500 mt-1">{selectedApp.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200/70 text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Department</span>
                    <span className="font-medium text-slate-800">{selectedApp.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Applicant</span>
                    <span className="font-medium text-slate-800">{selectedApp.applicant}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">Application Progress</span>
                    <span className="font-bold text-blue-700">{selectedApp.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        selectedApp.progressPercent === 100 
                          ? 'bg-emerald-500' 
                          : selectedApp.status === 'action_required' 
                          ? 'bg-amber-500' 
                          : 'bg-blue-600'
                      }`} 
                      style={{ width: `${selectedApp.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-4">
                    Status Timeline
                  </h4>

                  <div className="relative">
                    <div className="absolute left-[9px] top-3 bottom-6 w-0.5 bg-slate-200 z-0" />

                    <div className="space-y-6 relative z-10">
                      {selectedApp.timeline.map((item, idx) => {
                        const isCompleted = item.status === 'completed';
                        const isCurrent = item.status === 'current';
                        const isAction = item.status === 'action_required';

                        return (
                          <div key={idx} className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-0.5">
                              {isCompleted && (
                                <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-emerald-500 flex items-center justify-center text-white ring-4 ring-white shadow-sm">
                                  <CheckCircle2 size={12} strokeWidth={3} />
                                </div>
                              )}
                              {isCurrent && (
                                <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-blue-600 flex items-center justify-center ring-4 ring-blue-100 shadow-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                </div>
                              )}
                              {isAction && (
                                <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-amber-500 flex items-center justify-center text-white ring-4 ring-amber-100 shadow-sm">
                                  <AlertCircle size={12} strokeWidth={3} />
                                </div>
                              )}
                              {!isCompleted && !isCurrent && !isAction && (
                                <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-300 ring-4 ring-white" />
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-baseline justify-between gap-2">
                                <h5 className={`text-sm font-semibold ${
                                  item.status === 'pending' ? 'text-slate-400' : 'text-slate-800'
                                }`}>
                                  {item.stage}
                                </h5>
                                <span className="text-[11px] text-slate-400 whitespace-nowrap">{item.date}</span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1.5 bg-slate-50 p-2.5 rounded-md border border-slate-200/80 leading-relaxed">
                                {item.remark}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Close Tracking File
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}