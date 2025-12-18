"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FetchGeneratorsByName() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don’t search if empty / too short
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    // Debounce so we don’t spam Supabase on every keystroke
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("generators")
        .select("id, name")
        .ilike("name", `%${query}%`) // case-insensitive "contains"
        .order("name", { ascending: true })
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
          className="border rounded p-2 w-full"
        />

        <div className="mt-3">
          {isLoading && <p>Loading…</p>}
          {error && <p className="text-red-600">Error: {error}</p>}

          {!isLoading && !error && query.trim().length >= 2 && results.length === 0 && (
            <p>No generators found.</p>
          )}

          <ul className="mt-2 space-y-2">
            {results.map((g) => (
              <li key={g.id} className="border rounded p-2">
                <p className="font-semibold">{g.name}</p>
                <p className="text-sm opacity-70">ID: {g.id}</p>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
}
