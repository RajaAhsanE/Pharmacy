export function parseTextToItems(text) {
  if (!text || typeof text !== "string") return [];
  const bullets = text
    .split(/\n?[•\-*]\s+/)
    .filter(Boolean)
    .map((s) => s.trim())
    .filter(Boolean);
  if (bullets.length > 1) return bullets;
  const lines = text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (lines.length > 1) return lines;
  return text.trim() ? [text.trim()] : [];
}

export function mapResultRow(doc) {
  const isSuccess = doc.groupe === "SUCCESS";
  const hasAnalysis = doc.status === "done";
  return {
    id: doc.audio_id,
    pharmacy: doc.pharmacy,
    groupe: doc.groupe,
    status: doc.status,
    analysis: hasAnalysis
      ? {
          trigger: parseTextToItems(
            isSuccess ? doc["Déclencheur / Usage"] : doc["Contexte 1ère commande"]
          ),
          strengths: parseTextToItems(
            isSuccess ? doc["Points forts / Aha moment"] : doc["Expérience de bout en bout"]
          ),
          frictions: parseTextToItems(
            isSuccess ? doc["Frictions rencontrées"] : doc["Raisons du retour aux habitudes"]
          ),
          suggestions: parseTextToItems(
            isSuccess
              ? doc["Suggestions d'amélioration"]
              : doc["Conditions de retour / Suggestions"]
          ),
        }
      : null,
    raw: doc,
  };
}

export function mapDetailAnalysis(doc) {
  const isSuccess = doc.groupe === "SUCCESS";
  if (doc.status !== "done") return null;
  return {
    trigger: parseTextToItems(
      isSuccess ? doc["Déclencheur / Usage"] : doc["Contexte 1ère commande"]
    ),
    strengths: parseTextToItems(
      isSuccess ? doc["Points forts / Aha moment"] : doc["Expérience de bout en bout"]
    ),
    frictions: parseTextToItems(
      isSuccess ? doc["Frictions rencontrées"] : doc["Raisons du retour aux habitudes"]
    ),
    suggestions: parseTextToItems(
      isSuccess
        ? doc["Suggestions d'amélioration"]
        : doc["Conditions de retour / Suggestions"]
    ),
  };
}
