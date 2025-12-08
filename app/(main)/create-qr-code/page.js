'use client';
import Search from '@/ui/search';

export default function CreateQrCodePage() {
  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Create QR Code</h1>
      </div>
      <div className="background-container-white">
        <p>Search for generator by name</p>
        <Search placeholder="Search for generator by name" />
      </div>
    </div>
  );
}
