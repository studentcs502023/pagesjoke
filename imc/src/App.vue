<script setup>
import { ref } from "vue";
import pp from "./components/pp.vue"
import ia from "./components/ia.vue"


let resultado = ref("");
let nombre = ref("");
let altura = ref("");
let peso = ref("");
let permiso = ref("")
let imc = ref();
let imageSrc = ref("https://i.pinimg.com/474x/cc/56/1d/cc561d3f7fbee0fe20f9ffd9bb87ed18.jpg");
let imageAlt = ref("imagen no disponible");
let personas = ref([]);

const imgs = [
  {
    src: "https://tse1.mm.bing.net/th/id/OIP.xXnbUyGQLJQXIq2j2yyvqQHaGa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    alt: "peso bajo",
  },
  {
    src: "https://tse3.mm.bing.net/th/id/OIP.m645fMwQDZ6WnsTEUhuMVwHaG2?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    alt: "normal",
  },
  {
    src: "https://img.freepik.com/vector-gratis/hombre-sobrepeso-deprimido-burbujas-discurso_1308-134117.jpg?w=1380&t=st=1686119458~exp=1686120058~hmac=de98b0a63ca3b867d9579a88c5cceafc19755c892edadb90a36276c7a3b65d18",
    alt: "sobrepeso",
  },
  {
    src: "https://i.pinimg.com/736x/28/89/4d/28894d9f68ea9c566ece2595b232f99b.jpg",
    alt: "Obeso",
  },
];


function calcularIMC() {
  if (!nombre.value || altura.value === "" || peso.value === "") {
    resultado.value = "Por favor, complete todos los campos❌";
  } else if (altura.value <= 0 || peso.value <= 0) {
    resultado.value = "La altura y el peso deben ser valores positivos❌";
  } else {
    let alturaM = altura.value / 100;
    imc = peso.value / (alturaM * alturaM);
     resultado.value = `${nombre.value}, tu IMC es de ${imc.toFixed(2)}`;
    permiso.value = true;
    let persona = {
      nombre: nombre.value,
      altura: altura.value,
      peso: peso.value,
      imc: imc.toFixed(2),
    };
    personas.value.push(persona);    
    asignarImg();
  }
}

function asignarImg(){
  if(permiso.value === true){
    if(imc < 18.5){
      imageSrc.value = imgs[0].src;
      imageAlt.value = imgs[0].alt;
    }else if(imc < 24.9){
      imageSrc.value = imgs[1].src;
      imageAlt.value = imgs[1].alt;
    }else if(imc < 29.9){
      imageSrc.value = imgs[2].src;
      imageAlt.value = imgs[2].alt;
    }else{
      imageSrc.value = imgs[3].src;
      imageAlt.value = imgs[3].alt;
    }
  }
  console.log(personas);
  
}
</script>

<!-- <template>
  <div id="container">
    <div id="card">
      <h1 class="titulo">Calculadora IMC</h1>
      <input
        type="text"
        placeholder="Escribe aqui el nombre de la persona"
        class="inputs"
        v-model="nombre"
      />
      <input
        type="number"
        placeholder="Altura en centimetros"
        class="inputs"
        v-model="altura"
      />
      <input
        type="number"
        placeholder="Peso en kilogramos"
        class="inputs"
        v-model="peso"
      />
      <button class="bt" @click="calcularIMC">Calcular IMC</button>
      <h1 class="titulo">Respuesta</h1>
      <p
        :class="
          !nombre || !altura || !peso || altura < 0 || peso < 0
            ? 'error': imc < 18.5 ? 'text1' : imc < 24.9 ? 'text2' : imc < 29.9 ? 'text3' : imc >= 30 ? 'text4' : 'text'"
        v-text="resultado"
      ></p>
      <div>
        <img id="imagen" :src="imageSrc" :alt="imageAlt">
      </div>
    </div>
  </div>
</template> -->

<template>
<ia></ia>
</template>

<style scoped>
#container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

#card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  width: 35%;
}
.titulo {
  font-size: 2em;
  color: #333333;
  text-align: center;
}

.inputs {
  display: block;
  width: 80%;
  padding: 10px;
  margin: 10px auto;
  border: 1px solid #3f3a3a;
  border-radius: 4px;
  font-size: 1em;
}

.bt {
  display: block;
  width: 50%;
  padding: 10px;
  margin: 20px auto;
  background-color: #4caf50;
  color: white;
  border: solid 1px #3f3a3a;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.bt:hover {
  background-color: #45a049;
  transform: scale(1.05);
}
.text {
  font-size: 1.2em;
  color: #000000;
  text-align: center;
}

.text1 {
  font-size: 1.2em;
  color: rgb(247, 231, 14);
  text-align: center;
}

.text2 {
  font-size: 1.2em;
  color: #1bb935;
  text-align: center;
}

.text3 {
  font-size: 1.2em;
  color: #ff6f2c;
  text-align: center;
}

.text4 {
  font-size: 1.2em;
  color: #ff0e0e;
  text-align: center;
}

.error {
  font-size: 1.2em;
  color: #ff0000;
  text-align: center;
}

#imagen {
  display: block;
  margin: 20px auto;
  max-width: 300px;
  height: auto;
  border-radius: 3px;
}
</style>
