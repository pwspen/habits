import { useEffect, useState } from 'react';
import { type Dashboard } from '../types';
import { fetchDashboard } from '../api';

export default function useDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    setData(await fetchDashboard());
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  // optimistic helpers
  function optimisticUpdateRecord(recordId: number, value: number) {
    if (!data) return;
    const newRecords = data.records.map(r =>
      r.id === recordId ? { ...r, value } : r
    );
    setData({ ...data, records: newRecords });
  }

  return { data, loading, refresh, optimisticUpdateRecord, setData };
}
