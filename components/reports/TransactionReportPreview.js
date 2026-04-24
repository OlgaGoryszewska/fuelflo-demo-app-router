'use client';

import React from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import TransactionReportDocument from './TransactionReportDocument';

export default function TransactionReportPreview({
  transaction,
  showPreview = true,
}) {
  const fileName = `transaction-report-${transaction.id}.pdf`;

  return (
    <div className="w-full space-y-4">
     

      {showPreview && (
        <div className="w-full overflow-hidden rounded border border-slate-300">
          <PDFViewer width="100%" height={700} style={{ border: 'none' }}>
            <TransactionReportDocument transaction={transaction} />
          </PDFViewer>
        </div>
      )}
       <div className="flex flex-wrap gap-3">
        <PDFDownloadLink
          document={<TransactionReportDocument transaction={transaction} />}
          fileName={fileName}
          className="button-big h-[35]" 
        >
          {({ loading }) => (loading ? 'Preparing PDF...' : 'Download report')}
        </PDFDownloadLink>
      </div>
    </div>
  );
}
