let preguntas_aleatorias = true;
let mostrar_pantalla_juego_términado = true;
let reiniciar_puntos_al_reiniciar_el_juego = true;

window.onload = function () {
  base_preguntas = readText("preguntas.json");
  interprete_bp = JSON.parse(base_preguntas);
  escogerPreguntaAleatoria();
};

let pregunta;
let posibles_respuestas;
btn_correspondiente = [
  select_id("btn1"),
  select_id("btn2"),
  select_id("btn3"),
  select_id("btn4"),
];
let npreguntas = [];

let preguntas_hechas = 0;
let preguntas_correctas = 0;

function escogerPreguntaAleatoria() {
  let n;
  if (preguntas_aleatorias) {
    n = Math.floor(Math.random() * interprete_bp.length);
  } else {
    n = 0;
  }

  while (npreguntas.includes(n)) {
    n++;
    if (n >= interprete_bp.length) {
      n = 0;
    }
    if (npreguntas.length == interprete_bp.length) {
      //Aquí es donde el juego se reinicia
      if (mostrar_pantalla_juego_términado) {
        swal.fire({
          title: "Juego finalizado",
          text:
            "Puntuación: " + preguntas_correctas + "/" + (preguntas_hechas - 1),
          icon: "success",
        });
      }
      if (reiniciar_puntos_al_reiniciar_el_juego) {
        preguntas_correctas = 0;
        preguntas_hechas = 0;
      }
      npreguntas = [];
    }
  }
  npreguntas.push(n);
  preguntas_hechas++;

  escogerPregunta(n);
}

function escogerPregunta(n) {
  pregunta = interprete_bp[n];
  select_id("pregunta").innerHTML = pregunta.titulo;
  if (preguntas_hechas > 1) {
    select_id("cantidad-preguntas").innerHTML = (preguntas_hechas - 1) + " / " + 20;
  } else {
    select_id("cantidad-preguntas").innerHTML = "0 / 20";
  }
  select_id("puntaje").innerHTML = preguntas_correctas
  desordenarRespuestas(pregunta);
}

function desordenarRespuestas(pregunta) {
  posibles_respuestas = [
    pregunta.opciones[0],
    pregunta.opciones[1],
    pregunta.opciones[2],
    pregunta.opciones[3],
  ];
  posibles_respuestas.sort(() => Math.random() - 0.5);

  select_id("btn1").innerHTML = posibles_respuestas[0].nombre;
  select_id("btn2").innerHTML = posibles_respuestas[1].nombre;
  select_id("btn3").innerHTML = posibles_respuestas[2].nombre;
  select_id("btn4").innerHTML = posibles_respuestas[3].nombre;
}

let suspender_botones = false;

function oprimir_btn(i) {
  if (suspender_botones) {
    return;
  }
  btn_correspondiente[i].classList.remove("btn-outline-light");
  btn_correspondiente[i].classList.add("btn-light");
  setTimeout(() => {
    suspender_botones = true;
    btn_correspondiente[i].classList.remove("btn-light");
    if (posibles_respuestas[i].opcionCorrecta == true) {
      preguntas_correctas += 10;
      btn_correspondiente[i].classList.add("btn-success");
    } else {
      btn_correspondiente[i].classList.add("btn-danger");
      setTimeout(() => {
        for (let j = 0; j < 4; j++) {
          if (posibles_respuestas[j].opcionCorrecta == true) {
            btn_correspondiente[j].classList.remove("btn-outline-light");
            btn_correspondiente[j].classList.add("btn-success");
            break;
          }
        }
      }, 500);
    }
  }, 1000);
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
  }, 3000);
}

function reiniciar() {
  if (preguntas_hechas-1 < 20) {
    for (const btn of btn_correspondiente) {
      if (btn.classList.contains("btn-success")) {
        btn.classList.remove("btn-success");
      } else {
        btn.classList.remove("btn-danger");
      }
      btn.classList.add("btn-outline-light");
    }
    escogerPreguntaAleatoria();
  }
}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}

function readText(ruta_local) {
  var texto = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", ruta_local, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    texto = xmlhttp.responseText;
  }
  return texto;
}
