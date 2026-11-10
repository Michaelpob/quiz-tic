# Quiz TIC

Juego interactivo de preguntas sobre los temas del semestre: **robótica, ciberseguridad, inteligencia artificial y mundo TIC**. Tiene temporizador, puntaje con bonos, comodines, retroalimentación en cada respuesta, nota final de 0.0 a 5.0 y ranking.

## Cómo se juega

1. Escribe tu nombre, elige los temas y cuántas preguntas quieres (5, 10 o 15).
2. Responde con el mouse, tocando la pantalla o con el teclado (`1`–`4`, `A`–`D`, o `V` / `F`).
3. Después de cada respuesta aparece la explicación (retroalimentación).
4. Al final ves tu nota, los aciertos por tema y puedes revisar todas tus respuestas.

## Puntaje

| Situación | Puntos |
|---|---|
| Respuesta correcta | 100 |
| Rapidez | hasta +50, según el tiempo que quedaba |
| Racha (aciertos seguidos) | +10 por cada acierto seguido, máximo +50 |
| Respuesta incorrecta o sin tiempo | 0, y la racha vuelve a cero |

**Nota** = aciertos ÷ total × 5, con un decimal. Desde 3.0 se aprueba.

**Comodines** (uno de cada uno por partida): **50/50** quita dos respuestas incorrectas y **+10 s** le suma tiempo al reloj.

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | La estructura: barra superior, las 3 pantallas (inicio, juego y resultados) y la ventana del ranking. |
| `style.css` | El diseño: colores, letras, tema claro y oscuro, animaciones y versión para celular. |
| `preguntas.js` | El banco de 68 preguntas: tema, opciones, respuesta correcta y explicación. |
| `script.js` | La lógica: elegir y mezclar preguntas, reloj, puntaje, comodines, resultados, ranking, sonidos y efectos. |

## Cómo agregar una pregunta

Abre `preguntas.js`, copia un bloque y cámbialo:

```js
{
  tema: 'robotica',
  pregunta: '¿Qué parte del robot capta la luz o la distancia?',
  opciones: ['Los sensores', 'Los actuadores', 'La batería', 'La carcasa'],
  correcta: 0, // posición de la correcta, empezando en 0
  explicacion: 'Los sensores captan datos del entorno.',
},
```

No importa en qué posición quede la correcta: el juego mezcla las opciones cada vez.

## Tecnologías

- HTML5, CSS3 (variables, grid, flexbox y animaciones) y JavaScript puro, sin librerías.
- **Web Audio API** para los sonidos: se generan con código, no hay archivos de audio.
- **Canvas** para el fondo animado y el confeti.
- **localStorage** para guardar el ranking, el tema y el sonido en el navegador.
