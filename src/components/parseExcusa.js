// parseExcusa.js
export function parseExcusa(text) {
    if (!text) return "";

    // Normalizar saltos y asegurar string
    const raw = String(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // Escape básico para evitar inyección (no tocar * ni **)
    const escapeHtml = (str) =>
        str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    // Aplicar escape global primero
    const safe = escapeHtml(raw);

    const lines = safe.split("\n");

    const out = [];
    let listBuffer = null; // { type: "ul" | "ol", items: [] }

    const pushListBuffer = () => {
        if (!listBuffer) return;
        if (listBuffer.type === "ol") {
            out.push(`<ol class="excusa-list">`);
            for (const it of listBuffer.items) out.push(`<li>${it}</li>`);
            out.push(`</ol>`);
        } else {
            out.push(`<ul class="excusa-list">`);
            for (const it of listBuffer.items) out.push(`<li>${it}</li>`);
            out.push(`</ul>`);
        }
        listBuffer = null;
    };

    // helpers para formateo inline (negrita / cursiva / code)
    const inlineFormat = (s) => {
        // **negrita**
        s = s.replace(/\*\*(.+?)\*\*/g, (_, g1) => `<strong>${g1}</strong>`);
        // *cursiva* but avoid matching the ** we already handled
        s = s.replace(/(^|[^*])\*(?!\*)(.+?)\*(?!\*)([^*]|$)/g, (_, a, g1, b) =>
            `${a}<em>${g1}</em>${b}`
        );
        // `code`
        s = s.replace(/`([^`]+?)`/g, (_, g1) => `<code>${g1}</code>`);
        return s;
    };

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // Línea vacía -> separador / salto
        if (!line) {
            // cerrar listas abiertas
            pushListBuffer();
            out.push("<br>");
            continue;
        }

        // Quitar asteriscos envolventes tipo *texto* al inicio y final (si aplican)
        line = line.replace(/^\*+|\*+$/g, "").trim();

        // Detectar título principal (ej: "CERTIFICADO OFICIAL")
        if (/^CERTIFICADO OFICIAL/i.test(line) || /^#{1,6}\s+/i.test(line)) {
            pushListBuffer();
            // Si viene con # como markdown, normalizamos el texto sin #
            const mdMatch = line.match(/^#{1,6}\s+(.*)/);
            const titleText = mdMatch ? mdMatch[1] : line;
            out.push(`<h2 class="title">${inlineFormat(titleText)}</h2>`);
            continue;
        }

        // Subtítulos (terminan en ':') o palabras clave
        if (/^(Firma|Sello|Aval|Testigos|Observaciones|Consecuencias|Métricas|Ministerio|Certificado):/i.test(line) || /:\s*$/.test(line)) {
            pushListBuffer();
            out.push(`<h3 class="subtitle">${inlineFormat(line)}</h3>`);
            continue;
        }

        // Listas numeradas: "1. texto"
        const olMatch = line.match(/^\s*\d+\.\s+(.*)/);
        if (olMatch) {
            if (!listBuffer) listBuffer = { type: "ol", items: [] };
            else if (listBuffer.type !== "ol") {
                // flush y empezar ol si antes era ul
                pushListBuffer();
                listBuffer = { type: "ol", items: [] };
            }
            listBuffer.items.push(inlineFormat(olMatch[1].trim()));
            continue;
        }

        // Listas con -, * o •
        const liMatch = line.match(/^\s*[-*•]\s+(.*)/);
        if (liMatch) {
            if (!listBuffer) listBuffer = { type: "ul", items: [] };
            else if (listBuffer.type !== "ul") {
                pushListBuffer();
                listBuffer = { type: "ul", items: [] };
            }
            listBuffer.items.push(inlineFormat(liMatch[1].trim()));
            continue;
        }

        // Si llega aquí es texto normal; cerrar cualquier lista previa
        pushListBuffer();

        // Si la línea está escrita en mayúsculas y tiene pocas palabras, tratar como subtítulo
        const words = line.split(/\s+/);
        if (line === line.toUpperCase() && words.length <= 6 && /[A-ZÁÉÍÓÚÑ]/.test(line)) {
            out.push(`<h3 class="subtitle">${inlineFormat(line)}</h3>`);
            continue;
        }

        // Párrafo normal
        out.push(`<p>${inlineFormat(line)}</p>`);
    }

    // flush final
    pushListBuffer();

    // unir con saltos (útil para v-html)
    return out.join("\n");
}
