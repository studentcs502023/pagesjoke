<script setup>
import axios from "axios";
import { ref, computed } from "vue";

const MODEL = "gemini-2.0-flash";

const excusaBase = ref("");
const nombreLlegador = ref("");
const fechaLlegada = ref("");
const horaLlegada = ref("");
const excusaGenerada = ref(""); // Aquí va el texto plano que genera la API

function parseExcusa(text) {
    const lines = text.split("\n");
    const htmlLines = [];

    for (let line of lines) {
        line = line.trim();

        // ignorar líneas vacías, agregar <br>
        if (line === "") {
            htmlLines.push("<br>");
            continue;
        }

        // eliminar asteriscos al inicio y al final
        line = line.replace(/^\*+|\*+$/g, "").trim();

        // Título principal
        if (/^CERTIFICADO OFICIAL/i.test(line)) {
            htmlLines.push(`<h2 class="title">${line}</h2>`);
            continue;
        }

        // Subtítulos terminados en ":" o palabras clave
        if (/^(Firma|Sello|Aval|Testigos|Observaciones|Consecuencias|Métricas|Ministerio|Certificado):/i.test(line)) {
            htmlLines.push(`<h3 class="subtitle">${line}</h3>`);
            continue;
        }

        // Lista con • - *
        if (/^[-*•]\s*/.test(line)) {
            htmlLines.push(`<p class="list-item">${line.replace(/^[-*•]\s*/, "• ")}</p>`);
            continue;
        }

        // todo lo demás, párrafo normal
        htmlLines.push(`<p>${line}</p>`);
    }

    return htmlLines.join("\n");
}

const excusaFormateada = computed(() => parseExcusa(excusaGenerada.value));

const generarExcusa = async () => {
    if (!excusaBase.value.trim()) {
        excusaGenerada.value = "❌ Por favor escribe una razón antes de generar la excusa.";
        return;
    }

    try {
        const keys = [
            import.meta.env.VITE_API_KEY,
            import.meta.env.VITE_API_KEY2,
            import.meta.env.VITE_API_KEY3,
        ];

        let respuestaFinal = null;

        for (const key of keys) {
            try {
                const contenido = [
                    {
                        role: "user",
                        parts: [
                            {
                                text:  `
Eres un maestro absoluto en generar excusas absurdas, cómicas y exageradas, con **humor callejero colombiano** al estilo Perros Criollo, Lokillo Flores, Camilo Sánchez y Camilo Pardo (El Mago). Tu misión es crear un "Certificado Oficial Ridículo" que explique **por qué ${nombreLlegador.value || "alguien"} llegó tarde** debido a: "${excusaBase.value}".  

Requerimientos:

1. **Argumentativo y narrativo**: La excusa debe explicar de manera absurda pero lógica dentro del caos la razón del retraso. Debe tener:
   - **Causa**: qué pasó y por qué detuvo a la persona.
   - **Desarrollo**: desarrolla una historia en un contexto colombiano ojala santandereano o antioqueño, con personajes reales, imaginarios, y realistas o no
   - **Testigos y petición**: personajes estrafalarios que confirmen los hechos y se pida que se excuse la tardanza.

2. **Humor directo y explosivo**: chistes callejeros, comparaciones ridículas de ves en cuando (“más peligroso que tocer con diarrea”, “caótico como un carrito de helados sobre Islandia”), lenguaje coloquial y exagerado. Nada de florituras aburridas.  

3. **inventa detalles** : crea una historia chistosa, entendible, pero que no sea creible, parte vital.

4. **Métricas absurdas y observaciones técnicas**: lo que haga falta para argumentar el retraso.

5. **Narrativa corta y directa**: 10-15 líneas máximo, flow natural, exagerada y disparatada, que haga reír desde la primera línea.  

6. **No dejes placeholders ni uses "**"**, inventa absolutamente todo. Intenta usar lo menos posible el doble asterisco "**"para no sufrir a la hora de mostrarlo, solo para titulos  

Objetivo: que el lector **entienda claramente por qué llegó tarde**, pero que sea exagerado, con humor callejero colombiano y flow de anécdota de esquina.  

Ejemplo de estilo deseado:
“Se certifica que Lionel Messi 'La Pulga' llegó tarde porque su perro es más peligroso que tocer con diarrea, y en el camino hubo un derrumbe de helados sobre Islandia, donde estaban de testigos Sami el Heladero y el Manco del Barrio alias ‘Velocirraptor’, por eso se solicita se le excuse su llegada tarde.”
`
                            },
                        ],
                    },
                ];

                const res = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
                    { contents: contenido },
                    { headers: { "Content-Type": "application/json" } }
                );

                respuestaFinal = res.data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (respuestaFinal) {
                    excusaGenerada.value = respuestaFinal;
                    console.log("📦 RESPUESTA COMPLETA:", res.data);
                    console.log("🎭 EXCUSA GENERADA:", respuestaFinal);
                    break;
                }
            } catch (error) {
                console.warn("⚠️ Falló esta API key, probando la siguiente...");
            }
        }

        if (!respuestaFinal) {
            excusaGenerada.value = "❌ Ninguna key funcionó.";
        }
    } catch (err) {
        console.error("❌ Error generando excusa:", err);
        excusaGenerada.value = "❌ Error generando excusa.";
    }
};
</script>


<template>
    <div class="p-4 max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold mb-4">Generador de Excusas Humorísticas</h2>

        <!-- Inputs -->
        <input v-model="excusaBase" placeholder="Ej: mi vecino tóxico, mi perro se orinó..."
            class="border p-2 rounded w-full mb-3" />
        <input v-model="nombreLlegador" placeholder="Nombre de quien llegó tarde"
            class="border p-2 rounded w-full mb-3" />
        <input v-model="fechaLlegada" type="date" placeholder="Fecha de llegada"
            class="border p-2 rounded w-full mb-3" />
        <input v-model="horaLlegada" type="time" placeholder="Hora de llegada"
            class="border p-2 rounded w-full mb-3" />

        <!-- Botón -->
        <button @click="generarExcusa" class="bg-blue-600 text-white px-4 py-2 rounded mb-6">
            Generar Excusa
        </button>

        <!-- Resultado estilo hoja con formato HTML -->
        <div class="certificado-container" v-if="excusaGenerada" v-html="excusaFormateada"></div>

        <!-- Firma, fecha y sello fijo -->
        <div v-if="excusaGenerada" class="firma-sello">
            <p>🖊 Firma: Lic. Ridículo F. Absurdo</p>
            <p>📅 Fecha: {{ new Date().toLocaleDateString() }}</p>
            <p>🔖 Sello Ficticio: Oficina Nacional de Excusas Increíbles</p>
        </div>
    </div>
</template>

<style scoped>
.certificado-container {
    max-width: 700px;
    margin: 40px auto;
    padding: 30px 40px;
    border: 4px double #444;
    background: white;
    font-family: "Courier New", Courier, monospace;
    box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.3);
    white-space: normal;
    color: #222;
    min-height: 400px;
}

.title {
    text-align: center;
    font-weight: 900;
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #333;
    text-decoration: underline;
}

.subtitle {
    font-weight: 700;
    margin-top: 1.5rem;
    font-size: 1.2rem;
    color: #555;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.3rem;
}

.list-item {
    margin-left: 1rem;
    font-size: 1rem;
    color: #444;
}

p {
    line-height: 1.5rem;
    margin: 0.3rem 0;
}

.firma-sello {
    max-width: 700px;
    margin: 20px auto 40px auto;
    border-top: 2px solid #ccc;
    padding-top: 15px;
    font-style: italic;
    color: #666;
    font-size: 0.9rem;
    text-align: right;
}
</style>
