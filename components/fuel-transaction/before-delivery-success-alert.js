'use client';

import { useRouter } from 'next/navigation';
import TransactionSuccessState from './TransactionSuccessState';

export default function BeforeDeliverySuccessAlert({
  projectId,
  transactionId,
  isOffline,
}) {
  const router = useRouter();

  return (
    <TransactionSuccessState
      eyebrow="Evidence saved"
      title="Before evidence saved"
      description="Complete the delivery or return, then capture the final meter evidence."
      isOffline={isOffline}
      items={[
        {
          label: 'Before photo',
          status: 'Saved',
          complete: true,
        },
        {
          label: 'Before meter reading',
          status: 'Saved',
          complete: true,
        },
        {
          label: 'After evidence',
          status: 'Required',
          complete: false,
        },
      ]}
      primaryAction={{
        label: 'Collect after evidence',
        onClick: () =>
          router.push(
            `/resources/projects/${projectId}/transactions/${transactionId}/after/`
          ),
      }}
      secondaryAction={{
        label: 'View transaction',
        href: `/resources/projects/${projectId}/transactions/${transactionId}/`,
      }}
    />
  );
}
