import React, { useState } from 'react';

const INITIAL_DOCS = [
  {
    id: 'DOC-ID-01',
    name: 'State Identity Registry Record',
    category: 'Identity Proof',
    authority: 'Unique Identification Authority',
    verifiedDate: '15 Jan 2026',
    status: 'VERIFIED',
    size: '1.2 MB',
    format: 'PDF',
    meta: 'Demo Verification Matched',
  },
  {
    id: 'DOC-INC-2026',
    name: 'Income Certificate (FY 2025-26)',
    category: 'Income Proof',
    authority: 'Revenue Department, Govt of MH',
    verifiedDate: '24 Aug 2026',
    status: 'VERIFIED',
    size: '840 KB',
    format: 'PDF',
    meta: 'Annual Income: ₹1,80,000',
  },
  {
    id: 'DOC-HSC-2025',
    name: 'Class 12th / Qualifying Marksheet',
    category: 'Educational Record',
    authority: 'MSBSHSE State Board',
    verifiedDate: '10 June 2025',
    status: 'VERIFIED',
    size: '2.1 MB',
    format: 'PDF',
    meta: 'Score: 88.4%',
  },
  {
    id: 'DOC-DOM-2024',
    name: 'Domicile & Nationality Certificate',
    category: 'Residence Proof',
    authority: 'District Collectorate Office',
    verifiedDate: '04 Feb 2024',
    status: 'VERIFIED',
    size: '1.5 MB',
    format: 'PDF',
    meta: 'Valid for Lifetime',
  },
];

export default function Documents() {
  const [docsList, setDocsList] = useState(INITIAL_DOCS);
  const [selectedDocs, setSelectedDocs] = useState(['DOC-ID-01', 'DOC-INC-2026']);
  const [syncing, setSyncing] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const toggleSelect = (id) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
    }, 800);
  };

  return (
    <main style={{ padding: '40px 0', minHeight: '80vh' }}>
      <div className="section-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header (Option 3: GovConnect Vault) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="eyebrow" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              GOVCONNECT VAULT
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              Digital Certificates
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B', margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
              Access and attach verified records directly to new scheme applications.
            </p>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0F172A',
              cursor: 'pointer',
            }}
          >
            {syncing ? 'Syncing...' : '↻ Fetch Records'}
          </button>
        </div>

        {/* Clean Status Strip */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>Available Records</span>
            <strong style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{docsList.length} Verified</strong>
          </div>
          <div style={{ width: '1px', height: '28px', backgroundColor: '#E2E8F0' }} />
          <div>
            <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>Auto-Attached</span>
            <strong style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{selectedDocs.length} Selected</strong>
          </div>
          <div style={{ width: '1px', height: '28px', backgroundColor: '#E2E8F0' }} />
          <div>
            <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>Integrity Status</span>
            <strong style={{ fontSize: '14px', fontWeight: 600, color: '#059669' }}>100% Cryptographically Signed</strong>
          </div>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          {docsList.map((doc) => {
            const isSelected = selectedDocs.includes(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => toggleSelect(doc.id)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: isSelected ? '1px solid #0F172A' : '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', borderBottom: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#475569', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {doc.category}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#047857', backgroundColor: '#ECFDF5', padding: '3px 8px', borderRadius: '4px' }}>
                    ✓ {doc.status}
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', margin: '0 0 4px 0', lineHeight: 1.4 }}>
                    {doc.name}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Issued by {doc.authority}</span>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '6px', padding: '10px 12px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#64748B' }}>Detail:</span>
                    <span style={{ fontWeight: 500, color: '#1E293B' }}>{doc.meta}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#64748B' }}>Verified Date:</span>
                    <span style={{ fontWeight: 500, color: '#1E293B' }}>{doc.verifiedDate}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                  <label
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500, color: '#334155', cursor: 'pointer' }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(doc.id)}
                      style={{ accentColor: '#0F172A', cursor: 'pointer' }}
                    />
                    <span>Attach to Form</span>
                  </label>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewDoc(doc);
                    }}
                    style={{ background: 'none', border: 'none', color: '#0F172A', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Preview ↗
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '20px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <div>
            <strong style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'block' }}>
              Ready to submit a new scheme application?
            </strong>
            <span style={{ fontSize: '13px', color: '#64748B' }}>
              Your selected records will automatically satisfy departmental requirements.
            </span>
          </div>

          <button
            onClick={() => (window.location.href = '/application')}
            style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Apply for Services →
          </button>
        </div>

        {/* Preview Modal */}
        {previewDoc && (
          <div
            onClick={() => setPreviewDoc(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 999,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '460px',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: '#0F172A' }}>
                  {previewDoc.name}
                </h3>
                <button
                  onClick={() => setPreviewDoc(null)}
                  style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#64748B' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: '24px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', color: '#94A3B8' }}>📄</div>
                <strong style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'block', marginTop: '10px' }}>
                  Digitally Signed Government Record
                </strong>
                <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '280px', margin: '4px auto 0' }}>
                  Authenticity verified via State Canonical Registry Adapter.
                </p>
                <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 500, color: '#475569', backgroundColor: '#F1F5F9', padding: '4px 10px', borderRadius: '12px', marginTop: '14px' }}>
                  Format: {previewDoc.format} • Size: {previewDoc.size}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}