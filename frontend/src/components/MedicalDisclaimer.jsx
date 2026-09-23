import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function MedicalDisclaimer({ compact = false }) {
  if (compact) {
    return (
      <div className="disclaimer-banner" style={{ padding: '8px 12px', fontSize: '12px' }}>
        <AlertCircle size={15} className="disclaimer-icon" />
        <div>
          <strong>Educational Notice:</strong> Skinova provides AI-generated observations and education. Not a medical diagnosis. Consult a dermatologist for medical concerns.
        </div>
      </div>
    );
  }

  return (
    <div className="disclaimer-banner">
      <AlertCircle size={20} className="disclaimer-icon" />
      <div>
        <strong>Healthcare & Medical Disclaimer:</strong> Skinova AI provides educational observations and general skincare guidance based on visible indicators and user-submitted information. It is <em>not a medical diagnosis</em> and cannot replace clinical advice, diagnosis, or treatment from a qualified board-certified dermatologist or healthcare professional. Always consult a physician for painful, bleeding, rapidly changing, or persistent skin lesions.
      </div>
    </div>
  );
}
