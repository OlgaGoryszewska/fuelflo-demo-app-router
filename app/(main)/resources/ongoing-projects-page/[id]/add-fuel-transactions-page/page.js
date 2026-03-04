'use client';

import ProgresionBar from '@/components/ProgresionBar';
import StepNavigation from '@/components/StepNavigation';
import MyToggleComponent from '@/components/Toggle/ToggledTransaction';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AddFuelDeliveryPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
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
      <div className="background-container-white">
      <p className="steps-text pr-2">Setup</p>
      <div className="divider-full"></div>
        <MyToggleComponent />
      </div>
      <StepNavigation/>
    </div>
  );
}
