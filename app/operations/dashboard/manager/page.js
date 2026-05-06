'use client';

import RoleDashboard from '@/components/RoleDashboard';
import {
  Archive,
  BarChart3,
  Bolt,
  Fuel,
  Gauge,
  HardHat,
  Package,
  QrCode,
  RotateCcw,
  User,
  Users,
  Workflow,
} from 'lucide-react';

const sections = [
  {
    id: 'projects',
    title: 'Projects',
    description: 'Review active and archived project records.',
    icon: Workflow,
    items: [
      {
        href: '/resources/projects',
        label: 'Active projects',
        description: 'Open current project records.',
        icon: Workflow,
      },
      {
        href: '/resources/projects/archived',
        label: 'Archived projects',
        description: 'Review inactive or completed projects.',
        icon: Archive,
      },
    ],
  },
  {
    id: 'transactions',
    title: 'Fuel transactions',
    description: 'Review deliveries, returns, and new entries.',
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
    description: 'View field and management contacts.',
    icon: Users,
    items: [
      {
        href: '/resources/manager',
        label: 'Managers',
        description: 'Review manager records.',
        icon: HardHat,
      },
      {
        href: '/resources/technician',
        label: 'Technicians',
        description: 'Review technician records.',
        icon: Users,
      },
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment',
    description: 'Open generator and tank resources.',
    icon: Bolt,
    items: [
      {
        href: '/resources/generators',
        label: 'Generators',
        description: 'Review generator records.',
        icon: Bolt,
      },
      {
        href: '/resources/external-tanks',
        label: 'External tanks',
        description: 'Review tank records.',
        icon: Package,
      },
    ],
  },
];

const utilityLinks = [
  {
    href: '/operations/create-qr-code',
    label: 'Create QR code',
    description: 'Generate a scannable equipment QR code.',
    icon: QrCode,
  },
  {
    href: '/resources/reports',
    label: 'Reports',
    description: 'Open project and fuel reports.',
    icon: BarChart3,
  },
  {
    href: '/resources/profile',
    label: 'Profile',
    description: 'View your account details.',
    icon: User,
  },
];

export default function ManagerDashboard() {
  return (
    <RoleDashboard
      eyebrow="Manager dashboard"
      title="Operations overview"
      description="Manage projects, transactions, personnel, equipment, and reporting."
      primaryActions={[
        {
          href: '/resources/projects/add-transaction',
          label: 'Add fuel transaction',
          description: 'Choose a project and record a delivery or return.',
          icon: Gauge,
        },
      ]}
      sections={sections}
      utilityLinks={utilityLinks}
    />
  );
}
