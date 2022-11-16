let preguntas_aleatorias = true;
let mostrar_pantalla_juego_términado = true;
let reiniciar_puntos_al_reiniciar_el_juego = true;
let nombreJugador = "";
let cantidadPreguntas;
let preguntas_correctas = 0;
let puntaje = 0;
let preguntasRespondidas = [];
let tituloPreguntaActual = "";
let opcionUsuarioActual = "";
let opcioCorrectaActual = "";

window.onload = function () {
  select_id("parte-inicio").style.display = "block";
  select_id("parte-juego").style.display = "none";
  select_id("parte-final").style.display = "none";
};

function juegoBienvenida() {
  nombreJugador = select_id("floatingInput").value;
  let seleccion = select_id("total-preguntas");
  cantidadPreguntas = seleccion.options[seleccion.selectedIndex].value;
}

function iniciaJuego() {
  juegoBienvenida();
  select_id("parte-inicio").style.display = "none";
  select_id("parte-juego").style.display = "block";
  select_id("parte-final").style.display = "none";
  base_preguntas = readText("preguntas.json");
  interprete_bp = JSON.parse(base_preguntas);
  escogerPreguntaAleatoria();
}

function finalJuego() {
  select_id("parte-inicio").style.display = "none";
  select_id("parte-juego").style.display = "none";
  select_id("parte-final").style.display = "block";
  select_id("nombre").innerHTML = nombreJugador;
  select_id("puntaje-final").innerHTML = puntaje;
  select_id("acertadas-final").innerHTML = preguntas_correctas;
  select_id("preguntas-final").innerHTML = cantidadPreguntas;
  let lista = select_id("lista-preguntas");
  for (let pregunta of preguntasRespondidas) {
    let li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-start"
    );
    if (pregunta.resCorrecta === pregunta.resUsuario) {
      li.innerHTML = `
        <div class="me-2 ms-0">
          <div class="fw-bold">${pregunta.titulo}</div>
          Elegiste: <span class="badge text-bg-success">${pregunta.resUsuario}</span>
          <br>
          Correcta: <span class="badge text-bg-success">${pregunta.resCorrecta}</span>
        </div>
        <i class="bi bi-check-circle-fill text-success fs-3"></i>
      `;
    } else {
      li.innerHTML = `
        <div class="me-2 ms-0">
          <div class="fw-bold">${pregunta.titulo}</div>
          Elegiste: <span class="badge text-bg-danger">${pregunta.resUsuario}</span>
          <br>
          Correcta: <span class="badge text-bg-success">${pregunta.resCorrecta}</span>
        </div>
        <i class="bi bi-x-circle-fill text-danger fs-3"></i>
      `;
    }

    lista.appendChild(li);
  }
}

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

function escogerPreguntaAleatoria() {
  let n = Math.floor(Math.random() * interprete_bp.length);
  npreguntas.push(n);
  preguntas_hechas++;
  escogerPregunta(n);
}

function escogerPregunta(n) {
  pregunta = interprete_bp[n];
  tituloPreguntaActual = pregunta.titulo;
  select_id("pregunta").innerHTML = tituloPreguntaActual;
  if (preguntas_hechas > 1) {
    select_id("cantidad-preguntas").innerHTML =
      preguntas_hechas + " / " + cantidadPreguntas;
  } else {
    select_id("cantidad-preguntas").innerHTML = "1 / " + cantidadPreguntas;
  }
  select_id("puntaje").innerHTML = puntaje;
  let porcentajeBarra = 0;
  if (cantidadPreguntas == 5) {
    porcentajeBarra = 20;
  } else if (cantidadPreguntas == 10) {
    porcentajeBarra = 10;
  } else if (cantidadPreguntas == 20) {
    porcentajeBarra = 5;
  } else if (cantidadPreguntas == 30) {
    porcentajeBarra = 3.3333333;
  }
  select_id("barra-progreso").style.width =
    preguntas_hechas * porcentajeBarra + "%";
  desordenarRespuestas(pregunta);
  updateClock();
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
    opcionUsuarioActual = posibles_respuestas[i].nombre;
    suspender_botones = true;
    btn_correspondiente[i].classList.remove("btn-light");
    if (posibles_respuestas[i].opcionCorrecta == true) {
      preguntas_correctas++;
      puntaje += 10;
      btn_correspondiente[i].classList.add("btn-success");
      opcioCorrectaActual = posibles_respuestas[i].nombre;
    } else {
      btn_correspondiente[i].classList.add("btn-danger");
      setTimeout(() => {
        for (let j = 0; j < 4; j++) {
          if (posibles_respuestas[j].opcionCorrecta == true) {
            btn_correspondiente[j].classList.remove("btn-outline-light");
            btn_correspondiente[j].classList.add("btn-success");
            opcioCorrectaActual = posibles_respuestas[j].nombre;
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

function agruparPreguntas(titulo, respuestaUsuario, respuestaCorrecta) {
  class Pregunta {
    constructor(titulo, resUsuario, resCorrecta) {
      this.titulo = titulo;
      this.resUsuario = resUsuario;
      this.resCorrecta = resCorrecta;
    }
  }
  let opcionPregunta = new Pregunta(
    titulo,
    respuestaUsuario,
    respuestaCorrecta
  );
  preguntasRespondidas.push(opcionPregunta);
}

function reiniciar() {
  agruparPreguntas(
    tituloPreguntaActual,
    opcionUsuarioActual,
    opcioCorrectaActual
  );
  if (preguntas_hechas < cantidadPreguntas) {
    for (const btn of btn_correspondiente) {
      if (btn.classList.contains("btn-success")) {
        btn.classList.remove("btn-success");
      } else {
        btn.classList.remove("btn-danger");
      }
      btn.classList.add("btn-outline-light");
    }
    select_id("barra-tiempo").classList.remove("bg-danger");
    select_id("barra-tiempo").classList.remove("bg-warning");
    select_id("barra-tiempo").classList.add("bg-success");
    escogerPreguntaAleatoria();
  } else {
    preguntas_hechas - 1 === cantidadPreguntas;
    finalJuego();
  }
}

function updateClock() {
  let tiempoPregunta = 20;
  let barraTiempo = 0;
  select_id("barra-tiempo").style.width = barraTiempo + "%";
  select_id("countdown").innerHTML = tiempoPregunta;
  setTimeout(() => {
    const contador = setInterval(() => {
      if (tiempoPregunta <= 0) {
        clearInterval(contador);
        clearInterval(barra);
        for (let j = 0; j < 4; j++) {
          if (posibles_respuestas[j].opcionCorrecta == true) {
            btn_correspondiente[j].classList.remove("btn-outline-light");
            btn_correspondiente[j].classList.add("btn-success");
            break;
          }
        }
        setTimeout(() => {
          reiniciar();
          suspender_botones = false;
        }, 2000);
      } else {
        tiempoPregunta--;
      }
      select_id("countdown").innerHTML = tiempoPregunta;
    }, 1000);
    const barra = setInterval(() => {
      barraTiempo += 0.5;
      select_id("barra-tiempo").style.width = barraTiempo + "%";
      if (barraTiempo > 40 && barraTiempo < 70) {
        select_id("barra-tiempo").classList.remove("bg-success");
        select_id("barra-tiempo").classList.add("bg-warning");
      } else if (barraTiempo > 70) {
        select_id("barra-tiempo").classList.remove("bg-warning");
        select_id("barra-tiempo").classList.add("bg-danger");
      }
    }, 100);
    select_id("btn1").addEventListener("click", () => {
      clearInterval(contador);
      clearInterval(barra);
    });
    select_id("btn2").addEventListener("click", () => {
      clearInterval(contador);
      clearInterval(barra);
    });
    select_id("btn3").addEventListener("click", () => {
      clearInterval(contador);
      clearInterval(barra);
    });
    select_id("btn4").addEventListener("click", () => {
      clearInterval(contador);
      clearInterval(barra);
    });
  }, 500);
}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}

function reiniciarJuego() {
  window.location.reload();
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
