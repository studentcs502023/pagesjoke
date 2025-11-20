<script setup>
import { ref, computed } from "vue";

import { parseExcusa } from "./parseExcusa";               
import { useGenerarExcusa } from "./useExcusa";   

const MODEL = "gemini-2.0-flash";

const excusaBase = ref("");
const nombreLlegador = ref("");
const fechaLlegada = ref("");
const horaLlegada = ref("");
const model = ref(null);              
const excusaGenerada = ref("");
const isGenerating = ref(false);

const options = ["Clásica", "Médica", "Judicial", "Laboral", "Informal"];

const excusaFormateada = computed(() => parseExcusa(excusaGenerada.value));

function validateInputs() {
    if (!excusaBase.value?.trim()) return "Por favor escribe la razón de la excusa";
    if (!nombreLlegador.value?.trim()) return "Por favor ingresa el nombre de quien llegó tarde";
    if (!fechaLlegada.value?.trim()) return "Por favor selecciona la fecha de llegada";
    if (!horaLlegada.value?.trim()) return "Por favor selecciona la hora de llegada";
    if (!model.value) return "Por favor selecciona el estilo del certificado";
    return null;
}

const { generarExcusa } = useGenerarExcusa(MODEL);

async function generar() {
    await generarExcusa({
        excusaBase,
        nombreLlegador,
        fechaLlegada,
        horaLlegada,
        model,              
        validateInputs,
        excusaGenerada,
        isGenerating
    });
}
</script>

<template>
    <div class="container">
        <div class="dad">
            <h2 class="titulo">Generador de excusas por llegar tarde</h2>

            <q-input rounded outlined v-model="excusaBase" label="Describe la excusa"
                placeholder="Ejemplo: un perro me mordió" />

            <q-input rounded outlined v-model="nombreLlegador" label="Nombre de quien llegó tarde"
                placeholder="Pedro Diaz" />

            <div class="fecha">
                <div class="q-pa-md">
                    <q-input filled v-model="fechaLlegada" mask="date" :rules="['date']">
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date v-model="fechaLlegada">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>

                <div class="q-pa-md">
                    <q-input filled v-model="horaLlegada" mask="time" :rules="['time']">
                        <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-time v-model="horaLlegada" now-btn>
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                    </q-time>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>
            </div>

            <q-select outlined v-model="model" :options="options" label="Estilo del certificado" />

            <q-btn style="background: goldenrod; color: white" label="Generar Excusa" :loading="isGenerating"
                :disable="isGenerating" @click="generar" />
        </div>

        <div class="certificado-container" v-if="excusaGenerada" v-html="excusaFormateada"></div>

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

.titulo {
    font-size: 3em;
    font-family: Arial, Helvetica, sans-serif;
    background: linear-gradient(90deg, red, blue);
    -webkit-background-clip: text;
    /* Necesario para Chrome/Safari */
    background-clip: text;
    color: transparent;
    text-align: center;
    line-height: 3rem;
}

p {
    margin: 0.3rem 0;
    line-height: 1.5rem;
}

.firma-sello {
    max-width: 700px;
    margin: 20px auto 40px auto;
    padding-top: 15px;
    border-top: 2px solid #ccc;
    font-style: italic;
    color: #666;
    font-size: 0.9rem;
    text-align: right;
}

.q-pa-md {
    padding: 0;
}

.dad {
    display: grid;
    width: 80%;
    min-width: 320px;
    gap: 10px;
    padding: 15px;
    box-sizing: border-box;
    border: 2px solid #ddd;
    border-radius: 12px;
    background: white;
    margin-top: 5px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.container {
    display: grid;
    justify-items: center;
    align-self: center;
}

.fecha {
    margin-top: 10px;
}
</style>
