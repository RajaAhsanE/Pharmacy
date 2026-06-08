function parsePipeLine(line) {
  const parts = line.split("|").map((s) => s.trim());
  if (parts[0] === "") parts.shift();
  if (parts[parts.length - 1] === "") parts.pop();
  return parts;
}

function isSeparatorLine(line) {
  return /^[\s|\-:]+$/.test(line);
}

export function parsePipeTable(text) {
  if (!text || typeof text !== "string") return { headers: [], rows: [] };

  const lines = text
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return { headers: [], rows: [] };

  const headers = parsePipeLine(lines[0]);
  const rows = lines
    .slice(1)
    .filter((line) => !isSeparatorLine(line))
    .map(parsePipeLine)
    .filter((row) => row.some((cell) => cell && cell !== "—"));

  return { headers, rows };
}

export function parseCellBullets(cell) {
  if (!cell || cell === "—" || cell === "-") return [];

  const normalized = cell.replace(/<br\s*\/?>/gi, "\n");
  return normalized
    .split("\n")
    .map((s) => s.trim().replace(/^[-•*]\s*/, "").trim())
    .filter((s) => s && s !== "—" && s !== "-");
}

export function parseCrossAnalysis(text) {
  const { headers, rows } = parsePipeTable(text);
  if (!rows.length) return { headers, themes: [] };

  return {
    headers,
    themes: rows.map((row) => ({
      theme: row[0] || "",
      success: row[1] || "",
      failure: row[2] || "",
      successItems: parseCellBullets(row[1]),
      failureItems: parseCellBullets(row[2]),
    })),
  };
}

export function parsePriorityActions(text) {
  const { headers, rows } = parsePipeTable(text);
  if (!rows.length) return { headers, actions: [] };

  return {
    headers,
    actions: rows.map((row) => ({
      num: row[0] || "",
      action: row[1] || "",
      priority: row[2] || "",
      groupe: row[3] || "",
      detail: row[4] || "",
    })),
  };
}
