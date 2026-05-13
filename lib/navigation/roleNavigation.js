import {
  Archive,
  BarChart3,
  Boxes,
  FolderKanban,
  Fuel,
  LayoutDashboard,
  Plus,
  ReceiptText,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  Truck,
  User,
  UserPlus,
  UsersRound,
  Zap,
} from 'lucide-react';

export const roleMenus = {
  technician: {
    quick: [
      {
        href: '/resources/projects/add-transaction',
        label: 'Add transaction',
        description: 'Capture fuel evidence',
        icon: Plus,
      },
      {
        href: '/resources/projects',
        label: 'Projects',
        description: 'Assigned work',
        icon: FolderKanban,
      },
    ],
    sections: [
      {
        title: 'Work',
        items: [
          {
            href: '/operations/dashboard/technician',
            label: 'Dashboard',
            description: 'Today’s field tools',
            icon: LayoutDashboard,
          },
          {
            href: '/resources/projects/add-transaction',
            label: 'Add transaction',
            description: 'Start delivery or return',
            icon: Plus,
          },
          {
            href: '/resources/projects',
            label: 'Projects',
            description: 'Open event fuel jobs',
            icon: FolderKanban,
          },
        ],
      },
      {
        title: 'Fuel records',
        items: [
          {
            href: '/resources/fuel-transactions',
            label: 'Deliveries',
            description: 'Incoming fuel evidence',
            icon: Fuel,
          },
          {
            href: '/resources/fuel-transactions/returns',
            label: 'Returns',
            description: 'Returned fuel evidence',
            icon: RotateCcw,
          },
        ],
      },
      {
        title: 'Resources',
        items: [
          {
            href: '/resources/generators',
            label: 'Generators',
            description: 'Assigned fleet records',
            icon: Zap,
          },
          {
            href: '/resources/external-tanks',
            label: 'External tanks',
            description: 'Fuel source records',
            icon: Truck,
          },
        ],
      },
      {
        title: 'Account',
        items: [
          {
            href: '/resources/profile',
            label: 'Profile',
            description: 'Contact and assignments',
            icon: User,
          },
        ],
      },
    ],
  },
  manager: {
    quick: [
      {
        href: '/operations/dashboard/manager',
        label: 'Dashboard',
        description: 'Operations overview',
        icon: LayoutDashboard,
      },
      {
        href: '/resources/projects/add-transaction',
        label: 'Add transaction',
        description: 'Record fuel movement',
        icon: Plus,
      },
    ],
    sections: [
      {
        title: 'Work',
        items: [
          {
            href: '/operations/dashboard/manager',
            label: 'Dashboard',
            description: 'Fuel position and actions',
            icon: LayoutDashboard,
          },
          {
            href: '/resources/projects',
            label: 'Projects',
            description: 'Active fuel operations',
            icon: FolderKanban,
          },
          {
            href: '/resources/projects/add-transaction',
            label: 'Add transaction',
            description: 'Create delivery or return',
            icon: Plus,
          },
        ],
      },
      {
        title: 'Fuel records',
        items: [
          {
            href: '/resources/fuel-transactions',
            label: 'Deliveries',
            description: 'Incoming fuel proof',
            icon: Fuel,
          },
          {
            href: '/resources/fuel-transactions/returns',
            label: 'Returns',
            description: 'Returned fuel proof',
            icon: RotateCcw,
          },
          {
            href: '/resources/reports',
            label: 'Reports',
            description: 'PDFs and summaries',
            icon: BarChart3,
          },
          {
            href: '/resources/financial-transactions',
            label: 'Financial transactions',
            description: 'Fakturas and payments',
            icon: ReceiptText,
          },
        ],
      },
      {
        title: 'Resources',
        items: [
          {
            href: '/resources/generators',
            label: 'Generators',
            description: 'Fleet equipment',
            icon: Zap,
          },
          {
            href: '/resources/external-tanks',
            label: 'External tanks',
            description: 'Storage equipment',
            icon: Truck,
          },
        ],
      },
      {
        title: 'People & partners',
        items: [
          {
            href: '/resources/manager',
            label: 'Managers',
            description: 'Operations leads',
            icon: User,
          },
          {
            href: '/resources/technician',
            label: 'Technicians',
            description: 'Assigned field users',
            icon: ShieldCheck,
          },
          {
            href: '/resources/hire-desk',
            label: 'Hire desk',
            description: 'Project setup team',
            icon: UserPlus,
          },
          {
            href: '/resources/event_organizers',
            label: 'Event organizers',
            description: 'Customer contacts',
            icon: UsersRound,
          },
          {
            href: '/resources/fuel_suppliers',
            label: 'Fuel suppliers',
            description: 'Supplier contacts',
            icon: Truck,
          },
        ],
      },
      {
        title: 'Account',
        items: [
          {
            href: '/resources/profile',
            label: 'Profile',
            description: 'Contact and assignments',
            icon: User,
          },
        ],
      },
    ],
  },
  hire_desk: {
    quick: [
      {
        href: '/add-forms/add-new-project',
        label: 'New project',
        description: 'Create event job',
        icon: Plus,
      },
      {
        href: '/resources/projects',
        label: 'Projects',
        description: 'Manage jobs',
        icon: FolderKanban,
      },
    ],
    sections: [
      {
        title: 'Work',
        items: [
          {
            href: '/operations/dashboard/hire-desk',
            label: 'Dashboard',
            description: 'Setup and dispatch tools',
            icon: LayoutDashboard,
          },
          {
            href: '/add-forms/add-new-project',
            label: 'New project',
            description: 'Create fuel operation',
            icon: Plus,
          },
          {
            href: '/resources/projects',
            label: 'Projects',
            description: 'All active jobs',
            icon: FolderKanban,
          },
          {
            href: '/resources/projects/archived',
            label: 'Archived projects',
            description: 'Closed job history',
            icon: Archive,
          },
        ],
      },
      {
        title: 'Fuel records',
        items: [
          {
            href: '/resources/projects/add-transaction',
            label: 'Add transaction',
            description: 'Record delivery or return',
            icon: Fuel,
          },
          {
            href: '/resources/fuel-transactions',
            label: 'Deliveries',
            description: 'Fuel delivery records',
            icon: Fuel,
          },
          {
            href: '/resources/fuel-transactions/returns',
            label: 'Returns',
            description: 'Fuel return records',
            icon: RotateCcw,
          },
          {
            href: '/resources/reports',
            label: 'Reports',
            description: 'Project and fuel reports',
            icon: ScrollText,
          },
          {
            href: '/resources/financial-transactions',
            label: 'Financial transactions',
            description: 'Fakturas and payments',
            icon: ReceiptText,
          },
        ],
      },
      {
        title: 'Resources',
        items: [
          {
            href: '/add-forms/add_equipment',
            label: 'Add equipment',
            description: 'Generator or tank setup',
            icon: Boxes,
          },
          {
            href: '/resources/generators',
            label: 'Generators',
            description: 'Fleet equipment',
            icon: Zap,
          },
          {
            href: '/resources/external-tanks',
            label: 'External tanks',
            description: 'Tank records',
            icon: Truck,
          },
          {
            href: '/register',
            label: 'Register user',
            description: 'Create team profiles',
            icon: UserPlus,
          },
        ],
      },
      {
        title: 'People & partners',
        items: [
          {
            href: '/resources/manager',
            label: 'Managers',
            description: 'Operations leads',
            icon: User,
          },
          {
            href: '/resources/technician',
            label: 'Technicians',
            description: 'Field user profiles',
            icon: ShieldCheck,
          },
          {
            href: '/resources/hire-desk',
            label: 'Hire desk',
            description: 'Project setup team',
            icon: UserPlus,
          },
          {
            href: '/resources/event_organizers',
            label: 'Event organizers',
            description: 'Customer contacts',
            icon: UsersRound,
          },
          {
            href: '/resources/fuel_suppliers',
            label: 'Fuel suppliers',
            description: 'Supplier contacts',
            icon: Truck,
          },
        ],
      },
      {
        title: 'Account',
        items: [
          {
            href: '/resources/profile',
            label: 'Profile',
            description: 'Contact and assignments',
            icon: User,
          },
        ],
      },
    ],
  },
  fuel_supplier: {
    quick: [
      {
        href: '/resources/projects',
        label: 'Projects',
        description: 'Assigned events',
        icon: FolderKanban,
      },
      {
        href: '/resources/fuel-transactions',
        label: 'Deliveries',
        description: 'Fuel records',
        icon: Fuel,
      },
    ],
    sections: [
      {
        title: 'Work',
        items: [
          {
            href: '/operations/dashboard/fuel_supplier',
            label: 'Dashboard',
            description: 'Supplier workspace overview',
            icon: LayoutDashboard,
          },
          {
            href: '/resources/projects',
            label: 'Projects',
            description: 'Assigned fuel operations',
            icon: FolderKanban,
          },
          {
            href: '/resources/fuel-transactions',
            label: 'Deliveries',
            description: 'Delivery evidence',
            icon: Fuel,
          },
          {
            href: '/resources/fuel-transactions/returns',
            label: 'Returns',
            description: 'Returned fuel records',
            icon: RotateCcw,
          },
          {
            href: '/resources/payments',
            label: 'Payments',
            description: 'Pay invoices online',
            icon: ReceiptText,
          },
        ],
      },
      {
        title: 'Account',
        items: [
          {
            href: '/resources/profile',
            label: 'Profile',
            description: 'Contact and assignments',
            icon: User,
          },
        ],
      },
    ],
  },
  event_organizer: {
    quick: [
      {
        href: '/resources/projects',
        label: 'Projects',
        description: 'Assigned events',
        icon: FolderKanban,
      },
      {
        href: '/resources/financial-transactions',
        label: 'Fakturas',
        description: 'Invoice tracking and payments',
        icon: ReceiptText,
      },
    ],
    sections: [
      {
        title: 'Work',
        items: [
          {
            href: '/operations/dashboard/event_organizer',
            label: 'Dashboard',
            description: 'Event workspace overview',
            icon: LayoutDashboard,
          },
          {
            href: '/resources/projects',
            label: 'Projects',
            description: 'Your event projects',
            icon: FolderKanban,
          },
          {
            href: '/resources/financial-transactions',
            label: 'Financial transactions',
            description: 'Fakturas and payment status',
            icon: ReceiptText,
          },
        ],
      },
      {
        title: 'Account',
        items: [
          {
            href: '/resources/profile',
            label: 'Profile',
            description: 'Update contact details',
            icon: User,
          },
        ],
      },
    ],
  },
};

export const roleLabels = {
  technician: 'Technician',
  manager: 'Manager',
  hire_desk: 'Hire desk',
  fuel_supplier: 'Fuel supplier',
  event_organizer: 'Event organizer',
};

export const roleDashboardProfiles = {
  technician: {
    eyebrow: 'Technician dashboard',
    title: 'Field workspace',
    description: 'Access assigned work, equipment, and fuel transaction tools.',
    focus: 'Capture accurate fuel evidence while keeping field work moving.',
    metrics: [
      {
        label: 'Assigned work',
        value: 'Ready',
        caption: 'Open projects and fuel tasks',
        tone: 'info',
      },
      {
        label: 'Evidence',
        value: 'Required',
        caption: 'Before and after records',
        tone: 'warning',
      },
      {
        label: 'Offline mode',
        value: 'Supported',
        caption: 'Save now, sync later',
        tone: 'success',
      },
    ],
    primaryActionHrefs: ['/resources/projects/add-transaction'],
    priorityHrefs: [
      '/resources/projects/add-transaction',
      '/resources/projects',
      '/resources/fuel-transactions',
    ],
    utilityHrefs: ['/resources/profile'],
    activityItems: [
      'Check active project assignments before starting a delivery.',
      'Record before and after evidence for each fuel movement.',
      'Review saved offline work before leaving site coverage.',
    ],
  },
  manager: {
    eyebrow: 'Manager dashboard',
    title: 'Operations overview',
    description: 'Manage projects, transactions, personnel, equipment, and reports.',
    focus: 'Keep fuel operations visible across projects, people, and equipment.',
    metrics: [
      {
        label: 'Projects',
        value: 'Active',
        caption: 'Current event fuel work',
        tone: 'info',
      },
      {
        label: 'Fuel records',
        value: 'Review',
        caption: 'Deliveries and returns',
        tone: 'warning',
      },
      {
        label: 'Reports',
        value: 'Ready',
        caption: 'PDFs and summaries',
        tone: 'success',
      },
      {
        label: 'Team',
        value: 'Visible',
        caption: 'Managers and technicians',
        tone: 'neutral',
      },
    ],
    primaryActionHrefs: ['/resources/projects/add-transaction'],
    priorityHrefs: [
      '/resources/projects',
      '/resources/fuel-transactions',
      '/resources/fuel-transactions/returns',
      '/resources/reports',
      '/resources/financial-transactions',
    ],
    utilityHrefs: [
      '/operations/create-qr-code',
      '/resources/reports',
      '/resources/financial-transactions',
      '/resources/profile',
    ],
    activityItems: [
      'Review active projects and fuel evidence status.',
      'Check delivery and return records for missing details.',
      'Use reports when project summaries are ready to share.',
    ],
  },
  hire_desk: {
    eyebrow: 'Hire desk dashboard',
    title: 'Coordination workspace',
    description: 'Create projects, manage resources, and support operations.',
    focus: 'Set up jobs cleanly so field teams have the right people and equipment.',
    metrics: [
      {
        label: 'Setup',
        value: 'Create',
        caption: 'Projects and assignments',
        tone: 'warning',
      },
      {
        label: 'Resources',
        value: 'Maintain',
        caption: 'Generators and tanks',
        tone: 'info',
      },
      {
        label: 'People',
        value: 'Manage',
        caption: 'Internal and partner contacts',
        tone: 'neutral',
      },
      {
        label: 'Archive',
        value: 'Tidy',
        caption: 'Closed project history',
        tone: 'success',
      },
    ],
    primaryActionHrefs: [
      '/add-forms/add-new-project',
      '/resources/projects/add-transaction',
    ],
    priorityHrefs: [
      '/add-forms/add-new-project',
      '/resources/projects',
      '/add-forms/add_equipment',
      '/register',
    ],
    utilityHrefs: [
      '/operations/create-qr-code',
      '/resources/reports',
      '/resources/financial-transactions',
      '/resources/profile',
    ],
    activityItems: [
      'Create new projects with assigned contacts and equipment.',
      'Register personnel and partner records before dispatch.',
      'Archive completed projects to keep the active queue tidy.',
    ],
  },
  fuel_supplier: {
    eyebrow: 'Fuel supplier dashboard',
    title: 'Supplier workspace',
    description: 'Review assigned projects, delivery records, and account details.',
    focus: 'Keep delivery evidence and assigned event records easy to reach.',
    metrics: [
      {
        label: 'Projects',
        value: 'Assigned',
        caption: 'Event fuel operations',
        tone: 'info',
      },
      {
        label: 'Deliveries',
        value: 'Review',
        caption: 'Fuel evidence records',
        tone: 'warning',
      },
      {
        label: 'Returns',
        value: 'Visible',
        caption: 'Returned fuel records',
        tone: 'neutral',
      },
    ],
    primaryActionHrefs: ['/resources/projects', '/resources/fuel-transactions'],
    priorityHrefs: [
      '/resources/projects',
      '/resources/fuel-transactions',
      '/resources/fuel-transactions/returns',
    ],
    utilityHrefs: ['/resources/profile'],
    activityItems: [
      'Review assigned projects before scheduling delivery work.',
      'Check delivery evidence after each recorded fuel movement.',
      'Keep profile details current for operations coordination.',
    ],
  },
  event_organizer: {
    eyebrow: 'Event organizer dashboard',
    title: 'Event workspace',
    description: 'Manage your events, track fuel operations, and monitor invoices.',
    focus: 'Keep event fuel operations and financial records organized and visible.',
    metrics: [
      {
        label: 'Projects',
        value: 'Active',
        caption: 'Your event fuel operations',
        tone: 'info',
      },
      {
        label: 'Financial',
        value: 'Track',
        caption: 'Invoices and payments',
        tone: 'warning',
      },
      {
        label: 'Status',
        value: 'Monitor',
        caption: 'Project progress and completion',
        tone: 'neutral',
      },
    ],
    primaryActionHrefs: ['/resources/projects', '/resources/financial-transactions'],
    priorityHrefs: [
      '/resources/projects',
      '/resources/financial-transactions',
    ],
    utilityHrefs: ['/resources/profile'],
    activityItems: [
      'Review active projects and fuel operation status.',
      'Track invoice payments and financial transactions.',
      'Update contact details for smooth coordination.',
    ],
  },
};

export function isMenuItemActive(href, pathname) {
  const addTransactionActive =
    pathname === '/resources/projects/add-transaction' ||
    /^\/resources\/projects\/[^/]+\/new/.test(pathname || '');

  if (href === '/resources/projects/add-transaction') {
    return addTransactionActive;
  }

  if (href === '/resources/projects') {
    return (
      pathname === href ||
      (pathname?.startsWith('/resources/projects/') && !addTransactionActive)
    );
  }

  return pathname === href || pathname?.startsWith(`${href}/`);
}

export function flattenMenuItems(menu) {
  return menu?.sections?.flatMap((section) => section.items) || [];
}

export function findMenuItemByHref(role, href) {
  const menu = roleMenus[role];
  const items = [...(menu?.quick || []), ...flattenMenuItems(menu)];

  return items.find((item) => item.href === href);
}

export function getDashboardConfig(role) {
  const menu = roleMenus[role];
  const profile = roleDashboardProfiles[role];

  if (!menu || !profile) return null;

  return {
    ...profile,
    priorityActions: profile.priorityHrefs
      .map((href) => findMenuItemByHref(role, href))
      .filter(Boolean),
    primaryActions: profile.primaryActionHrefs
      .map((href) => findMenuItemByHref(role, href))
      .filter(Boolean),
    utilityLinks: profile.utilityHrefs
      .map((href) => findMenuItemByHref(role, href))
      .filter(Boolean),
    sections: menu.sections,
  };
}
