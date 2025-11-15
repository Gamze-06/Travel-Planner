import { useEffect, useState } from "react";
import { getMustSeePlaces } from "../api";

export default function MustSeeList({ cityId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!cityId) { setItems([]); return; }
      setLoading(true);
      try {
        const data = await getMustSeePlaces(cityId);
        if (!ignore) setItems(data);
      } catch (e) {
        if (!ignore) setItems([]);
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [cityId]);

  if (!cityId) {
    return <div className="text-gray-600">Önce bir şehir seç.</div>;
  }
  if (loading) {
    return <div className="text-gray-600">Yükleniyor...</div>;
  }
  if (items.length === 0) {
    return <div className="text-gray-600">Bu şehir için öneri bulunamadı.</div>;
  }

  return (
    <div className="grid gap-3">
      {items.map((p) => (
        <div key={p.id} className="bg-white border rounded-2xl p-4 shadow-sm">
          <div className="text-xl font-semibold text-blue-700">{p.name}</div>
          {p.desc && <div className="text-gray-700 mt-1">{p.desc}</div>}
          <div className="mt-2 inline-block text-xs px-2 py-1 rounded bg-green-100 text-green-800 font-medium">
            Görülmesi gereken
          </div>
        </div>
      ))}
    </div>
  );
}
