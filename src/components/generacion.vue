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

const options = ["clasica", "medica", "judicial", "laboral", "informal"];

const excusaFormateada = computed(() => parseExcusa(excusaGenerada.value));

const estilosPagina = computed(() => {
    const paddingMap = {
        medica: "210px",
        judicial: "215px", 
        informal: "190px",        
        clasica: "130px",  
        laboral: "130px"
    };

    const topSpace = paddingMap[model.value] || "130px";

    return {
        backgroundImage: model.value ? `url(/fondos/${model.value}.png)` : 'none',
        paddingTop: topSpace 
    };
});

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
            <h2 class="titulo">Generador de excusas</h2>

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

        <div class="pagina-a4" v-if="excusaGenerada" :style="estilosPagina">
            <div class="certificado-container" v-html="excusaFormateada"></div>
        </div>
    </div>
</template>

<style scoped src="../assets/estilosCertificado.css"></style>
