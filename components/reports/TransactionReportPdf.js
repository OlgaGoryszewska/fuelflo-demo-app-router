import React from 'react';
import { pdf } from '@react-pdf/renderer';
import TransactionReportDocument from './TransactionReportDocument';

export async function generateTransactionPdfBlob(transaction) {
  const instance = pdf(
    <TransactionReportDocument transaction={transaction} />
  );

  return await instance.toBlob();
}