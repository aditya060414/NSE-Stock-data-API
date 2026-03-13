/* =========================
   Helper Functions
========================= */

export function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

export function nseParts(d) {
  return {
    dd: String(d.getDate()).padStart(2, "0"),
    mm: String(d.getMonth() + 1).padStart(2, "0"),
    yyyy: d.getFullYear(),
  };
}


