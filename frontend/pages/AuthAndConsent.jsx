import React, { useState } from 'react';

export default function AuthAndConsent({ onLoginSuccess }) {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('MOBILE'); // 'MOBILE' | 'OTP' | 'CONSENT'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentSaved, setConsentSaved] = useState(false);

  const [permissions, setPermissions] = useState([
    {
      id: 'identity',
      department: 'Identity & Civil Registration',
      code: 'IDENTITY',
      description: 'Fetch verified citizen identity, age, and permanent address.',
      attributes: ['Full Name', 'DOB', 'Permanent Address', 'Gender'],
      isMandatory: true,
      granted: true,
    },
    {
      id: 'income',
      department: 'Revenue & Income Department',
      code: 'INCOME',
      description: 'Verify annual family income and active certificate validity.',
      attributes: ['Annual Income', 'Certificate No.', 'Issue Date'],
      isMandatory: false,
      granted: false,
    },
    {
      id: 'education',
      department: 'Higher & Technical Education',
      code: 'EDUCATION',
      description: 'Access 10th/12th academic marksheets and passing certificates.',
      attributes: ['Enrollment No.', 'Aggregate %', 'Passing Year'],
      isMandatory: false,
      granted: false,
    },
    {
      id: 'bank',
      department: 'Direct Benefit Transfer (DBT)',
      code: 'BANK',
      description: 'Verify bank account IFSC and beneficiary name matching.',
      attributes: ['Account Mask', 'IFSC Code', 'Holder Verification'],
      isMandatory: false,
      granted: false,
    },
  ]);

  const handleToggle = (id) => {
    setPermissions((prev) =>
      prev.map((item) =>
        item.id === id && !item.isMandatory ? { ...item, granted: !item.granted } : item
      )
    );
  };

  const handleGrantAll = () => {
    setPermissions((prev) => prev.map((item) => ({ ...item, granted: true })));
  };

  const handleRevokeOptional = () => {
    setPermissions((prev) =>
      prev.map((item) => (item.isMandatory ? item : { ...item, granted: false }))
    );
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (mobile.length === 10) setStep('OTP');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '123456') {
      setStep('CONSENT');
    } else {
      alert('Demo OTP is 123456');
    }
  };

  const handleConfirmConsent = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setConsentSaved(true);
      if (onLoginSuccess) onLoginSuccess();
    }, 700);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header Tag */}
        <div style={styles.headerBox}>
          <span style={styles.badge}>GovConnect Interoperability Access</span>
          <h1 style={styles.title}>
            {step === 'CONSENT' ? 'Data Sharing & Consent Manager' : 'Citizen Authentication'}
          </h1>
          <p style={styles.subtitle}>
            {step === 'CONSENT'
              ? 'Control which department registries can securely share verified records with your profile.'
              : 'Log in securely with your mobile number to view and apply for services.'}
          </p>
        </div>

        {/* STEP 1: Phone Input */}
        {step === 'MOBILE' && (
          <form onSubmit={handleSendOtp} style={styles.form}>
            <label style={styles.label}>Mobile Number</label>
            <div style={styles.inputGroup}>
              <span style={styles.prefix}>+91</span>
              <input
                type="tel"
                maxLength={10}
                required
                placeholder="98765 43210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                style={styles.phoneInput}
              />
            </div>

            <button
              type="submit"
              disabled={mobile.length !== 10}
              style={{
                ...styles.primaryButton,
                opacity: mobile.length === 10 ? 1 : 0.6,
                cursor: mobile.length === 10 ? 'pointer' : 'not-allowed',
              }}
            >
              Send Verification OTP
            </button>
          </form>
        )}

        {/* STEP 2: OTP Entry */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} style={styles.form}>
            <div style={styles.otpNotice}>
              <span>Code sent to <strong>+91 {mobile}</strong></span>
              <button
                type="button"
                onClick={() => setStep('MOBILE')}
                style={styles.textLink}
              >
                Change
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <label style={styles.label}>Enter 6-Digit OTP</label>
              <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>Demo: 123456</span>
            </div>

            <input
              type="text"
              maxLength={6}
              required
              autoFocus
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              style={styles.otpInput}
            />

            <button
              type="submit"
              disabled={otp.length !== 6}
              style={{
                ...styles.primaryButton,
                opacity: otp.length === 6 ? 1 : 0.6,
                cursor: otp.length === 6 ? 'pointer' : 'not-allowed',
              }}
            >
              Verify & Proceed
            </button>
          </form>
        )}

        {/* STEP 3: Granular Consent Dashboard */}
        {step === 'CONSENT' && !consentSaved && (
          <div style={styles.form}>
            <div style={styles.consentTopBar}>
              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Connected Registries</span>
              <div>
                <button type="button" onClick={handleGrantAll} style={styles.quickActionBtn}>
                  Grant All
                </button>
                <span style={{ margin: '0 6px', color: '#CBD5E1' }}>•</span>
                <button type="button" onClick={handleRevokeOptional} style={{ ...styles.quickActionBtn, color: '#64748B' }}>
                  Revoke Optional
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {permissions.map((item) => (
                <div
                  key={item.id}
                  style={{
                    ...styles.permissionCard,
                    backgroundColor: item.granted ? '#ffffff' : '#f8fafc',
                    borderColor: item.granted ? '#cbd5e1' : '#e2e8f0',
                    opacity: item.granted ? 1 : 0.7,
                  }}
                >
                  <div style={{ flex: 1, paddingRight: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: 14, color: '#0F172A' }}>{item.department}</strong>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: 4,
                          backgroundColor: item.isMandatory ? '#f1f5f9' : '#ecfdf5',
                          color: item.isMandatory ? '#475569' : '#047857',
                        }}
                      >
                        {item.isMandatory ? 'Mandatory' : 'Revocable'}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748B', lineHeight: 1.4 }}>
                      {item.description}
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                      {item.attributes.map((attr) => (
                        <span key={attr} style={styles.attrChip}>
                          {attr}
                        </span>
                      ))}
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={item.granted}
                    disabled={item.isMandatory}
                    onChange={() => handleToggle(item.id)}
                    style={{ width: 18, height: 18, cursor: item.isMandatory ? 'not-allowed' : 'pointer', marginTop: 4 }}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleConfirmConsent}
              disabled={isSubmitting}
              style={{ ...styles.primaryButton, marginTop: 16 }}
            >
              {isSubmitting ? 'Recording on Consent Ledger...' : 'Confirm Consent & Proceed'}
            </button>
          </div>
        )}

        {/* Success Confirmation */}
        {consentSaved && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={styles.successIcon}>✓</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '12px 0 6px 0' }}>
              Consent Preferences Saved
            </h2>
            <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
              Your interoperability permissions have been securely recorded on the GovConnect ledger.
            </p>
            <button
              onClick={() => (window.location.href = '/')}
              style={{ ...styles.primaryButton, marginTop: 20, width: 'auto', padding: '10px 24px' }}
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 90px)',
    backgroundColor: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px 16px',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '560px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    padding: '32px',
  },
  headerBox: {
    marginBottom: '24px',
  },
  badge: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#0F172A',
    backgroundColor: '#F1F5F9',
    padding: '4px 10px',
    borderRadius: '6px',
    display: 'inline-block',
  },
  title: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#0F172A',
    margin: '10px 0 6px 0',
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748B',
    margin: 0,
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#475569',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  prefix: {
    padding: '10px 14px',
    backgroundColor: '#F8FAFC',
    borderRight: '1px solid #E2E8F0',
    color: '#64748B',
    fontWeight: 600,
    fontSize: '14px',
  },
  phoneInput: {
    flex: 1,
    padding: '10px 14px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontWeight: 500,
  },
  otpInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    textAlign: 'center',
    letterSpacing: '0.4em',
    fontSize: '20px',
    fontWeight: 700,
    outline: 'none',
    boxSizing: 'border-box',
  },
  otpNotice: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#475569',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textLink: {
    background: 'none',
    border: 'none',
    color: '#0F172A',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  primaryButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '6px',
    transition: 'background 0.2s',
  },
  consentTopBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '8px',
    borderBottom: '1px solid #F1F5F9',
  },
  quickActionBtn: {
    background: 'none',
    border: 'none',
    fontSize: '12px',
    fontWeight: 600,
    color: '#0F172A',
    cursor: 'pointer',
    padding: 0,
  },
  permissionCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid',
  },
  attrChip: {
    fontSize: '10px',
    backgroundColor: '#F1F5F9',
    color: '#475569',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid #E2E8F0',
  },
  successIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#DCFCE7',
    color: '#16A34A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    margin: '0 auto',
    fontWeight: 700,
  },
};