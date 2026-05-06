'use client';

import { useParams } from 'next/navigation';
import TransactionSuccessState from './TransactionSuccessState';

export default function AfterDeliverySuccessAlert({ isOffline }) {
  const params = useParams();
  const projectId = params.id;
  const transactionId = params.transactionId;

  return (
    <TransactionSuccessState
      eyebrow="Transaction complete"
      title="Transaction evidence complete"
      description="Before and after meter evidence are connected to this delivery or return."
      isOffline={isOffline}
      items={[
        {
          label: 'Before evidence',
          status: 'Saved',
          complete: true,
        },
        {
          label: 'After evidence',
          status: 'Saved',
          complete: true,
        },
        {
          label: 'Report evidence',
          status: 'Ready',
          complete: true,
        },
      ]}
      primaryAction={{
        label: 'View transaction details',
        href: `/resources/projects/${projectId}/transactions/${transactionId}/`,
      }}
      secondaryAction={{
        label: 'Add another transaction',
        href: `/resources/projects/${projectId}/new`,
        icon: 'plus',
      }}
    />
  );
}
