// ------------------- DATOS DEL JUGADOR -------------------
// ------------------- SISTEMA DE MISIONES -------------------
let misiones = {
  matarEnemigos: { progreso: 0, objetivo: 3, recompensa: 30 },
  subirNiveles: { progreso: 0, objetivo: 3, recompensa: 40 },
  encontrarObjetos: { progreso: 0, objetivo: 3, recompensa: 20 }
};

function actualizarMisiones() {
  let texto = `Misiones:<br>`;
  texto += `Matar 3 enemigos: ${misiones.matarEnemigos.progreso}/${misiones.matarEnemigos.objetivo}<br>`;
  texto += `Subir 3 niveles: ${misiones.subirNiveles.progreso}/${misiones.subirNiveles.objetivo}<br>`;
  texto += `Encontrar 3 objetos: ${misiones.encontrarObjetos.progreso}/${misiones.encontrarObjetos.objetivo}<br>`;
  document.getElementById("misiones").innerHTML = texto;
}
let jugador = {
  nombre: "Aventurero",
  nivel: 1,
  vida: 100,
  ataque: 10,
  defensa: 5,
  monedas: 50
};

// ------------------- ENEMIGOS -------------------
let enemigos = [
  { nombre: "Duende", vida: 30, ataque: 8, defensa: 2, sprite: "img/duende.png" },
  { nombre: "Esqueleto", vida: 50, ataque: 12, defensa: 4, sprite: "img/esqueleto.png" },
  { nombre: "Orco", vida: 80, ataque: 15, defensa: 6, sprite: "img/orco.png" }
];

let enemigoActual = null;

// ------------------- FUNCIONES DE SONIDO -------------------
// ------------------- ANIMACIONES DEL CABALLERO -------------------
function mostrarAnimacionCaballero(tipo) {
  var caballero = document.getElementById("spriteCaballero");
  if (!caballero) return;

  // Oculta y resetea cualquier animación previa
  caballero.style.display = "none";
  caballero.className = "";

  // Selecciona la animación y muestra el sprite
  if (tipo === "idle") {
    caballero.classList.add("quieto");
    caballero.style.display = "block";
  } else if (tipo === "ataque") {
    caballero.classList.add("golpe");
    caballero.style.display = "block";
    setTimeout(function() {
      caballero.style.display = "none";
      caballero.className = "";
    }, 2500); // igual a la duración del ataque
  } else if (tipo === "muerte") {
    caballero.classList.add("muerte");
    caballero.style.display = "block";
    setTimeout(function() {
      caballero.style.display = "none";
      caballero.className = "";
    }, 3500); // igual a la duración de la muerte
  }
}
function reproducirSonido(ruta) {
  let sonido = new Audio(ruta);
  sonido.play();
}

// ------------------- MOSTRAR ESTADO -------------------
function actualizarEstado() {
  document.getElementById("vidaJugador").textContent = jugador.vida;
  document.getElementById("ataqueJugador").textContent = jugador.ataque;
  document.getElementById("defensaJugador").textContent = jugador.defensa;
  document.getElementById("monedasJugador").textContent = jugador.monedas;
  document.getElementById("experienciaJugador").textContent = jugador.experiencia || 0;
}

// ------------------- LOG -------------------
function log(mensaje) {
  document.getElementById("log").innerHTML = mensaje;
}

// ------------------- EXPLORAR -------------------
function explorar() {
  log("Exploras el bosque...");
  let evento = Math.random();

  let objetoEncontrado = false;
  if (evento < 0.5) { // aparece enemigo
    enemigoActual = JSON.parse(JSON.stringify(enemigos[Math.floor(Math.random() * enemigos.length)]));
    document.getElementById("enemigo").style.display = "block";
    document.getElementById("batalla").style.display = "block";

    document.getElementById("nombreEnemigo").textContent = enemigoActual.nombre;
    document.getElementById("vidaEnemigo").textContent = enemigoActual.vida;
    document.getElementById("spriteEnemigo").src = enemigoActual.sprite;

    proteccionesRestantes = 3;
    protegidoEsteTurno = false;

    log("¡Un " + enemigoActual.nombre + " salvaje apareció!");
  } else if (evento < 0.8) { // encuentras objeto especial
    let tipo = Math.floor(Math.random() * 5);
    let mensaje = "";
    if (tipo === 0) {
      jugador.ataque += 5;
      mensaje = "¡Encontraste una Espada mágica! Ataque +5.";
    } else if (tipo === 1) {
      jugador.defensa += 5;
      mensaje = "¡Encontraste un Escudo legendario! Defensa +5.";
    } else if (tipo === 2) {
      jugador.vida = Math.min(jugador.vida + 20, 100);
      mensaje = "¡Encontraste una Poción de vida! Vida +20.";
    } else if (tipo === 3) {
      jugador.experiencia += 15;
      mensaje = "¡Encontraste un Pergamino de sabiduría! Experiencia +15.";
    } else if (tipo === 4) {
      jugador.monedas += 30;
      mensaje = "¡Encontraste un Cofre de oro! Monedas +30.";
    }
    objetoEncontrado = true;
    actualizarEstado();
    log(mensaje);
  } else {
    log("No encontraste nada interesante...");
  }
  if (objetoEncontrado) {
    misiones.encontrarObjetos.progreso++;
    if (misiones.encontrarObjetos.progreso >= misiones.encontrarObjetos.objetivo) {
      jugador.monedas += misiones.encontrarObjetos.recompensa;
      log("¡Misión completada: Encontrar 3 objetos! +" + misiones.encontrarObjetos.recompensa + " monedas.");
      misiones.encontrarObjetos.progreso = 0;
    }
    actualizarMisiones();
    actualizarEstado();
  }
}

// ------------------- DESCANSAR -------------------
function descansar() {
  jugador.vida = Math.min(jugador.vida + 10, 100);
  actualizarEstado();
  log("Descansaste y recuperaste 10 puntos de vida.");
}

// ------------------- MERCADO -------------------
function mostrarMercado() {
  document.getElementById("mercado").style.display = "block";
  log("Bienvenido al mercado. Elige un objeto para comprar.");
}

function cerrarMercado() {
  document.getElementById("mercado").style.display = "none";
  log("Mercado cerrado.");
}

function comprar(objeto) {
  if (objeto === "armadura") {
    if (jugador.monedas >= 30) {
      jugador.monedas -= 30;
      jugador.defensa += 3;
      actualizarEstado();
      log("¡Has comprado una armadura ligera! Defensa +3.");
    } else {
      log("No tienes suficientes monedas para la armadura ligera.");
    }
  } else if (objeto === "espada") {
    if (jugador.monedas >= 40) {
      jugador.monedas -= 40;
      jugador.ataque += 5;
      actualizarEstado();
      log("¡Has comprado una espada de hierro! Ataque +5.");
    } else {
      log("No tienes suficientes monedas para la espada de hierro.");
    }
  } else if (objeto === "pocion") {
    if (jugador.monedas >= 20) {
      jugador.monedas -= 20;
      if (!jugador.experiencia) jugador.experiencia = 0;
      jugador.experiencia += 10;
      actualizarEstado();
      log("¡Has comprado una poción! Experiencia +10.");
    } else {
      log("No tienes suficientes monedas para la poción.");
    }
  }
}

// ------------------- SALIR -------------------
function salir() {
  log("¡Gracias por jugar!");
}

// ------------------- INICIO -------------------
window.onload = function() {
  actualizarEstado();
  actualizarMisiones();
  log("¡Bienvenido al juego de aventura!");
};
// ------------------- TIPOS DE ATAQUE -------------------
function huir() {
  if (!enemigoActual) return;
  let exito = Math.random() < 0.75; // 75% de éxito
  if (exito) {
    log("¡Has huido con éxito!");
    document.getElementById("batalla").style.display = "none";
    document.getElementById("enemigo").style.display = "none";
    enemigoActual = null;
  } else {
    log("¡No pudiste huir! El enemigo te ataca.");
    finalizarTurnoBatalla();
  }
}
// ------------------- PROTEGERSE -------------------
let proteccionesRestantes = 3;
let protegidoEsteTurno = false;

function protegerse() {
  if (!enemigoActual) return;
  if (proteccionesRestantes > 0) {
    jugador.vida = Math.min(jugador.vida + 10, 100);
    proteccionesRestantes--;
    protegidoEsteTurno = true;
    actualizarEstado();
    log("¡Te has protegido! Vida +10. No recibirás daño este turno. Protecciones restantes: " + proteccionesRestantes);
    setTimeout(finalizarTurnoBatalla, 700);
  } else {
    log("Ya has usado todas tus protecciones en este combate.");
  }
}
  proteccionesRestantes = 3;
  protegidoEsteTurno = false;

function atacarFuerte() {
  if (!enemigoActual) return;
  reproducirSonido("sounds/ataque.mp3");
  let critico = Math.random() < 0.3; // 30% de crítico
  let danoBase = jugador.ataque + 2;
  let danoJugador = critico ? danoBase * 2 : danoBase;
  danoJugador = Math.max(0, danoJugador - enemigoActual.defensa);
    let subioNivelAntes = jugador.nivel;
  enemigoActual.vida -= danoJugador;
    if (enemigoActual.vida <= 0) {
      jugador.experiencia += 20;
      misiones.matarEnemigos.progreso++;
      if (misiones.matarEnemigos.progreso >= misiones.matarEnemigos.objetivo) {
        jugador.monedas += misiones.matarEnemigos.recompensa;
        log("¡Misión completada: Matar 3 enemigos! +" + misiones.matarEnemigos.recompensa + " monedas.");
        misiones.matarEnemigos.progreso = 0;
      }
      actualizarMisiones();
      actualizarEstado();
      log("¡Has derrotado al " + enemigoActual.nombre + "! Experiencia +20.");
    }
    setTimeout(function() {
      if (jugador.nivel > subioNivelAntes) {
        misiones.subirNiveles.progreso += jugador.nivel - subioNivelAntes;
        if (misiones.subirNiveles.progreso >= misiones.subirNiveles.objetivo) {
          jugador.monedas += misiones.subirNiveles.recompensa;
          log("¡Misión completada: Subir 3 niveles! +" + misiones.subirNiveles.recompensa + " monedas.");
          misiones.subirNiveles.progreso = 0;
        }
        actualizarMisiones();
        actualizarEstado();
      }
    }, 100);
  document.getElementById("vidaEnemigo").textContent = enemigoActual.vida;
  log("Ataque fuerte: hiciste " + danoJugador + " de daño" + (critico ? " (¡Crítico!)" : "") + ".");
  finalizarTurnoBatalla();
    setTimeout(function() {
      mostrarAnimacionCaballero("idle");
    }, 2500);
}

function atacarEspecial() {
  if (!enemigoActual) return;
  reproducirSonido("sounds/ataque.mp3");
  let exito = Math.random() < 0.6; // 60% de éxito
    let subioNivelAntes = jugador.nivel;
    if (exito) {
      let danoJugador = Math.max(0, Math.floor(jugador.ataque * 1.5) - enemigoActual.defensa);
      enemigoActual.vida -= danoJugador;
      document.getElementById("vidaEnemigo").textContent = enemigoActual.vida;
      log("Ataque especial: hiciste " + danoJugador + " de daño.");
      if (enemigoActual.vida <= 0) {
        jugador.experiencia += 20;
        misiones.matarEnemigos.progreso++;
        if (misiones.matarEnemigos.progreso >= misiones.matarEnemigos.objetivo) {
          jugador.monedas += misiones.matarEnemigos.recompensa;
          log("¡Misión completada: Matar 3 enemigos! +" + misiones.matarEnemigos.recompensa + " monedas.");
          misiones.matarEnemigos.progreso = 0;
        }
        actualizarMisiones();
        actualizarEstado();
        log("¡Has derrotado al " + enemigoActual.nombre + "! Experiencia +20.");
      }
    } else {
      log("Ataque especial fallido: el enemigo esquivó el ataque.");
    }
  finalizarTurnoBatalla();
    setTimeout(function() {
      mostrarAnimacionCaballero("idle");
    }, 2500);
}


function finalizarTurnoBatalla() {
  if (enemigoActual.vida <= 0) {
    reproducirSonido("sounds/victoria.mp3");
    let recompensa = "¡Derrotaste al " + enemigoActual.nombre + "!<br>Recompensa: 10 monedas";
    jugador.monedas += 10;
    // Probabilidad de obtener objeto especial
    let objeto = null;
    let prob = Math.random();
    if (prob < 0.2) {
      objeto = "Armadura ligera (+3 defensa)";
      jugador.defensa += 3;
      recompensa += "<br>¡Has encontrado una Armadura ligera! Defensa +3.";
    } else if (prob < 0.35) {
      objeto = "Espada de hierro (+5 ataque)";
      jugador.ataque += 5;
      recompensa += "<br>¡Has encontrado una Espada de hierro! Ataque +5.";
    } else if (prob < 0.5) {
      objeto = "Poción (+10 experiencia)";
      if (!jugador.experiencia) jugador.experiencia = 0;
      jugador.experiencia += 10;
      recompensa += "<br>¡Has encontrado una Poción! Experiencia +10.";
    }
    actualizarEstado();
    log(recompensa);
    document.getElementById("batalla").style.display = "none";
    document.getElementById("enemigo").style.display = "none";
    enemigoActual = null;
    return;
  }
  // Daño enemigo -> jugador
  if (!protegidoEsteTurno) {
    let danoEnemigo = Math.max(0, enemigoActual.ataque - jugador.defensa);
    jugador.vida -= danoEnemigo;
    actualizarEstado();
    log(document.getElementById("log").innerHTML + "<br>" + enemigoActual.nombre + " te hizo " + danoEnemigo + " de daño.");
    if (jugador.vida <= 0) {
      log("¡Has sido derrotado!");
      reproducirSonido("sounds/derrota.mp3");
      document.getElementById("batalla").style.display = "none";
      document.getElementById("enemigo").style.display = "none";
    }
  } else {
    log(document.getElementById("log").innerHTML + "<br>¡Estás protegido y no recibiste daño!");
    protegidoEsteTurno = false;
  }
}
