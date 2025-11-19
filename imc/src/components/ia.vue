<script setup>
// 👉 Importar axios (puede estar instalado vía npm)
import axios from "axios";
import { ref } from "vue";

// ⚙️ Modelo de Gemini
const MODEL = "gemini-2.0-flash";

// 📥 Input donde el usuario escribe la razón (ej: "vecino tóxico")
const excusaBase = ref("");

// 📤 Función para generar excusa humorística
const generarExcusa = async () => {
    try {
        const keys = [
            import.meta.env.VITE_API_KEY,
            import.meta.env.VITE_API_KEY2,
            import.meta.env.VITE_API_KEY3
        ];

        let respuestaFinal = null;

        for (const key of keys) {
            try {
                const contenido = [
                    {
                        role: "user",
                        parts: [{
                            text: `Eres un generador experto de excusas cómicas, absurdas, con humor negro colombiano, 
                            sarcasmo y exageración al estilo de comedia callejera.
                            
                            Quiero que construyas una excusa inventada, ridícula pero lógica,
                            explicando por qué llegué tarde debido a: **${excusaBase.value}**.

                            Reglas:
                            - Tono: exagerado, callejero, sarcástico y con humor negro ligero.
                            - Narrativa estilo "esto solo pasa en Colombia".
                            - Entre 6 y 10 líneas máximo.
                            - No nombres programas ni comediantes reales.
                            - Hazlo tipo certificado o reporte oficial absurdo.
                            - Incluye consecuencias, testigos y un sello/firma ficticia.
                            - Debe ser única, original y graciosa.
                            `
                        }]
                    }
                ];

                const res = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
                    { contents: contenido },
                    { headers: { "Content-Type": "application/json" } }
                );

                respuestaFinal = res.data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (respuestaFinal) {
                    console.log("📦 RESPUESTA COMPLETA:", res.data);
                    console.log("🎭 EXCUSA GENERADA:", respuestaFinal);
                    break;
                }

            } catch (error) {
                console.warn("⚠️ Falló esta API key, probando la siguiente...");
            }
        }

        if (!respuestaFinal) {
            console.error("❌ Ninguna key funcionó.");
        }

    } catch (err) {
        console.error("❌ Error generando excusa:", err);
    }
};
</script>

<template>
    <div class="p-4">
        <h2>Generador de Excusas Humorísticas</h2>

        <!-- Input -->
        <input v-model="excusaBase" placeholder="Ej: mi vecino tóxico, mi perro se orinó..."
            class="border p-2 rounded w-full mb-3" />

        <!-- Botón -->
        <button @click="generarExcusa" class="bg-blue-600 text-white px-4 py-2 rounded">
            Generar Excusa
        </button>
    </div>
</template>
