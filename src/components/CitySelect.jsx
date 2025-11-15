import { useEffect, useState } from "react";
import { getCities } from "../api";

export default function CitySelect({ value, onChange }) {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getCities().then(setCities).catch(console.error);
  }, []);

  return (
    <div className="space-y-2">
      <label className="font-semibold text-lg">Şehir Seç</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-3 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      >
        <option value="">— Seç —</option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
