// app/test/page.tsx
'use client';

import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function TestPage() {
  const [clientData, setClientData] = useState<any>(null);
  const [serverData, setServerData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Client-side test
  useEffect(() => {
    async function testClientConnection() {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .limit(3);

      if (error) {
        setError(error.message);
      } else {
        setClientData(data);
      }
    }

    // Server-side test
    async function testServerConnection() {
      const response = await fetch('/api/test');
      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else {
        setServerData(result.data);
      }
    }

    testClientConnection();
    testServerConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Bağlantı Testi</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Client-side Data:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(clientData, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Server-side Data:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(serverData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}