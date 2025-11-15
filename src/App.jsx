import { useState } from "react";
import CityAutocomplete from "./components/CityAutocomplete";
import InterestButtons from "./components/InterestButtons";
import MapView from "./components/MapView";
import { getPlacesByCity, fetchNearbyPlaces } from "./api";
import { buildPlan } from "./plan";

const DEFAULT_DUR = {
  history: 90,
  nature: 120,
  food: 75,
  shopping: 90,
  view: 60,
  beach: 150,
  other: 60,
};

export default function App() {
  const [city, setCity] = useState(null);
  const [interests, setInterests] = useState([]);
  const [plan, setPlan] = useState([]);
  const [nearby, setNearby] = useState([]);
  const [loadingNear, setLoadingNear] = useState(false);
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState([]);

  // (Lokal) Plan Oluştur
  const handlePlan = async () => {
    if (!city || interests.length === 0) {
      alert("Lütfen şehir ve ilgi alanı seç ☺️");
      return;
    }

    try {
      const places = await getPlacesByCity(city.id);

      if (!places || places.length === 0) {
        setNote(
          "Bu şehir için şu an planlanabilir mekan verisi bulunamadı. 'Yakındakileri Getir' ile genel önerileri görebilirsin."
        );
        setPlan([]);
        return;
      }

      const filtered = interests.length
        ? places.filter((p) => interests.includes(p.category))
        : places;

      if (filtered.length === 0) {
        setNote(
          "Bu şehirde seçtiğin ilgi alanlarına uygun mekan bulunamadı. İlgi alanı seçimini genişletmeyi deneyebilirsin."
        );
        setPlan([]);
        return;
      }

      setNote("");
      setPlan(buildPlan(filtered));
    } catch (err) {
      console.error(err);
      setNote(
        "Plan oluştururken bir sorun oluştu. Lütfen daha sonra tekrar dene."
      );
    }
  };

  // Yakındakileri Getir
  const handleNearby = async () => {
    if (!city) {
      alert("Önce bir şehir seç ☺️");
      return;
    }

    setLoadingNear(true);
    try {
      const res = await fetchNearbyPlaces(city.id, interests);
      setNearby(res);

      if (res.length === 0) {
        setNote(
          "Bu kriterlere uygun yakın yer bulunamadı. İlgi alanlarını genişletmeyi dene."
        );
      } else {
        setNote("");
      }
    } catch (e) {
      console.error(e);
      setNote(
        "Yakındaki yerleri çekerken bir sorun oldu. Biraz sonra tekrar dene."
      );
    } finally {
      setLoadingNear(false);
    }
  };

  const handleAddToPlan = (place) => {
    setSelected((prev) => {
      const exists = prev.some((x) => x.id === place.id);
      if (exists) return prev;
      return [...prev, place];
    });
  };

  const handleBuildFromSelected = () => {
    if (selected.length === 0) {
      alert("Önce haritadan birkaç yer ekle 😊");
      return;
    }
    const withDurations = selected.map((p) => ({
      ...p,
      avgVisitMins: DEFAULT_DUR[p.category] || DEFAULT_DUR.other,
    }));
    setPlan(buildPlan(withDurations));
  };

  const removeSelected = (id) => {
    setSelected((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-base md:text-lg">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 tracking-tight">
            🧳 Travel Planner
          </h1>
          <p className="mt-2 text-gray-700 text-lg md:text-xl">
            Şehir bul, ilgi alanlarını seç, yakındakileri keşfet ve planını
            çıkar.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sol panel */}
          <section className="lg:col-span-4 bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-6 md:p-8 space-y-6">
            <CityAutocomplete value={city} onSelect={setCity} />
            <InterestButtons value={interests} onChange={setInterests} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handlePlan}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold shadow"
              >
                (Lokal) Plan Oluştur
              </button>
              <button
                onClick={handleNearby}
                disabled={loadingNear}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-4 rounded-2xl font-bold shadow"
              >
                {loadingNear ? "Yükleniyor..." : "Yakındakileri Getir 🗺️"}
              </button>
              <button
                onClick={handleBuildFromSelected}
                className="sm:col-span-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold shadow"
              >
                Seçtiklerimden Planla ✨
              </button>
            </div>

            {note && (
              <div className="text-base md:text-lg text-amber-800 bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                {note}
              </div>
            )}

            {selected.length > 0 && (
              <div className="bg-gray-50 p-5 rounded-2xl border shadow-inner space-y-3">
                <h2 className="font-bold text-xl md:text-2xl text-gray-800">
                  🧩 Seçtiklerin
                </h2>
                <ul className="space-y-2">
                  {selected.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between text-base md:text-lg bg-white border rounded-xl p-3"
                    >
                      <span>
                        <span className="font-semibold text-blue-600">
                          {s.name}
                        </span>{" "}
                        <span className="text-gray-500">— {s.category}</span>
                      </span>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => removeSelected(s.id)}
                      >
                        Kaldır
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Sağ panel */}
          <section className="lg:col-span-8 space-y-6">
            <div className="bg-white/90 shadow-2xl rounded-3xl p-3 md:p-4">
              <div className="h-[420px] sm:h-[520px] lg:h-[680px]">
                <MapView city={city} places={nearby} onAdd={handleAddToPlan} />
              </div>
            </div>

            {plan.length > 0 && (
              <div className="bg-white/95 shadow-2xl rounded-3xl p-6 md:p-8">
                <h2 className="font-extrabold text-3xl md:text-4xl text-blue-800 mb-6 text-center">
                  📅 Günlük Plan
                </h2>
                <div className="space-y-4">
                  {plan.map((p, i) => (
                    <div
                      key={i}
                      className="p-5 bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 hover:shadow-lg transition"
                    >
                      <div className="flex flex-wrap items-center justify-between">
                        <div className="font-bold text-blue-700 text-lg md:text-xl">
                          {p.placeName}
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-200 text-blue-800">
                          {p.category}
                        </span>
                      </div>

                      {p.description && (
                        <p className="mt-2 text-gray-700 text-base md:text-lg leading-snug">
                          {p.description}
                        </p>
                      )}

                      {p.address && (
                        <p className="mt-1 text-gray-600 text-sm md:text-base">
                          📍 <span className="italic">{p.address}</span>
                        </p>
                      )}

                      <p className="mt-2 text-gray-500 text-sm md:text-base">
                        ⏱ Tahmini ziyaret süresi: {p.duration} dk
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
