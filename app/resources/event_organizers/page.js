import PartnerDirectoryPage from '@/components/resources/PartnerDirectoryPage';

export default function EventOrganizersPage() {
  return (
    <PartnerDirectoryPage
      role="event_organizer"
      title="Event organizers"
      singularLabel="Event organizer"
      directoryTitle="Event organizer directory"
      description="Find customer contacts, event partners, and linked project load."
      searchPlaceholder="Search organizers, email, phone, or location"
      hrefBase="/resources/event_organizers"
      projectField="event_organizer_id"
      projectMetricLabel="Events"
      theme="event"
    />
  );
}
