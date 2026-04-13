'use client'
import TransactionReportPreview from '@/components/reports/TransactionReportPreview';

export default function TransactionReportPreviewPage(){
return (
    <div>
              <div className="container-flex">
  <h4 className="mb-2">Report preview</h4>
  <TransactionReportPreview transaction={transaction} showPreview={true} />
</div>
        </div>

)}