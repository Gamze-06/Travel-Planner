// src/components/InterestButtons.jsx
const OPTIONS = [
  { id: "history", label: "Tarihi Yerler" },
  { id: "nature", label: "Doğa & Manzara" },
  { id: "food", label: "Yeme–İçme" },
  { id: "shopping", label: "Alışveriş" },
  { id: "beach", label: "Plajlar" },        // ✅ yeni
  { id: "view", label: "Şehir Manzarası" }, // istersen bunu da kullanırsın
  { id: "nightlife", label: "Gece Hayatı" },
  { id: "other", label: "Diğer" },
];

export default function InterestButtons({ value, onChange }) {
  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-2 text-gray-800">İlgi Alanlarını Seç</h3>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={`px-3 py-2 rounded-full text-sm md:text-base border transition ${
              value.includes(opt.id)
                ? "bg-blue-600 text-white border-blue-600 shadow"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
