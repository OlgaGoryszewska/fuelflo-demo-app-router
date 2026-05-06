'use client';

import RoleDashboard from '@/components/RoleDashboard';
import {
  Archive,
  BarChart3,
  Bolt,
  Building2,
  Fuel,
  Gauge,
  HardHat,
  Package,
  Plus,
  QrCode,
  RotateCcw,
  User,
  UserPlus,
  Users,
  Workflow,
} from 'lucide-react';

const sections = [
  {
    id: 'projects',
    title: 'Projects',
    description: 'Create, review, and archive project records.',
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
      {
        href: '/add-forms/add-new-project',
        label: 'Add new project',
        description: 'Create a project record.',
        icon: Plus,
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
    description: 'Manage internal operations contacts.',
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
      {
        href: '/resources/hire-desk',
        label: 'Hire desk coordinators',
        description: 'Review hire desk team records.',
        icon: User,
      },
      {
        href: '/register',
        label: 'Add personnel',
        description: 'Register a new team member.',
        icon: UserPlus,
      },
    ],
  },
  {
    id: 'external-partners',
    title: 'External partners',
    description: 'Review event organizers and fuel suppliers.',
    icon: Building2,
    items: [
      {
        href: '/resources/event_organizers',
        label: 'Event organizers',
        description: 'Open organizer records.',
        icon: Building2,
      },
      {
        href: '/resources/fuel_suppliers',
        label: 'Fuel suppliers',
        description: 'Open supplier records.',
        icon: Fuel,
      },
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment',
    description: 'Create and review generator and tank resources.',
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
      {
        href: '/add-forms/add_equipment',
        label: 'Add new equipment',
        description: 'Create generator or tank records.',
        icon: Plus,
      },
    ],
  },
];

const primaryActions = [
  {
    href: '/add-forms/add-new-project',
    label: 'Add new project',
    description: 'Create a project and assign details.',
    icon: Plus,
  },
  {
    href: '/resources/projects/add-transaction',
    label: 'Add fuel transaction',
    description: 'Choose a project and record fuel.',
    icon: Gauge,
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

export default function HireDeskDashboard() {
  return (
    <RoleDashboard
      eyebrow="Hire desk dashboard"
      title="Coordination workspace"
      description="Create projects, manage resources, and support operations."
      primaryActions={primaryActions}
      sections={sections}
      utilityLinks={utilityLinks}
    />
  );
}
