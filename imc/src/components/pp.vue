<script setup>
import { ref, watch, computed } from "vue";

const nombre = ref("Miguel");

// Propiedad calculada
const nombreMayus = computed(() => {
  console.log("Se recalcula"); // Solo se ejecuta si 'nombre' cambia
  return nombre.value.toUpperCase();
});

const contador = ref(0);

// Observador
watch(contador, (nuevo, viejo) => {
  console.log(`Contador cambió de ${viejo} a ${nuevo}`);
  if (nuevo === 10) {
    alert("¡Llegaste a 10!");
  }
});
</script>

<template>
  <div>
    <p>Contador: {{ contador }}</p>
    <button @click="contador++">Incrementar</button>
  </div>
   <div>
    <input v-model="nombre" placeholder="Escribe tu nombre" />
    <p>En mayúsculas: {{ nombreMayus }}</p>
  </div>
</template>

<style>

</style>