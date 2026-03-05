'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import QRCode from 'qrcode';

export default function FetchGeneratorsByName() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState(null);
  const [qrSvg, setQrSvg] = useState(null);
  const [qrError, setQrError] = useState(null);

  const createQrCodeSvg = async (generator) => {
    try {
      setQrError(null);
      setSelected(generator);

      // Put inside QR whatever you want to scan later:
      // Recommended: JSON (easy to extend later)
      const payload = JSON.stringify({ generatorId: generator.id });

      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        margin: 2,
        errorCorrectionLevel: 'M',
      });

      setQrSvg(svgString);
    } catch (e) {
      console.error(e);
      setQrError('Could not generate SVG QR code.');
      setQrSvg(null);
    }
  };

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('generators')
        .select('id, name')
        .ilike('name', `%${query}%`)
        .order('name', { ascending: true })
        .limit(10);

      if (error) {
        setError(error.message);
        setResults([]);
      } else {
        setResults(data || []);
      }

      setIsLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Download URL for the SVG
  const svgDownloadHref = useMemo(() => {
    if (!qrSvg) return null;
    const blob = new Blob([qrSvg], { type: 'image/svg+xml;charset=utf-8' });
    return URL.createObjectURL(blob);
  }, [qrSvg]);

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (svgDownloadHref) URL.revokeObjectURL(svgDownloadHref);
    };
  }, [svgDownloadHref]);

  return (
    <div className="main-container">
      <div className="form-header mb-4">
        <h1 className="ml-2">Create QR Code</h1>
      </div>

      <form className="p-4" onSubmit={(e) => e.preventDefault()}>
        <p>Search for generator by name</p>

        <input
          type="text"
          name="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="mt-3">
          {isLoading && <p>Loading…</p>}
          {error && <p className="text-red-600">Error: {error}</p>}

          {!isLoading &&
            !error &&
            query.trim().length >= 2 &&
            results.length === 0 && <p>No generators found.</p>}

          <ul className="mt-2 space-y-2">
            {results.map((g) => (
              <li key={g.id} className="mx-2">
                <div className="flex items-center justify-between gap-3">
                  <p>{g.name}</p>

                  <div
                    className="button-black"
                    type="button"
                    onClick={() => createQrCodeSvg(g)}
                  >
                    Generate QR code
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {qrError && <p className="mt-4 text-red-600">{qrError}</p>}

          {qrSvg && selected && (
            <div className=" flex flex-col items-center justify-center mt-6">
              <p className="font-medium">{selected.name}</p>
              <div
                className="mt-3 w-[300px]  m-auto  bg-white "
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />

              {svgDownloadHref && (
                <div className="button-border-black">
                  <a
                    href={svgDownloadHref}
                    download={`generator-${selected.id}.svg`}
                  >
                    Download QR code
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
