'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function ProfileRoleDropdown({
  value,
  onChange,
  roles = [],
  placeholder = 'Select profile',
}) {
  const [profiles, setProfiles] = useState([]);
  const rolesKey = roles.join('|');

  useEffect(() => {
    async function fetchProfiles() {
      const selectedRoles = rolesKey ? rolesKey.split('|') : [];
      let query = supabase
        .from('profiles')
        .select('id, full_name, role, email, phone')
        .order('full_name', { ascending: true });

      if (selectedRoles.length === 1) {
        query = query.eq('role', selectedRoles[0]);
      } else if (selectedRoles.length > 1) {
        query = query.in('role', selectedRoles);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching profiles:', error.message);
      } else {
        setProfiles(data || []);
      }
    }

    fetchProfiles();
  }, [rolesKey]);

  return (
    <div className="relative w-full">
      <select
        className="h-12 w-full appearance-none pr-11"
        value={value || ''}
        onChange={(event) => {
          const selectedId = event.target.value;

          if (!selectedId) {
            onChange(null);
            return;
          }

          const selectedProfile = profiles.find(
            (profile) => String(profile.id) === String(selectedId)
          );

          onChange(
            selectedProfile
              ? {
                  id: selectedProfile.id,
                  name: selectedProfile.full_name,
                  full_name: selectedProfile.full_name,
                  role: selectedProfile.role,
                  email: selectedProfile.email,
                  phone: selectedProfile.phone,
                }
              : null
          );
        }}
      >
        <option value="">{placeholder}</option>
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.full_name}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#717887]"
      />
    </div>
  );
}
