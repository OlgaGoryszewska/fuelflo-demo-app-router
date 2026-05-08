'use client';

import React from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import ProjectReportDocument from './ProjectReportDocument';

export default function ProjectReportPreview({
  project,
  summary,
  transactions,
  showPreview = true,
}) {
  const fileName = `project-report-${project.id}.pdf`;
  const document = (
    <ProjectReportDocument
      project={project}
      summary={summary}
      transactions={transactions}
    />
  );

  return (
    <div className="w-full space-y-4">
      {showPreview && (
        <div className="h-[72vh] min-h-[520px] w-full overflow-hidden rounded-[20px] border border-[#d9e2ec] bg-white shadow-[0_8px_24px_rgba(98,116,142,0.12)]">
          <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
            {document}
          </PDFViewer>
        </div>
      )}

      <PDFDownloadLink
        document={document}
        fileName={fileName}
        className="button-big mb-0 gap-2"
      >
        {({ loading }) => (
          <>
            <Download size={18} />
            {loading ? 'Preparing PDF...' : 'Download project PDF'}
          </>
        )}
      </PDFDownloadLink>
    </div>
  );
}
