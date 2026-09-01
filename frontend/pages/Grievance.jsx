import React, { useState } from 'react';

export default function Grievance() {
  const [ticketId, setTicketId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(id);
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '80vh', backgroundColor: '#F8FAFC', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        
        <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#F1F5F9', color: '#0F172A', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
          Citizen Redressal
        </span>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '10px 0 6px' }}>
          File a Grievance
        </h1>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
          Submit a ticket regarding SLA breaches, application delay, or verification disputes.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
            <h2 style={{ fontSize: '18px', color: '#065F46', margin: '0 0 8px' }}>✓ Ticket Registered</h2>
            <p style={{ fontSize: '13px', color: '#047857', margin: 0 }}>Reference ID: <strong>{ticketId}</strong></p>
            <p style={{ fontSize: '12px', color: '#065F46', marginTop: '6px' }}>Our AI triage will route this to the assigned nodal department officer.</p>
            <button 
              onClick={() => { setSubmitted(false); setSubject(''); setDescription(''); }}
              style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: '#0F172A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Submit Another Ticket
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Application Reference
              </label>
              <select style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px' }}>
                <option value="MAHA-2026-99104">MAHA-2026-99104 (Higher Education Scholarship)</option>
                <option value="MAHA-2026-88241">MAHA-2026-88241 (Income Certificate)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Subject / Issue Summary
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g., Delay in stage 3 verification beyond SLA target" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Detailed Description
              </label>
              <textarea 
                rows={4}
                required
                placeholder="Explain the issue encountered..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', backgroundColor: '#0F172A', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
            >
              Submit Grievance Ticket
            </button>
          </form>
        )}

      </div>
    </div>
  );
}