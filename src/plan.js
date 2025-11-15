// src/plan.js

// dakika cinsinden zamanı "09:00" formatına çevirir
function minutesToTime(totalMins) {
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const pad = (n) => (n < 10 ? "0" + n : "" + n);
  return `${pad(h)}:${pad(m)}`;
}

/**
 * places: JSON'dan gelen mekan listesi
 *   {
 *     id, name, category, description, address,
 *     avgVisitMins, ...
 *   }
 *
 * Çıktı:
 *   [
 *     {
 *       start, end, duration,
 *       placeId, placeName,
 *       category, description, address
 *     },
 *     ...
 *   ]
 */
export function buildPlan(places, startHour = 9, breakMins = 15) {
  const plan = [];
  let current = startHour * 60; // 09:00

  // Kategorilere göre basit bir sıralama
  const order = [
    "history",
    "nature",
    "view",
    "beach",
    "food",
    "shopping",
    "nightlife",
    "other",
  ];

  const sorted = [...places].sort((a, b) => {
    const ia = order.indexOf(a.category);
    const ib = order.indexOf(b.category);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  sorted.forEach((p) => {
    const duration = p.avgVisitMins || 60;
    const start = minutesToTime(current);
    const end = minutesToTime(current + duration);

    plan.push({
      start,
      end,
      duration,
      placeId: p.id,
      placeName: p.name,
      category: p.category,
      description: p.description,
      address: p.address,
    });

    current += duration + breakMins;
  });

  return plan;
}
