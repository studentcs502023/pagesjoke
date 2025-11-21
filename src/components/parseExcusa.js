export function parseExcusa(text) {
    if (!text) return "";

    const raw = String(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    const escapeHtml = (str) =>
        str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    const safe = escapeHtml(raw);
    const lines = safe.split("\n");
    const out = [];
    let listBuffer = null;

    const pushListBuffer = () => {
        if (!listBuffer) return;
        const tag = listBuffer.type === "ol" ? "ol" : "ul";
        out.push(`<${tag} class="excusa-list">`);
        for (const it of listBuffer.items) out.push(`<li>${it}</li>`);
        out.push(`</${tag}>`);
        listBuffer = null;
    };

    const inlineFormat = (s) => {
        s = s.replace(/\*\*(.+?)\*\*/g, (_, g1) => `<strong>${g1}</strong>`);
        s = s.replace(/(^|[^*])\*(?!\*)(.+?)\*(?!\*)([^*]|$)/g, (_, a, g1, b) =>
            `${a}<em>${g1}</em>${b}`
        );
        s = s.replace(/`([^`]+?)`/g, (_, g1) => `<code>${g1}</code>`);
        return s;
    };

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (!line) {
            pushListBuffer();
            continue;
        }

        const lineClean = line.replace(/^\*+|\*+$/g, "").trim();

        if (/^CERTIFICADO OFICIAL/i.test(lineClean) || /^#{1,6}\s+/.test(line)) {
            pushListBuffer();
            const mdMatch = line.match(/^#{1,6}\s+(.*)/);
            const titleText = mdMatch ? mdMatch[1] : lineClean;
            out.push(`<h2 class="titulo-ia">${inlineFormat(titleText)}</h2>`);
            continue;
        }

        const keywordsRegex = /^(Expediente|Fecha|Hora|Asunto|Instituci[oó]n|Dirigido|Expedido|El que suscribe|Quien suscribe|Certifica|Da fe|Testigos|Por lo tanto|Firma|Sello|Nota|Causa|Motivo|Observaciones|Desarrollo|Diagnóstico|Explicación Detallada|Paciente|Emitido por).{0,60}:/i;
        const boldStartRegex = /^\*\*[^*]+:\*\*/;

        if (keywordsRegex.test(lineClean) || boldStartRegex.test(line)) {
            pushListBuffer();
            out.push(`<p class="excusa-campo">${inlineFormat(line)}</p>`);
            continue;
        }

        const olMatch = line.match(/^\s*\d+\.\s+(.*)/);
        if (olMatch) {}

        const liMatch = line.match(/^\s*[-*•]\s+(.*)/);
        if (liMatch) {}

        pushListBuffer();

        const words = lineClean.split(/\s+/);
        if (lineClean === lineClean.toUpperCase() && words.length <= 8 && /[A-ZÁÉÍÓÚÑ]/.test(lineClean) && lineClean.includes(':')) {
            out.push(`<p class="excusa-campo">${inlineFormat(line)}</p>`);
            continue;
        }

        out.push(`<p class="excusa-parrafo">${inlineFormat(line)}</p>`);
    }

    pushListBuffer();

    return out.join("\n");
}
