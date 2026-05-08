import PartnerDirectoryPage from '@/components/resources/PartnerDirectoryPage';

export default function FuelSuppliersPage() {
  return (
    <PartnerDirectoryPage
      role="fuel_supplier"
      title="Fuel suppliers"
      singularLabel="Fuel supplier"
      directoryTitle="Fuel supplier directory"
      description="Find supplier contacts, delivery partners, and linked project load."
      searchPlaceholder="Search suppliers, email, phone, or location"
      hrefBase="/resources/fuel_suppliers"
      projectField="fuel_suppliers_id"
      projectMetricLabel="Supply"
      theme="supplier"
    />
  );
}
