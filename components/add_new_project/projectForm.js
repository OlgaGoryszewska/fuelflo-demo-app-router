export const PROJECT_FORM_DEFAULTS = {
  name: '',
  location: '',
  start_date: '',
  end_date: '',
  contractor_name: '',
  contractor_address: '',
  email: '',
  mobile: '',
  manager: null,
  manager_id: null,
  selectedTechnician: null,
  technicians: [],
  technician_ids: [],
  generators: [],
  selectedGenerator: null,
  amount: '',
  selling_price: '',
  expected_liters: '',
  specification: '',
  additional: '',
  event_organizer_id: '',
  event_organizer: null,
  fuel_suppliers_id: '',
  fuel_supplier: null,
  active: true,
  company_name: '',
};

export const PROJECT_STEPS = [
  {
    title: 'Event basics',
    description: 'Name the event, set the location, and confirm the schedule.',
  },
  {
    title: 'Partners',
    description: 'Connect the organizer and fuel supplier details.',
  },
  {
    title: 'Team and fleet',
    description: 'Assign the manager, technicians, generators, and tanks.',
  },
  {
    title: 'Fuel plan',
    description: 'Set expected litres, buy price, sell price, and notes.',
  },
  {
    title: 'Review',
    description: 'Check the setup before saving the project.',
  },
];

export const PROJECT_STEP_FIELDS = [
  ['name', 'location', 'start_date', 'end_date'],
  [
    'event_organizer_id',
    'contractor_name',
    'company_name',
    'contractor_address',
    'email',
    'mobile',
    'fuel_suppliers_id',
  ],
  ['manager_id', 'technician_ids', 'generators'],
  ['amount', 'selling_price', 'expected_liters', 'specification', 'additional'],
  [],
];

export function trimValue(value) {
  return typeof value === 'string' ? value.trim() : value;
}

export function parsePositiveNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function getMargin(formData) {
  const purchasePrice = Number(formData.amount);
  const sellingPrice = Number(formData.selling_price);

  if (!Number.isFinite(purchasePrice) || !Number.isFinite(sellingPrice)) {
    return null;
  }

  return sellingPrice - purchasePrice;
}

export function getExpectedEarnings(formData) {
  const expectedLitres = Number(formData.expected_liters);
  const margin = getMargin(formData);

  if (
    !Number.isFinite(expectedLitres) ||
    expectedLitres <= 0 ||
    margin === null
  ) {
    return null;
  }

  return expectedLitres * margin;
}

export function validateProjectStep(formData, stepIndex) {
  const errors = {};
  const email = trimValue(formData.email);
  const purchasePrice = parsePositiveNumber(formData.amount);
  const sellingPrice = parsePositiveNumber(formData.selling_price);
  const expectedLitres = parsePositiveNumber(formData.expected_liters);
  const generators = formData.generators || [];

  if (stepIndex === 0) {
    if (!trimValue(formData.name)) errors.name = 'Project name is required.';
    if (!trimValue(formData.location))
      errors.location = 'Location is required.';
    if (!formData.start_date) errors.start_date = 'Start date is required.';
    if (!formData.end_date) errors.end_date = 'End date is required.';
    if (
      formData.start_date &&
      formData.end_date &&
      new Date(formData.end_date) < new Date(formData.start_date)
    ) {
      errors.end_date = 'End date must be on or after the start date.';
    }
  }

  if (stepIndex === 1) {
    if (!formData.event_organizer_id) {
      errors.event_organizer_id = 'Event organizer is required.';
    }
    if (!trimValue(formData.contractor_name)) {
      errors.contractor_name = 'Organizer contact name is required.';
    }
    if (!trimValue(formData.company_name)) {
      errors.company_name = 'Company name is required.';
    }
    if (!trimValue(formData.contractor_address)) {
      errors.contractor_address = 'Organizer address is required.';
    }
    if (!email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (!trimValue(formData.mobile))
      errors.mobile = 'Mobile number is required.';
    if (!formData.fuel_suppliers_id) {
      errors.fuel_suppliers_id = 'Fuel supplier is required.';
    }
  }

  if (stepIndex === 2) {
    if (!formData.manager_id) errors.manager_id = 'Manager is required.';
    if ((formData.technician_ids || []).length === 0) {
      errors.technician_ids = 'At least one technician is required.';
    }
    if (generators.length === 0) {
      errors.generators = 'At least one generator is required.';
    }

    const generatorWithoutTank = generators.find(
      (generator) => (generator.tanks || []).length === 0
    );

    if (generatorWithoutTank) {
      errors.generators = 'Each generator needs at least one external tank.';
    }
  }

  if (stepIndex === 3) {
    if (!purchasePrice) errors.amount = 'Purchase price is required.';
    if (!sellingPrice) errors.selling_price = 'Selling price is required.';
    if (purchasePrice && sellingPrice && sellingPrice <= purchasePrice) {
      errors.selling_price =
        'Selling price must be higher than purchase price.';
    }
    if (!expectedLitres) {
      errors.expected_liters = 'Expected litres are required.';
    }
    if (!trimValue(formData.specification)) {
      errors.specification = 'Project specification is required.';
    }
    if (!trimValue(formData.additional)) {
      errors.additional = 'Additional note is required.';
    }
  }

  return errors;
}

export function validateProjectForm(formData) {
  return PROJECT_STEPS.reduce((allErrors, _step, index) => {
    return {
      ...allErrors,
      ...validateProjectStep(formData, index),
    };
  }, {});
}

export function hasErrors(errors) {
  return Object.keys(errors || {}).length > 0;
}

export function firstInvalidStep(formData) {
  for (let index = 0; index < PROJECT_STEPS.length; index += 1) {
    if (hasErrors(validateProjectStep(formData, index))) {
      return index;
    }
  }

  return null;
}

export function buildProjectPayload(formData) {
  return {
    name: trimValue(formData.name) || null,
    location: trimValue(formData.location) || null,
    start_date: formData.start_date || null,
    end_date: formData.end_date || null,
    contractor_name: trimValue(formData.contractor_name) || null,
    contractor_address: trimValue(formData.contractor_address) || null,
    email: trimValue(formData.email) || null,
    mobile: trimValue(formData.mobile) || null,
    amount: formData.amount || null,
    selling_price: formData.selling_price || null,
    expected_liters: formData.expected_liters || null,
    specification: trimValue(formData.specification) || null,
    additional: trimValue(formData.additional) || null,
    active: formData.active ?? true,
    company_name: trimValue(formData.company_name) || null,
    event_organizer_id: formData.event_organizer_id || null,
    fuel_suppliers_id: formData.fuel_suppliers_id || null,
    manager_id: formData.manager_id || null,
  };
}

export function buildGeneratorsTanksRows(projectId, generators) {
  return (generators || []).flatMap((generator) => {
    if (!generator.tanks || generator.tanks.length === 0) {
      return [
        {
          project_id: projectId,
          generator_id: generator.id,
          generator_name: generator.name,
          tank_id: null,
          tank_name: null,
        },
      ];
    }

    return generator.tanks.map((tank) => ({
      project_id: projectId,
      generator_id: generator.id,
      generator_name: generator.name,
      tank_id: tank.id,
      tank_name: tank.name,
    }));
  });
}
