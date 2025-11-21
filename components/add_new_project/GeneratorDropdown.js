import React, { useState } from 'react';

export default function GeneratorDropdown() {


  return (
    <div>
      <select
        value={formData.generator}
        onChange={(e) =>
          setFormData({ ...formData, generator: e.target.value })
        }
      >
        <option value="">Select Generator</option>
      </select>
    </div>
  );
}
  