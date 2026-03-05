'use client';

import StepNavigation from '@/components/StepNavigation';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Setup from '@/components/fuel-transaction/setup-form';

export default function AddFuelDeliveryPage() {
  const { id } = useParams();
 
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    console.log('Toggled state:', !isToggled);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('projects')
        .select('id, name')
        .eq('id', id)
        .single();
      setProject(data);
    };

    fetchData();
  }, [id]);


  const steps = [];
  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Add fuel transaction </h1>
      </div>
      <form className="form-no-style">
       <Setup/>
      <StepNavigation/>
      </form>
    </div>
  );
}

