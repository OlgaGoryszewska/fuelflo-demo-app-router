'use client';

import { useState } from 'react';
import { supabase } from '@/lib/SupabaseClient';

export default function StepFive({ formData }) {
  
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
      </div>
  );
}