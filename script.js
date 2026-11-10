/* ==========================================================
   QUIZ TIC · script.js
   Toda la lógica del juego. Secciones:
      1. Configuración             9. Responder y calcular puntos
      2. Estado del juego         10. Comodines (50/50 y +10 s)
      3. Elementos de la página   11. Resultados y nota
      4. Utilidades               12. Ranking (se guarda en el navegador)
      5. Cambiar de pantalla      13. Sonidos (Web Audio API)
      6. Pantalla de inicio       14. Tema claro / oscuro
      7. Preparar la partida      15. Efectos: fondo, confeti y mascota
      8. Mostrar pregunta y reloj 16. Teclado y arranque
   Las preguntas están en preguntas.js
   ========================================================== */

'use strict';

/* ---------- 1. CONFIGURACIÓN ---------- */
const CONFIG = {
  segundosPorPregunta: 20,
  puntosPorAcierto: 100,
  bonoRapidezMaximo: 50,   // si respondes al instante ganas +50; entre más esperes, menos
  bonoRachaPorAcierto: 10, // +10 por cada acierto seguido...
  bonoRachaMaximo: 50,     // ...hasta un máximo de +50
  segundosExtra: 10,       // lo que suma el comodín "+10 s"
  puestosRanking: 10,
};

// Nombres con los que se guarda la información en el navegador (localStorage)
const CLAVES = {
  ranking: 'quiztic-ranking',
  tema: 'quiztic-tema',
  sonido: 'quiztic-sonido',
  nombre: 'quiztic-nombre',
};

const LETRAS = ['A', 'B', 'C', 'D'];
const FRASES_ACIERTO = ['¡Correcto!', '¡Exacto!', '¡Bien hecho!', '¡Así es!', '¡Muy bien!'];
const CIRCUNFERENCIA_RELOJ = 2 * Math.PI * 19; // el círculo del reloj tiene radio 19 (ver index.html)

/* ---------- 2. ESTADO DEL JUEGO ---------- */
// Un solo objeto guarda todo lo que pasa durante la partida
const estado = {
  jugador: '',
  temas: [],
  conTiempo: true,
  preguntas: [],     // las preguntas de esta partida, ya mezcladas
  indice: 0,         // número de la pregunta actual (empieza en 0)
  puntaje: 0,
  racha: 0,          // aciertos seguidos
  mejorRacha: 0,
  respuestas: [],    // historial: qué respondió el jugador en cada pregunta
  comodines: { cincuenta: true, tiempo: true },
  respondida: false,
  // temporizador
  intervalo: null,
  finTiempo: 0,      // momento exacto en que se acaba el tiempo
  duracion: 0,
  ultimoTic: null,
  inicioPregunta: 0,
  // otros
  pantalla: 'pantalla-inicio',
  ultimoRegistro: null,
};

/* ---------- 3. ELEMENTOS DE LA PÁGINA ---------- */
const $ = (selector) => document.querySelector(selector);

const el = {
  // barra superior
  mascota: $('#mascota'),
  btnRanking: $('#btn-ranking'),
  btnSonido: $('#btn-sonido'),
  btnTema: $('#btn-tema'),
  // inicio
  form: $('#form-config'),
  nombre: $('#nombre'),
  listaTemas: $('#lista-temas'),
  conTiempo: $('#con-tiempo'),
  avisoTemas: $('#aviso-temas'),
  btnComenzar: $('#btn-comenzar'),
  // juego
  contador: $('#contador'),
  chipTema: $('#chip-tema'),
  racha: $('#racha'),
  rachaNum: $('#racha-num'),
  puntaje: $('#puntaje'),
  flotante: $('#flotante'),
  progreso: $('#progreso'),
  tarjeta: $('#tarjeta'),
  textoPregunta: $('#texto-pregunta'),
  reloj: $('#reloj'),
  relojArco: $('#reloj-arco'),
  relojNum: $('#reloj-num'),
  opciones: $('#opciones'),
  comodines: $('#comodines'),
  btn5050: $('#btn-5050'),
  btnTiempo: $('#btn-tiempo'),
  retro: $('#retro'),
  retroEstado: $('#retro-estado'),
  retroPuntos: $('#retro-puntos'),
  retroDesglose: $('#retro-desglose'),
  retroCorrecta: $('#retro-correcta'),
  retroTexto: $('#retro-texto'),
  btnSiguiente: $('#btn-siguiente'),
  anuncio: $('#anuncio'),
  // resultados
  resTitulo: $('#res-titulo'),
  resNotaCaja: $('#res-nota-caja'),
  resNota: $('#res-nota'),
  resSello: $('#res-sello'),
  resMensaje: $('#res-mensaje'),
  resRecord: $('#res-record'),
  resPuntaje: $('#res-puntaje'),
  resAciertos: $('#res-aciertos'),
  resRacha: $('#res-racha'),
  resTiempo: $('#res-tiempo'),
  resTemas: $('#res-temas'),
  resRevision: $('#res-revision'),
  btnOtraVez: $('#btn-otra-vez'),
  btnCambiar: $('#btn-cambiar'),
  btnVerRanking: $('#btn-ver-ranking'),
  // ranking
  dialogo: $('#dialogo-ranking'),
  btnCerrarRanking: $('#btn-cerrar-ranking'),
  rankingTabla: $('#ranking-tabla'),
  rankingCuerpo: $('#ranking-cuerpo'),
  rankingVacio: $('#ranking-vacio'),
  btnBorrar: $('#btn-borrar'),
  confirmarBorrado: $('#confirmar-borrado'),
  btnBorrarSi: $('#btn-borrar-si'),
  btnBorrarNo: $('#btn-borrar-no'),
  // efectos
  lienzoFondo: $('#lienzo-fondo'),
  lienzoConfeti: $('#lienzo-confeti'),
};

/* ---------- 4. UTILIDADES ---------- */

// Mezcla una lista al azar (algoritmo de Fisher-Yates) sin cambiar la original
function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Devuelve el código de un ícono del "sprite" que está al inicio de index.html
function icono(nombre) {
  return `<svg class="ico" aria-hidden="true"><use href="#i-${nombre}"></use></svg>`;
}

function dosDigitos(numero) {
  return String(numero).padStart(2, '0');
}

function reducirMovimiento() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Vuelve a disparar una animación de CSS (quita la clase y la pone otra vez)
function reiniciarAnimacion(elemento, clase) {
  elemento.classList.remove(clase);
  void elemento.getBoundingClientRect(); // obliga al navegador a notar el cambio
  elemento.classList.add(clase);
}

// Lee el valor de una variable de CSS, por ejemplo un color del tema
function leerColor(variable) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

// Guardar y leer datos en el navegador (localStorage).
// Si el navegador no deja guardar (por ejemplo, en modo incógnito), se usa la memoria.
const memoria = {};

function leerGuardado(clave, valorPorDefecto) {
  try {
    const texto = localStorage.getItem(clave);
    if (texto !== null) return JSON.parse(texto);
  } catch (error) {
    // sin acceso a localStorage: seguimos con la memoria
  }
  return clave in memoria ? memoria[clave] : valorPorDefecto;
}

function guardar(clave, valor) {
  memoria[clave] = valor;
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    // no se pudo guardar: el dato queda en memoria mientras la página esté abierta
  }
}

// Anima un número desde un valor hasta otro (el puntaje, la nota...)
function animarNumero(elemento, desde, hasta, duracion = 700, decimales = 0) {
  const turno = (elemento.turnoAnimacion || 0) + 1;
  elemento.turnoAnimacion = turno; // si llega otra animación, esta se detiene
  if (reducirMovimiento()) {
    elemento.textContent = hasta.toFixed(decimales);
    return;
  }
  const inicio = performance.now();
  function paso(ahora) {
    if (elemento.turnoAnimacion !== turno) return;
    const avance = Math.min(1, (ahora - inicio) / duracion);
    const suave = 1 - Math.pow(1 - avance, 3); // arranca rápido y frena al final
    elemento.textContent = (desde + (hasta - desde) * suave).toFixed(decimales);
    if (avance < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}

/* ---------- 5. CAMBIAR DE PANTALLA ---------- */
function mostrarPantalla(id) {
  document.querySelectorAll('.pantalla').forEach((seccion) => {
    seccion.hidden = seccion.id !== id;
  });
  estado.pantalla = id;
  // Durante la partida no se abre el ranking, porque el reloj sigue corriendo
  el.btnRanking.disabled = id === 'pantalla-juego';
  window.scrollTo({ top: 0 });
}

/* ---------- 6. PANTALLA DE INICIO ---------- */

// Crea una tarjeta (casilla) por cada tema que tenga preguntas
function pintarTemas() {
  el.listaTemas.innerHTML = '';
  for (const [clave, tema] of Object.entries(TEMAS)) {
    const cantidad = PREGUNTAS.filter((p) => p.tema === clave).length;
    if (cantidad === 0) continue;
    const tarjeta = document.createElement('label');
    tarjeta.className = 'tema';
    tarjeta.title = tema.descripcion;
    tarjeta.style.setProperty('--tema', `var(--c-${clave})`);
    tarjeta.innerHTML = `
      <input class="sr-only" type="checkbox" name="temas" value="${clave}" checked>
      <span class="tema-caja">
        <span class="tema-icono">${icono(tema.icono)}</span>
        <span class="tema-nombre">${tema.nombre}</span>
        <span class="tema-info">${cantidad} preguntas</span>
        <span class="tema-check">${icono('check')}</span>
      </span>`;
    el.listaTemas.appendChild(tarjeta);
  }
}

function temasElegidos() {
  return [...el.listaTemas.querySelectorAll('input:checked')].map((casilla) => casilla.value);
}

// Si no hay ningún tema marcado, se avisa y se desactiva el botón
function revisarTemas() {
  const hayTemas = temasElegidos().length > 0;
  el.avisoTemas.hidden = hayTemas;
  el.btnComenzar.disabled = !hayTemas;
  return hayTemas;
}

/* ---------- 7. PREPARAR LA PARTIDA ---------- */

// Toma preguntas de los temas elegidos turnándose entre ellos, para que la ronda quede balanceada
function elegirPreguntas(temas, cantidad) {
  const grupos = mezclar(temas).map((tema) => mezclar(PREGUNTAS.filter((p) => p.tema === tema)));
  const elegidas = [];
  let vuelta = 0;
  while (elegidas.length < cantidad && grupos.some((grupo) => vuelta < grupo.length)) {
    for (const grupo of grupos) {
      if (vuelta < grupo.length && elegidas.length < cantidad) elegidas.push(grupo[vuelta]);
    }
    vuelta++;
  }
  return mezclar(elegidas);
}

// Mezcla las opciones de una pregunta y recalcula en qué posición quedó la correcta
function prepararPregunta(original) {
  if (original.vf) return { ...original }; // verdadero/falso conserva su orden
  const orden = mezclar(original.opciones.map((_, i) => i)); // por ejemplo [2, 0, 3, 1]
  return {
    ...original,
    opciones: orden.map((i) => original.opciones[i]),
    correcta: orden.indexOf(original.correcta),
  };
}

function iniciarPartida() {
  if (!revisarTemas()) return;
  sonido.activar(); // los navegadores solo permiten sonido después de un clic

  estado.jugador = el.nombre.value.trim() || 'Jugador';
  guardar(CLAVES.nombre, el.nombre.value.trim());
  estado.temas = temasElegidos();
  estado.conTiempo = el.conTiempo.checked;
  const cantidad = Number(el.form.elements.cantidad.value);

  estado.preguntas = elegirPreguntas(estado.temas, cantidad).map(prepararPregunta);
  estado.indice = 0;
  estado.puntaje = 0;
  estado.racha = 0;
  estado.mejorRacha = 0;
  estado.respuestas = [];
  estado.comodines = { cincuenta: true, tiempo: true };

  el.puntaje.textContent = '0';
  el.racha.hidden = true;
  mostrarPantalla('pantalla-juego');
  mostrarPregunta();
}

/* ---------- 8. MOSTRAR PREGUNTA Y RELOJ ---------- */
function mostrarPregunta() {
  const pregunta = estado.preguntas[estado.indice];
  const tema = TEMAS[pregunta.tema];
  estado.respondida = false;

  // Encabezado: número de pregunta y tema
  el.contador.textContent = `${dosDigitos(estado.indice + 1)} / ${dosDigitos(estado.preguntas.length)}`;
  el.chipTema.innerHTML = `${icono(tema.icono)}<span>${tema.nombre}</span>`;
  el.chipTema.style.setProperty('--tema', `var(--c-${pregunta.tema})`);
  el.textoPregunta.textContent = pregunta.pregunta;

  // Opciones: un botón por cada una (si son largas, van en una sola columna)
  const hayLargas = pregunta.opciones.some((texto) => texto.length > 40);
  el.opciones.className = 'opciones' + (pregunta.vf ? ' es-vf' : '') + (hayLargas ? ' una-columna' : '');
  el.opciones.innerHTML = '';
  pregunta.opciones.forEach((texto, i) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'opcion';
    const letra = pregunta.vf ? texto[0] : LETRAS[i]; // "V" o "F" en verdadero/falso
    boton.innerHTML = `<span class="opcion-letra">${letra}</span><span class="opcion-texto"></span><span class="opcion-marca"></span>`;
    boton.querySelector('.opcion-texto').textContent = texto;
    boton.addEventListener('click', () => responder(i));
    el.opciones.appendChild(boton);
  });

  // Comodines visibles; retroalimentación escondida hasta que responda
  el.comodines.hidden = false;
  el.btn5050.disabled = !estado.comodines.cincuenta || Boolean(pregunta.vf); // el 50/50 no aplica en V/F
  el.btnTiempo.disabled = !estado.comodines.tiempo || !estado.conTiempo;
  el.retro.hidden = true;

  pintarProgreso();
  reiniciarAnimacion(el.tarjeta, 'entrando');

  // Reloj
  el.reloj.hidden = !estado.conTiempo;
  if (estado.conTiempo) iniciarTemporizador();
  estado.inicioPregunta = performance.now();

  el.textoPregunta.focus({ preventScroll: true });
}

// Barra de progreso: un segmento por pregunta (verde = acierto, rojo = error)
function pintarProgreso() {
  el.progreso.innerHTML = '';
  estado.preguntas.forEach((_, i) => {
    const segmento = document.createElement('span');
    const respuesta = estado.respuestas[i];
    if (respuesta) segmento.className = respuesta.acierto ? 'bien' : 'mal';
    else if (i === estado.indice) segmento.className = 'actual';
    el.progreso.appendChild(segmento);
  });
}

function iniciarTemporizador() {
  detenerTemporizador();
  el.reloj.classList.remove('detenido');
  estado.duracion = CONFIG.segundosPorPregunta;
  estado.finTiempo = performance.now() + estado.duracion * 1000;
  estado.ultimoTic = null;
  actualizarReloj();
  estado.intervalo = setInterval(actualizarReloj, 100); // revisa el reloj 10 veces por segundo
}

function detenerTemporizador() {
  clearInterval(estado.intervalo);
  estado.intervalo = null;
}

function segundosRestantes() {
  return Math.max(0, (estado.finTiempo - performance.now()) / 1000);
}

function actualizarReloj() {
  const restante = segundosRestantes();
  const entero = Math.ceil(restante);
  el.relojNum.textContent = entero;

  // El arco del círculo se va vaciando a medida que pasa el tiempo
  const fraccion = Math.min(1, restante / estado.duracion);
  el.relojArco.style.strokeDashoffset = CIRCUNFERENCIA_RELOJ * (1 - fraccion);
  el.reloj.classList.toggle('alerta', restante <= 5);

  // Un "tic" en cada uno de los últimos 3 segundos
  if (restante > 0 && entero <= 3 && entero !== estado.ultimoTic) {
    estado.ultimoTic = entero;
    sonido.tic();
  }
  if (restante <= 0) responder(-1); // -1 significa: se acabó el tiempo sin responder
}

/* ---------- 9. RESPONDER Y CALCULAR PUNTOS ---------- */

// Puntos de una respuesta correcta = base + rapidez + racha
function calcularPuntos(segundosQueQuedaban, racha) {
  const base = CONFIG.puntosPorAcierto;
  const rapidez = estado.conTiempo
    ? Math.round(CONFIG.bonoRapidezMaximo * Math.min(1, segundosQueQuedaban / CONFIG.segundosPorPregunta))
    : 0;
  const bonoRacha = Math.min((racha - 1) * CONFIG.bonoRachaPorAcierto, CONFIG.bonoRachaMaximo);
  return { base, rapidez, racha: bonoRacha, total: base + rapidez + bonoRacha };
}

function responder(elegida) {
  if (estado.respondida) return;
  const boton = el.opciones.children[elegida];
  if (elegida >= 0 && (!boton || boton.disabled)) return; // opción quitada por el 50/50

  estado.respondida = true;
  detenerTemporizador();
  el.reloj.classList.add('detenido');

  const pregunta = estado.preguntas[estado.indice];
  const acierto = elegida === pregunta.correcta;
  const restante = estado.conTiempo ? segundosRestantes() : 0;
  const tiempoUsado = (performance.now() - estado.inicioPregunta) / 1000;

  let puntos = { base: 0, rapidez: 0, racha: 0, total: 0 };
  if (acierto) {
    estado.racha++;
    estado.mejorRacha = Math.max(estado.mejorRacha, estado.racha);
    puntos = calcularPuntos(restante, estado.racha);
    estado.puntaje += puntos.total;
    sonido.acierto();
  } else {
    estado.racha = 0;
    sonido.error();
  }
  reaccionarMascota(acierto);

  estado.respuestas.push({ pregunta, elegida, acierto, puntos: puntos.total, tiempo: tiempoUsado });

  marcarOpciones(elegida, pregunta.correcta);
  actualizarMarcador(puntos.total);
  mostrarRetroalimentacion(pregunta, elegida, acierto, puntos);
  pintarProgreso();
}

// Pinta de verde la correcta, de rojo la elegida (si falló) y apaga las demás
function marcarOpciones(elegida, correcta) {
  [...el.opciones.children].forEach((boton, i) => {
    boton.disabled = true;
    const marca = boton.querySelector('.opcion-marca');
    if (i === correcta) {
      boton.classList.add('es-correcta');
      if (i === elegida) boton.classList.add('elegida');
      marca.innerHTML = icono('check');
    } else if (i === elegida) {
      boton.classList.add('es-incorrecta');
      marca.innerHTML = icono('x');
    } else {
      boton.classList.add('apagada');
    }
  });
}

function actualizarMarcador(puntosGanados) {
  const anterior = Number(el.puntaje.textContent) || 0;
  animarNumero(el.puntaje, anterior, estado.puntaje, 600);

  el.racha.hidden = estado.racha < 2;
  if (estado.racha >= 2) {
    el.rachaNum.textContent = estado.racha;
    reiniciarAnimacion(el.racha, 'sube');
  }
  if (puntosGanados > 0) {
    el.flotante.textContent = `+${puntosGanados}`;
    reiniciarAnimacion(el.flotante, 'vuela');
  }
}

function mostrarRetroalimentacion(pregunta, elegida, acierto, puntos) {
  el.comodines.hidden = true;
  el.retro.hidden = false;
  el.retro.className = 'retro ' + (acierto ? 'bien' : 'mal');

  if (acierto) {
    const frase = FRASES_ACIERTO[Math.floor(Math.random() * FRASES_ACIERTO.length)];
    el.retroEstado.textContent = estado.racha >= 3 ? `${frase} Racha de ${estado.racha}` : frase;
    el.retroPuntos.textContent = `+${puntos.total} pts`;
    const partes = [`${puntos.base} por acertar`];
    if (puntos.rapidez > 0) partes.push(`${puntos.rapidez} por rapidez`);
    if (puntos.racha > 0) partes.push(`${puntos.racha} por racha`);
    el.retroDesglose.textContent = partes.join(' · ');
  } else {
    el.retroEstado.textContent = elegida === -1 ? '¡Se acabó el tiempo!' : 'Incorrecto';
    el.retroPuntos.textContent = '+0 pts';
    el.retroDesglose.textContent = 'La racha vuelve a cero.';
  }

  el.retroCorrecta.hidden = acierto;
  el.retroCorrecta.textContent = `Respuesta correcta: ${pregunta.opciones[pregunta.correcta]}`;
  el.retroTexto.textContent = pregunta.explicacion;

  const esUltima = estado.indice === estado.preguntas.length - 1;
  el.btnSiguiente.innerHTML = (esUltima ? 'Ver resultados ' : 'Siguiente ') + icono('flecha');
  el.anuncio.textContent = `${el.retroEstado.textContent}. ${pregunta.explicacion}`;

  el.btnSiguiente.focus({ preventScroll: true });
  el.retro.scrollIntoView({ behavior: reducirMovimiento() ? 'auto' : 'smooth', block: 'nearest' });
}

function siguientePregunta() {
  if (!estado.respondida) return;
  if (estado.indice < estado.preguntas.length - 1) {
    estado.indice++;
    window.scrollTo({ top: 0 });
    mostrarPregunta();
  } else {
    mostrarResultados();
  }
}

/* ---------- 10. COMODINES ---------- */

// 50/50: quita dos respuestas incorrectas (una vez por partida)
function usarCincuenta() {
  const pregunta = estado.preguntas[estado.indice];
  if (!estado.comodines.cincuenta || estado.respondida || pregunta.vf) return;
  estado.comodines.cincuenta = false;
  el.btn5050.disabled = true;

  const incorrectas = pregunta.opciones.map((_, i) => i).filter((i) => i !== pregunta.correcta);
  mezclar(incorrectas).slice(0, 2).forEach((i) => {
    const boton = el.opciones.children[i];
    boton.disabled = true;
    boton.classList.add('descartada');
  });
  sonido.comodin();
}

// +10 s: suma tiempo al reloj (una vez por partida)
function usarTiempoExtra() {
  if (!estado.comodines.tiempo || estado.respondida || !estado.conTiempo) return;
  estado.comodines.tiempo = false;
  el.btnTiempo.disabled = true;
  estado.finTiempo += CONFIG.segundosExtra * 1000;
  estado.duracion = segundosRestantes(); // el círculo se vuelve a llenar
  estado.ultimoTic = null;
  actualizarReloj();
  sonido.comodin();
}

/* ---------- 11. RESULTADOS Y NOTA ---------- */

// Nota de 0.0 a 5.0 con un decimal: (aciertos ÷ total) × 5
function calcularNota(aciertos, total) {
  if (total === 0) return 0;
  return Math.round((aciertos / total) * 50) / 10;
}

function veredicto(nota) {
  if (nota === 5) return { sello: 'Perfecto', nivel: 'alta', mensaje: '¡Nota perfecta! Dominas los temas TIC.' };
  if (nota >= 4.5) return { sello: 'Excelente', nivel: 'alta', mensaje: 'Muy pocos errores. ¡Qué buen nivel!' };
  if (nota >= 4.0) return { sello: 'Muy bien', nivel: 'alta', mensaje: 'Tienes claros los temas. Repasa las preguntas que fallaste.' };
  if (nota >= 3.0) return { sello: 'Aprobado', nivel: 'media', mensaje: 'Pasaste. Lee las explicaciones para subir la nota.' };
  return { sello: 'A repasar', nivel: 'baja', mensaje: 'Revisa tus respuestas y vuelve a intentarlo.' };
}

function mostrarResultados() {
  detenerTemporizador();
  const total = estado.respuestas.length;
  const aciertos = estado.respuestas.filter((r) => r.acierto).length;
  const nota = calcularNota(aciertos, total);
  const resultado = veredicto(nota);
  const tiempoPromedio = estado.respuestas.reduce((suma, r) => suma + r.tiempo, 0) / total;

  const puesto = guardarEnRanking({
    id: Date.now(),
    nombre: estado.jugador,
    puntaje: estado.puntaje,
    nota,
    aciertos,
    total,
    fecha: new Date().toISOString(),
  });

  el.resTitulo.textContent = `Resultados de ${estado.jugador}`;
  el.resNotaCaja.dataset.nivel = resultado.nivel;
  el.resSello.textContent = resultado.sello;
  el.resMensaje.textContent = resultado.mensaje;
  el.resRecord.hidden = !(puesto === 1 && leerRanking().length > 1);
  el.resAciertos.textContent = `${aciertos}/${total}`;
  el.resRacha.textContent = estado.mejorRacha;
  el.resTiempo.textContent = `${tiempoPromedio.toFixed(1)} s`;

  pintarPorTema();
  pintarRevision();
  mostrarPantalla('pantalla-resultados');

  animarNumero(el.resNota, 0, nota, 900, 1);
  animarNumero(el.resPuntaje, 0, estado.puntaje, 1100);
  sonido.final();
  if (nota >= 4) setTimeout(lanzarConfeti, 300);
}

// Barras con el porcentaje de aciertos de cada tema
function pintarPorTema() {
  el.resTemas.innerHTML = '';
  for (const clave of estado.temas) {
    const delTema = estado.respuestas.filter((r) => r.pregunta.tema === clave);
    if (delTema.length === 0) continue;
    const bien = delTema.filter((r) => r.acierto).length;
    const porcentaje = Math.round((bien / delTema.length) * 100);

    const fila = document.createElement('li');
    fila.style.setProperty('--tema', `var(--c-${clave})`);
    fila.innerHTML = `
      <div class="pt-cabecera">
        <span class="pt-nombre">${icono(TEMAS[clave].icono)} ${TEMAS[clave].nombre}</span>
        <span class="pt-valor">${bien}/${delTema.length}</span>
      </div>
      <div class="pt-barra" role="img" aria-label="${porcentaje}% de aciertos"><span></span></div>`;
    el.resTemas.appendChild(fila);

    // La barra crece hasta su porcentaje (la animación la hace el CSS)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fila.querySelector('.pt-barra span').style.width = `${porcentaje}%`;
    }));
  }
}

// Lista de todas las preguntas con la respuesta del jugador y la explicación
function pintarRevision() {
  el.resRevision.innerHTML = '';
  estado.respuestas.forEach((respuesta, numero) => {
    const { pregunta, elegida, acierto } = respuesta;
    const item = document.createElement('li');
    item.className = acierto ? 'bien' : 'mal';
    item.innerHTML = `
      <span class="rv-icono">${icono(acierto ? 'check' : 'x')}</span>
      <div class="rv-cuerpo">
        <p class="rv-pregunta"></p>
        <p class="rv-linea">Tu respuesta: <b class="rv-tuya"></b></p>
        ${acierto ? '' : '<p class="rv-linea">Correcta: <b class="rv-correcta"></b></p>'}
        <p class="rv-explicacion"></p>
      </div>`;
    item.querySelector('.rv-pregunta').textContent = `${numero + 1}. ${pregunta.pregunta}`;
    item.querySelector('.rv-tuya').textContent =
      elegida === -1 ? 'sin responder (se acabó el tiempo)' : pregunta.opciones[elegida];
    if (!acierto) item.querySelector('.rv-correcta').textContent = pregunta.opciones[pregunta.correcta];
    item.querySelector('.rv-explicacion').textContent = pregunta.explicacion;
    el.resRevision.appendChild(item);
  });
}

/* ---------- 12. RANKING ---------- */
function leerRanking() {
  const lista = leerGuardado(CLAVES.ranking, []);
  return Array.isArray(lista) ? lista : [];
}

// Agrega un resultado, ordena de mayor a menor puntaje y deja solo los mejores
function guardarEnRanking(registro) {
  const lista = [...leerRanking(), registro]
    .sort((a, b) => b.puntaje - a.puntaje || b.nota - a.nota || a.id - b.id)
    .slice(0, CONFIG.puestosRanking);
  guardar(CLAVES.ranking, lista);
  estado.ultimoRegistro = registro.id;
  return lista.findIndex((r) => r.id === registro.id) + 1; // 0 si no quedó entre los mejores
}

function pintarRanking() {
  const lista = leerRanking();
  el.rankingVacio.hidden = lista.length > 0;
  el.rankingTabla.hidden = lista.length === 0;
  el.rankingCuerpo.innerHTML = '';
  lista.forEach((registro, i) => {
    const fila = document.createElement('tr');
    if (registro.id === estado.ultimoRegistro) fila.className = 'reciente';
    const fecha = new Date(registro.fecha).toLocaleDateString('es', { day: 'numeric', month: 'short' });
    fila.innerHTML = `
      <td class="pos">${i + 1}</td>
      <td class="nom"></td>
      <td class="num">${Number(registro.puntaje) || 0}</td>
      <td class="num">${(Number(registro.nota) || 0).toFixed(1)}</td>
      <td class="fecha">${fecha}</td>`;
    fila.querySelector('.nom').textContent = registro.nombre;
    el.rankingCuerpo.appendChild(fila);
  });
}

function abrirRanking() {
  pintarRanking();
  cancelarBorrado();
  if (typeof el.dialogo.showModal === 'function') el.dialogo.showModal();
  else el.dialogo.setAttribute('open', '');
}

function cerrarRanking() {
  if (typeof el.dialogo.close === 'function') el.dialogo.close();
  else el.dialogo.removeAttribute('open');
}

// Para borrar se pide confirmación dentro de la misma ventana
function pedirConfirmacionBorrado() {
  el.btnBorrar.hidden = true;
  el.confirmarBorrado.hidden = false;
  el.btnBorrarNo.focus();
}

function cancelarBorrado() {
  el.confirmarBorrado.hidden = true;
  el.btnBorrar.hidden = leerRanking().length === 0;
}

function borrarRanking() {
  guardar(CLAVES.ranking, []);
  estado.ultimoRegistro = null;
  pintarRanking();
  cancelarBorrado();
}

/* ---------- 13. SONIDOS (Web Audio API) ---------- */
// No hay archivos de audio: cada sonido se genera con código usando osciladores
const sonido = {
  activo: true,
  contexto: null,

  activar() {
    if (!this.contexto) {
      const Contexto = window.AudioContext || window.webkitAudioContext;
      if (!Contexto) return;
      this.contexto = new Contexto();
    }
    if (this.contexto.state === 'suspended') this.contexto.resume();
  },

  // Toca una nota: frecuencia en Hz, cuándo empieza y cuánto dura (en segundos)
  nota(frecuencia, retraso = 0, duracion = 0.15, forma = 'sine', volumen = 0.08) {
    if (!this.activo || !this.contexto) return;
    const inicio = this.contexto.currentTime + retraso;
    const oscilador = this.contexto.createOscillator();
    const control = this.contexto.createGain();
    oscilador.type = forma;
    oscilador.frequency.value = frecuencia;
    control.gain.setValueAtTime(0.0001, inicio);
    control.gain.exponentialRampToValueAtTime(volumen, inicio + 0.015);
    control.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);
    oscilador.connect(control).connect(this.contexto.destination);
    oscilador.start(inicio);
    oscilador.stop(inicio + duracion + 0.05);
  },

  acierto() { this.nota(660, 0, 0.14); this.nota(990, 0.09, 0.24); },
  error() { this.nota(220, 0, 0.2, 'triangle', 0.12); this.nota(165, 0.12, 0.3, 'triangle', 0.1); },
  tic() { this.nota(1400, 0, 0.05, 'square', 0.025); },
  comodin() { this.nota(520, 0, 0.1, 'sine', 0.07); this.nota(780, 0.07, 0.14, 'sine', 0.06); },
  final() { [523, 659, 784, 1047].forEach((f, i) => this.nota(f, i * 0.11, 0.32, 'sine', 0.07)); },
};

function alternarSonido() {
  sonido.activo = !sonido.activo;
  guardar(CLAVES.sonido, sonido.activo);
  if (sonido.activo) {
    sonido.activar();
    sonido.comodin();
  }
  pintarBotonSonido();
}

function pintarBotonSonido() {
  el.btnSonido.setAttribute('aria-pressed', String(sonido.activo));
  el.btnSonido.title = sonido.activo ? 'Silenciar' : 'Activar sonido';
  el.btnSonido.querySelector('use').setAttribute('href', sonido.activo ? '#i-sonido' : '#i-silencio');
}

/* ---------- 14. TEMA CLARO / OSCURO ---------- */
function temaActual() {
  const elegido = document.documentElement.dataset.theme;
  if (elegido === 'light' || elegido === 'dark') return elegido;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function alternarTema() {
  const nuevo = temaActual() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nuevo;
  guardar(CLAVES.tema, nuevo);
}

function pintarBotonTema() {
  const oscuro = temaActual() === 'dark';
  el.btnTema.querySelector('use').setAttribute('href', oscuro ? '#i-sol' : '#i-luna');
  el.btnTema.title = oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
}

/* ---------- 15. EFECTOS: FONDO, CONFETI Y MASCOTA ---------- */

// Pequeñas "señales" que viajan por la cuadrícula, como en una placa de circuito
const fondo = {
  ctx: null,
  pulsos: [],
  color: '#2F62F0',
  ancho: 0,
  alto: 0,
  ultimo: 0,
  PASO: 48,      // tamaño de la cuadrícula (el mismo de style.css)
  VELOCIDAD: 70, // píxeles por segundo

  iniciar() {
    if (reducirMovimiento()) return;
    this.ctx = el.lienzoFondo.getContext('2d');
    if (!this.ctx) return;
    this.ajustar();
    this.actualizarColor();
    window.addEventListener('resize', () => this.ajustar());
    requestAnimationFrame((t) => this.dibujar(t));
  },

  ajustar() {
    const escala = Math.min(window.devicePixelRatio || 1, 2);
    this.ancho = window.innerWidth;
    this.alto = window.innerHeight;
    el.lienzoFondo.width = this.ancho * escala;
    el.lienzoFondo.height = this.alto * escala;
    this.ctx.setTransform(escala, 0, 0, escala, 0, 0);
    const cantidad = Math.max(4, Math.min(10, Math.round((this.ancho * this.alto) / 150000)));
    this.pulsos = Array.from({ length: cantidad }, () => this.nuevoPulso(true));
  },

  actualizarColor() {
    this.color = leerColor('--pulso') || this.color;
  },

  nuevoPulso(conEspera = false) {
    const horizontal = Math.random() < 0.5;
    const sentido = Math.random() < 0.5 ? 1 : -1;
    const x = Math.round((Math.random() * this.ancho) / this.PASO) * this.PASO;
    const y = Math.round((Math.random() * this.alto) / this.PASO) * this.PASO;
    return {
      cruceX: x,               // último cruce de la cuadrícula por el que pasó
      cruceY: y,
      x,
      y,
      dx: horizontal ? sentido : 0,
      dy: horizontal ? 0 : sentido,
      recorrido: 0,            // distancia desde el último cruce
      vida: conEspera ? -Math.random() * 4 : 0, // negativo = espera antes de aparecer
      duracion: 3 + Math.random() * 5,
      rastro: [],
    };
  },

  dibujar(ahora) {
    const dt = Math.min(0.05, (ahora - (this.ultimo || ahora)) / 1000);
    this.ultimo = ahora;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.ancho, this.alto);
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    this.pulsos.forEach((p, n) => {
      p.vida += dt;
      if (p.vida < 0) return;
      if (p.vida > p.duracion) {
        this.pulsos[n] = this.nuevoPulso();
        return;
      }

      // Avanza por la línea; al llegar a un cruce, a veces gira 90°
      p.recorrido += this.VELOCIDAD * dt;
      while (p.recorrido >= this.PASO) {
        p.recorrido -= this.PASO;
        p.cruceX += p.dx * this.PASO;
        p.cruceY += p.dy * this.PASO;
        if (Math.random() < 0.35) {
          const giro = Math.random() < 0.5 ? 1 : -1;
          [p.dx, p.dy] = [-p.dy * giro, p.dx * giro];
        }
      }
      p.x = p.cruceX + p.dx * p.recorrido;
      p.y = p.cruceY + p.dy * p.recorrido;
      p.rastro.push({ x: p.x, y: p.y });
      if (p.rastro.length > 26) p.rastro.shift();

      // Aparece y desaparece suavemente
      const brillo = Math.max(0, Math.min(1, p.vida / 0.6, (p.duracion - p.vida) / 0.8));
      for (let i = 1; i < p.rastro.length; i++) {
        ctx.globalAlpha = brillo * (i / p.rastro.length) * 0.55;
        ctx.beginPath();
        ctx.moveTo(p.rastro[i - 1].x, p.rastro[i - 1].y);
        ctx.lineTo(p.rastro[i].x, p.rastro[i].y);
        ctx.stroke();
      }
      ctx.globalAlpha = brillo * 0.9;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = brillo * 0.15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame((t) => this.dibujar(t));
  },
};

// Lluvia de confeti que sale desde la nota (solo con nota de 4.0 o más)
function lanzarConfeti() {
  if (reducirMovimiento()) return;
  const lienzo = el.lienzoConfeti;
  const ctx = lienzo.getContext('2d');
  if (!ctx) return;
  const escala = Math.min(window.devicePixelRatio || 1, 2);
  const ancho = window.innerWidth;
  const alto = window.innerHeight;
  lienzo.width = ancho * escala;
  lienzo.height = alto * escala;
  ctx.setTransform(escala, 0, 0, escala, 0, 0);
  lienzo.hidden = false;

  const caja = el.resNota.getBoundingClientRect();
  const origenX = caja.left + caja.width / 2;
  const origenY = caja.top + caja.height / 2;
  const colores = ['--acento', '--resalte', '--bien', '--c-robotica', '--c-ia'].map(leerColor);

  const piezas = Array.from({ length: 150 }, () => {
    const angulo = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
    const fuerza = 6 + Math.random() * 9;
    return {
      x: origenX,
      y: origenY,
      vx: Math.cos(angulo) * fuerza,
      vy: Math.sin(angulo) * fuerza,
      giro: Math.random() * Math.PI,
      velocidadGiro: (Math.random() - 0.5) * 0.35,
      tamano: 5 + Math.random() * 6,
      color: colores[Math.floor(Math.random() * colores.length)],
    };
  });

  const inicio = performance.now();
  function cuadro(ahora) {
    const t = (ahora - inicio) / 1000;
    ctx.clearRect(0, 0, ancho, alto);
    for (const c of piezas) {
      c.vy += 0.28;   // gravedad
      c.vx *= 0.985;  // resistencia del aire
      c.x += c.vx;
      c.y += c.vy;
      c.giro += c.velocidadGiro;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.giro);
      ctx.globalAlpha = Math.max(0, 1 - t / 2.8);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.tamano / 2, -c.tamano / 4, c.tamano, c.tamano / 2);
      ctx.restore();
    }
    if (t < 2.8) {
      requestAnimationFrame(cuadro);
    } else {
      ctx.clearRect(0, 0, ancho, alto);
      lienzo.hidden = true;
    }
  }
  requestAnimationFrame(cuadro);
}

// La mascota salta si aciertas y niega con la cabeza si fallas
let esperaMascota = null;
function reaccionarMascota(acierto) {
  el.mascota.classList.remove('feliz', 'triste');
  void el.mascota.getBoundingClientRect();
  el.mascota.classList.add(acierto ? 'feliz' : 'triste');
  clearTimeout(esperaMascota);
  esperaMascota = setTimeout(() => el.mascota.classList.remove('feliz', 'triste'), 1400);
}

/* ---------- 16. TECLADO Y ARRANQUE ---------- */

// Atajos: 1-4 o A-D para responder (V/F en verdadero o falso) y Enter para seguir
document.addEventListener('keydown', (evento) => {
  if (estado.pantalla !== 'pantalla-juego' || el.dialogo.open) return;
  if (evento.ctrlKey || evento.metaKey || evento.altKey) return;
  const tecla = evento.key.toLowerCase();

  if (!estado.respondida) {
    const pregunta = estado.preguntas[estado.indice];
    let indice = -1;
    if (['1', '2', '3', '4'].includes(tecla)) indice = Number(tecla) - 1;
    else if (!pregunta.vf && ['a', 'b', 'c', 'd'].includes(tecla)) indice = tecla.charCodeAt(0) - 97;
    else if (pregunta.vf && tecla === 'v') indice = 0;
    else if (pregunta.vf && tecla === 'f') indice = 1;
    if (indice >= 0 && indice < pregunta.opciones.length) {
      evento.preventDefault();
      responder(indice);
    }
  } else if (tecla === 'enter' && document.activeElement !== el.btnSiguiente) {
    evento.preventDefault();
    siguientePregunta();
  }
});

// Revisa que cada pregunta de preguntas.js esté bien escrita (avisa en la consola)
function validarBanco() {
  PREGUNTAS.forEach((p, i) => {
    const problemas = [];
    if (!TEMAS[p.tema]) problemas.push(`el tema "${p.tema}" no existe en TEMAS`);
    if (!Array.isArray(p.opciones) || p.opciones.length < 2) problemas.push('necesita al menos 2 opciones');
    else if (!(p.correcta >= 0 && p.correcta < p.opciones.length)) problemas.push('"correcta" está fuera de rango');
    if (!p.explicacion) problemas.push('le falta la explicación');
    if (problemas.length > 0) console.warn(`Pregunta ${i + 1} ("${p.pregunta}"): ${problemas.join(', ')}`);
  });
}

function iniciarApp() {
  validarBanco();

  // Preferencias guardadas de la última vez
  sonido.activo = leerGuardado(CLAVES.sonido, true) !== false;
  el.nombre.value = leerGuardado(CLAVES.nombre, '') || '';
  pintarBotonSonido();
  pintarBotonTema();
  pintarTemas();
  revisarTemas();

  // Inicio
  el.listaTemas.addEventListener('change', revisarTemas);
  el.form.addEventListener('submit', (evento) => {
    evento.preventDefault(); // el formulario no se envía a ningún lado: solo inicia el juego
    iniciarPartida();
  });

  // Juego
  el.btn5050.addEventListener('click', usarCincuenta);
  el.btnTiempo.addEventListener('click', usarTiempoExtra);
  el.btnSiguiente.addEventListener('click', siguientePregunta);

  // Resultados
  el.btnOtraVez.addEventListener('click', iniciarPartida);
  el.btnCambiar.addEventListener('click', () => mostrarPantalla('pantalla-inicio'));
  el.btnVerRanking.addEventListener('click', abrirRanking);

  // Barra superior
  el.btnRanking.addEventListener('click', abrirRanking);
  el.btnSonido.addEventListener('click', alternarSonido);
  el.btnTema.addEventListener('click', alternarTema);

  // Ranking
  el.btnCerrarRanking.addEventListener('click', cerrarRanking);
  el.dialogo.addEventListener('click', (evento) => {
    if (evento.target === el.dialogo) cerrarRanking(); // clic por fuera de la ventana
  });
  el.btnBorrar.addEventListener('click', pedirConfirmacionBorrado);
  el.btnBorrarNo.addEventListener('click', cancelarBorrado);
  el.btnBorrarSi.addEventListener('click', borrarRanking);

  // Si cambia el tema (con el botón o desde el sistema), se actualizan el ícono y el fondo
  const alCambiarTema = () => {
    pintarBotonTema();
    fondo.actualizarColor();
  };
  new MutationObserver(alCambiarTema).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', alCambiarTema);

  fondo.iniciar();
}

iniciarApp();
