'use client';

import { useState } from 'react';
import { supabase } from '@/lib/SupabaseClient';

export default function StepFive({ formData }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from('projects')
      .insert([formData])
      .select()
      .single();

    if (error) {
      alert('❌ Failed to submit project');
      console.error(error);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 border rounded bg-green-100">
        <h2 className="text-xl font-bold mb-2">✅ Submitted successfully!</h2>
        <p>
          Project: <strong>{formData.name}</strong>
        </p>
        <p>It's now saved in the database.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">📝 Review Before Submitting</h2>
      <div className="bg-gray-100 p-4 rounded shadow text-sm space-y-1">
        {Object.entries(formData).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong> {value || '—'}
          </p>
        ))}
      </div>

      <button onClick={handleSubmit}>Submit Project</button>
    </div>
  );
}
