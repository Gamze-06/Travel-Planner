// src/components/MapView.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import "leaflet/dist/leaflet.css";

// Vite + Leaflet için marker ikonlarını düzeltme
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).toString(),
  iconUrl: new URL(
    "leaflet/dist/images/marker-icon.png",
    import.meta.url
  ).toString(),
  shadowUrl: new URL(
    "leaflet/dist/images/marker-shadow.png",
    import.meta.url
  ).toString(),
});

const TURKEY_CENTER = [39.0, 35.0]; // yedek merkez

export default function MapView({ city, places, onAdd }) {
  const { center, zoom } = useMemo(() => {
    if (city?.lat != null && city?.lng != null) {
      return { center: [city.lat, city.lng], zoom: 11 };
    }
    return { center: TURKEY_CENTER, zoom: 6 };
  }, [city]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 rounded-2xl border border-slate-300 overflow-hidden mb-3">
        <MapContainer
          center={center}
          zoom={zoom}
          className="w-full h-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> katkıcıları'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {city?.lat != null && city?.lng != null && (
            <Marker position={[city.lat, city.lng]}>
              <Popup>
                {city.name} <br />
                {city.country}
              </Popup>
            </Marker>
          )}

          {places
            .filter((p) => p.lat != null && p.lng != null)
            .map((p) => (
              <Marker key={p.id} position={[p.lat, p.lng]}>
                <Popup>
                  <div className="space-y-1">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs">
                      Kategori: {p.category} <br />
                      Tahmini süre: {p.avgVisitMins || 60} dk
                    </div>
                    <button
                      type="button"
                      onClick={() => onAdd(p)}
                      className="mt-1 inline-block px-2 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white"
                    >
                      Plana ekle
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {/* Yakın yerler listesi aynı kalsın */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 md:p-4 overflow-auto max-h-72">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm md:text-base text-slate-800">
            Yakın Mekanlar
          </h3>
          <span className="text-xs text-slate-500">{places.length} sonuç</span>
        </div>

        {places.length === 0 ? (
          <p className="text-xs md:text-sm text-slate-500">
            Henüz “Yakındakileri Getir” butonuna basmadın ya da sonuç çıkmadı.
          </p>
        ) : (
          <ul className="space-y-2 text-sm md:text-base">
            {places.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              >
                <div>
                  <div className="font-semibold text-slate-800">{p.name}</div>
                  <div className="text-xs text-slate-500">
                    Kategori: {p.category} • Tahmini süre:{" "}
                    {p.avgVisitMins || 60} dk
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onAdd(p)}
                  className="ml-2 whitespace-nowrap px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700"
                >
                  Ekle
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
