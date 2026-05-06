'use client';

import RoleDashboard from '@/components/RoleDashboard';
import {
  Bolt,
  Fuel,
  Gauge,
  HardHat,
  Package,
  RotateCcw,
  Users,
  Workflow,
} from 'lucide-react';

const sections = [
  {
    id: 'projects',
    title: 'Projects',
    description: 'Open active project records.',
    icon: Workflow,
    items: [
      {
        href: '/resources/projects',
        label: 'Active projects',
        description: 'Review current project details.',
        icon: Workflow,
      },
    ],
  },
  {
    id: 'transactions',
    title: 'Fuel transactions',
    description: 'Review deliveries, returns, and field entries.',
    icon: Fuel,
    items: [
      {
        href: '/resources/fuel-transactions',
        label: 'Deliveries',
        description: 'View fuel delivery records.',
        icon: Fuel,
      },
      {
        href: '/resources/fuel-transactions/returns',
        label: 'Returns',
        description: 'Review returned fuel activity.',
        icon: RotateCcw,
      },
      {
        href: '/resources/projects/add-transaction',
        label: 'Add new transaction',
        description: 'Choose a project and record fuel.',
        icon: Gauge,
      },
    ],
  },
  {
    id: 'personnel',
    title: 'Personnel',
    description: 'Find managers and technicians.',
    icon: Users,
    items: [
      {
        href: '/resources/manager',
        label: 'Managers',
        description: 'View manager contacts.',
        icon: HardHat,
      },
      {
        href: '/resources/technician',
        label: 'Technicians',
        description: 'View technician contacts.',
        icon: Users,
      },
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment',
    description: 'Open generators and external tanks.',
    icon: Bolt,
    items: [
      {
        href: '/resources/generators',
        label: 'Generators',
        description: 'Review assigned generators.',
        icon: Bolt,
      },
      {
        href: '/resources/external-tanks',
        label: 'External tanks',
        description: 'Review external tank records.',
        icon: Package,
      },
    ],
  },
];

export default function TechnicianDashboard() {
  return (
    <RoleDashboard
      eyebrow="Technician dashboard"
      title="Field workspace"
      description="Access project records, equipment, and fuel transaction tools."
      primaryActions={[
        {
          href: '/resources/projects/add-transaction',
          label: 'Add fuel transaction',
          description: 'Choose a project and record a delivery or return.',
          icon: Gauge,
        },
      ]}
      sections={sections}
    />
  );
}
