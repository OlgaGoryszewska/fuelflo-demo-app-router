'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

export default function FetchGeneratorsbyId() {
  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Create QR Code</h1>
      </div>

      <form className="p-4">
        <p>Search for generator by name</p>
        <input type="text" name="search" placeholder="Search..." />
      </form>
    </div>
  );
}
