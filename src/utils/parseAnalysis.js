export const GROUP_COLUMNS = {
  SUCCESS: [
    "Déclencheur / Usage",
    "Points forts / Aha moment",
    "Frictions rencontrées",
    "Suggestions d'amélioration",
  ],
  FAILURE: [
    "Contexte 1ère commande",
    "Expérience de bout en bout",
    "Raisons du retour aux habitudes",
    "Conditions de retour / Suggestions",
  ],
};

const METADATA_KEYS = new Set([
  "audio_id",
  "pharmacy",
  "status",
  "uploaded_at",
  "processed_at",
  "groupe",
  "error",
]);

const PLACEHOLDER_RE = /^non mentionn[eé]\.?$/i;
const PLACEHOLDER_SUFFIX_RE = /:\s*non mentionn[eé]\.?$/i;

export function isPlaceholderAnalysisText(text) {
  if (!text || typeof text !== "string") return true;
  const normalized = text.trim().replace(/^[-•*]\s*/, "");
  if (!normalized) return true;
  if (PLACEHOLDER_RE.test(normalized)) return true;
  if (PLACEHOLDER_SUFFIX_RE.test(normalized)) return true;
  return false;
}

export function parseTextToItems(text) {
  if (isPlaceholderAnalysisText(text)) return [];

  const bullets = text
    .split(/\n?[•\-*]\s+/)
    .filter(Boolean)
    .map((s) => s.trim())
    .filter((s) => s && !isPlaceholderAnalysisText(s));

  if (bullets.length > 1) return bullets;

  const lines = text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter((s) => s && !isPlaceholderAnalysisText(s));

  if (lines.length > 1) return lines;
  if (lines.length === 1) return lines;

  return text.trim() && !isPlaceholderAnalysisText(text) ? [text.trim()] : [];
}

export function getAnalysisKeysFromDoc(doc) {
  return Object.keys(doc).filter((key) => !METADATA_KEYS.has(key));
}

export function orderAnalysisKeys(keys, groupe) {
  const preferred = GROUP_COLUMNS[groupe] || [];
  const ordered = preferred.filter((key) => keys.includes(key));
  keys.forEach((key) => {
    if (!ordered.includes(key)) ordered.push(key);
  });
  return ordered;
}

function buildAnalysisColumns(doc) {
  return Object.fromEntries(
    getAnalysisKeysFromDoc(doc).map((key) => [key, parseTextToItems(doc[key])])
  );
}

export function getVisibleColumns(rows) {
  if (!rows.length) return [];

  const keys = new Set();
  rows.forEach((row) => {
    Object.keys(row.analysisColumns || {}).forEach((key) => keys.add(key));
  });

  const ordered = orderAnalysisKeys([...keys], rows[0].groupe);
  return ordered.filter((key) =>
    rows.some((row) => (row.analysisColumns?.[key]?.length ?? 0) > 0)
  );
}

export function mapResultRow(doc) {
  const groupe = doc.groupe === "SUCCESS" ? "SUCCESS" : "FAILURE";
  const hasAnalysis = doc.status === "done";

  return {
    id: doc.audio_id,
    pharmacy: doc.pharmacy,
    groupe,
    status: doc.status,
    analysisColumns: hasAnalysis ? buildAnalysisColumns(doc) : null,
    raw: doc,
  };
}

export function mapDetailSections(doc) {
  const groupe = doc.groupe === "SUCCESS" ? "SUCCESS" : "FAILURE";
  if (doc.status !== "done") return [];

  const columns = buildAnalysisColumns(doc);
  return orderAnalysisKeys(Object.keys(columns), groupe)
    .filter((key) => (columns[key]?.length ?? 0) > 0)
    .map((key) => ({ title: key, items: columns[key] }));
}
