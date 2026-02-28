'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function AddExternalTank() {
  const [formData, setFormData] = useState({
    name: '',
  });
  const [message, setMessage] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
}
