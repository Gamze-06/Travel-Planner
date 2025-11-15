// src/api.js
import axios from "axios";

let PLACES_CACHE = null;

// 81 şehrin tamamını turkiye-places.json'dan yükle
async function loadPlaces() {
  if (!PLACES_CACHE) {
    const res = await axios.get("/turkiye-places.json");
    PLACES_CACHE = res.data; // { adana: [...], ist: [...], ... }
  }
  return PLACES_CACHE;
}

// Şehre göre mekanlar
export async function getPlacesByCity(cityId) {
  const data = await loadPlaces();
  return data[cityId] || [];
}

// Yakındakileri Getir
export async function fetchNearbyPlaces(cityId, interests = []) {
  const data = await loadPlaces();

  // Önce o şehrin mekanları
  let result = data[cityId] || [];

  // Şehirde veri yoksa tüm Türkiye'den öneri ver
  if (!result || result.length === 0) {
    result = Object.values(data).flat();
  }

  // İlgi alanlarına göre filtrele
  if (interests.length > 0) {
    result = result.filter((p) => interests.includes(p.category));
  }

  // Çok kalabalık olmasın diye sınırla
  return result.slice(0, 20);
}
