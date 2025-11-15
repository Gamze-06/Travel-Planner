// src/components/CityAutocomplete.jsx
import { CITIES } from "../data";

export default function CityAutocomplete({ value, onSelect }) {
  // Türkçe'ye göre alfabetik sıralama (İ, Ş, Ğ, Ü gibi harfler doğru sırada)
  const sortedCities = [...CITIES].sort((a, b) =>
    a.name.localeCompare(b.name, "tr", { sensitivity: "base" })
  );

  const handleChange = (e) => {
    const id = e.target.value;
    if (!id) {
      onSelect(null);
      return;
    }
    const city = CITIES.find((c) => c.id === id) || null;
    onSelect(city);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Şehir Seç
      </label>
      <select
        value={value?.id || ""}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-2xl px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Bir şehir seç...</option>
        {sortedCities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.country})
          </option>
        ))}
      </select>
      {value && (
        <p className="text-xs text-gray-500">
          Seçilen şehir:{" "}
          <span className="font-semibold text-blue-600">{value.name}</span>
        </p>
      )}
    </div>
  );
}
