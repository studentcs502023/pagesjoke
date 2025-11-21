import axios from "axios";
import { Notify } from "quasar";

export function useGenerarExcusa(MODEL) {

    async function generarExcusa({
        excusaBase,
        nombreLlegador,
        fechaLlegada,
        horaLlegada,
        model,              
        validateInputs,
        excusaGenerada,
        isGenerating
    }) {

        if (isGenerating.value) return;

        const falta = validateInputs();
        if (falta) {
            Notify.create({
                type: 'negative',
                message: falta,
                position: 'top',
                timeout: 3000,
                actions: [{ label: 'OK', color: 'black' }]
            });
            return;
        }

        isGenerating.value = true;

        try {
            const keys = [
                import.meta.env.VITE_API_KEY,
                import.meta.env.VITE_API_KEY2,
                import.meta.env.VITE_API_KEY3,
            ].filter(Boolean);

            let respuestaFinal = null;

            const contenido = [
                {
                    role: "user",
                    parts: [
                        {
                            text: `text: Eres un maestro absoluto en generar excusas absurdas, cómicas y exageradas, 
                    con **humor callejero colombiano** al estilo Perros Criollo, Lokillo Flores, Camilo Sánchez y Camilo Pardo (El Mago).
                    Tu misión es crear un "Certificado Oficial Ridículo" que explique 
                    **por qué ${nombreLlegador.value || "alguien"} llegó tarde** el día ${fechaLlegada.value || "no especificado"} a las ${horaLlegada.value || "hora no especificada"}, 
                    siguiendo el estilo oficial del documento (${(model && model.value) || "certificación cómica"}), debido a: "${excusaBase.value}". 
                    Requerimientos: 
                    1. **Argumentativo y narrativo**: La excusa debe explicar de manera absurda pero lógica dentro del caos la razón del retraso. 
                    Debe tener: - **Causa**: qué pasó y por qué detuvo a la persona. - **Desarrollo**: desarrolla una historia en un contexto colombiano ojala santandereano
                    o antioqueño, con personajes reales, imaginarios, y realistas o no - **Testigos y petición**: personajes estrafalarios que confirmen los hechos y se pida
                    que se excuse la tardanza. procura que sea cual sea el estilo siempre tenga una firma
                    2. **Humor directo y explosivo**: chistes callejeros, comparaciones ridículas de ves en cuando
                    (“más peligroso que tocer con diarrea”, “caótico como un carrito de helados sobre Islandia”), lenguaje coloquial y exagerado.
                    Nada de florituras aburridas. 
                    3. **inventa detalles** : crea una historia chistosa, entendible, pero que no sea creible, parte vital. 
                    4. **Métricas absurdas y observaciones técnicas**: lo que haga falta para argumentar el retraso. 
                    5. **Narrativa corta**: no superes las 19 lineas, el objetivo es que no sea canson y extenso de leer
                    flow natural, exagerada y disparatada, que haga reír desde la primera línea. 
                    6. **No dejes placeholders ni uses "**"**, inventa absolutamente todo. 
                    Intenta usar lo menos posible el doble asterisco "**". y si no tienes datos INVENTALOS, no dejes []
                    
                    Objetivo: que el lector 
                    **entienda claramente por qué llegó tarde**, pero que sea exagerado, con humor callejero colombiano y flow de anécdota de esquina. 
                    Ejemplo de estilo deseado: “Se certifica que Lionel Messi 'La Pulga' llegó tarde porque su perro es más peligroso que tocer con diarrea, 
                    y en el camino hubo un derrumbe de helados sobre Islandia, donde estaban de testigos Sami el Heladero y el Manco del Barrio alias ‘Velocirraptor’, 
                    por eso se solicita se le excuse su llegada tarde.”`
                        }
                    ]
                }
            ];

            for (const key of keys) {
                try {
                    const res = await axios.post(
                        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
                        { contents: contenido },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    const candidate = res?.data?.candidates?.[0];
                    const partText = candidate?.content?.parts?.[0]?.text;

                    if (partText && partText.trim()) {
                        respuestaFinal = partText;
                        excusaGenerada.value = respuestaFinal;
                        break;
                    } else {
                        console.warn("⚠️ Respuesta sin texto, probando siguiente key...");
                    }
                } catch (error) {
                    console.warn("⚠️ Falló esta API key, probando la siguiente...");
                    console.error(error?.response?.data || error);
                }
            }

            if (!respuestaFinal) {
                excusaGenerada.value =
                    "❌ Ninguna key funcionó o no se obtuvo respuesta válida.";
            }

        } catch (err) {
            console.error("❌ Error generando excusa:", err);
            excusaGenerada.value = "❌ Error generando excusa.";
        } finally {
            isGenerating.value = false;
        }
    }

    return { generarExcusa };
}
