import PartnerDirectoryPage from '@/components/resources/PartnerDirectoryPage';

export default function HireDeskPage() {
  return (
    <PartnerDirectoryPage
      role="hire_desk"
      title="Hire desk"
      singularLabel="Hire desk"
      directoryTitle="Hire desk directory"
      description="Find setup coordinators, contact details, and operational support profiles."
      searchPlaceholder="Search hire desk, email, phone, or location"
      hrefBase="/resources/hire-desk"
      projectMetricLabel="Support"
      theme="desk"
    />
  );
}
