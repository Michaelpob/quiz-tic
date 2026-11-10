/* ==========================================================
   QUIZ TIC · preguntas.js
   Banco de preguntas del juego.

   Para agregar una pregunta copia un bloque { ... } y cambia
   el texto. Cada pregunta tiene:
     tema         → robotica | ciberseguridad | ia | tic
     pregunta     → el enunciado
     opciones     → 4 respuestas (o 2 si es verdadero/falso)
     correcta     → posición de la respuesta correcta.
                    OJO: se cuenta desde 0 (0 = la primera)
     explicacion  → la retroalimentación que ve el jugador
     vf: true     → (opcional) pregunta de verdadero o falso

   No importa en qué posición quede la correcta: el juego
   mezcla las opciones cada vez que se muestra la pregunta.
   ========================================================== */

const TEMAS = {
  robotica: {
    nombre: 'Robótica',
    descripcion: 'Partes, tipos, prototipos y procesos',
    icono: 'robot',
  },
  ciberseguridad: {
    nombre: 'Ciberseguridad',
    descripcion: 'Ataques comunes y cómo protegerte',
    icono: 'escudo',
  },
  ia: {
    nombre: 'Inteligencia artificial',
    descripcion: 'IA, prompts y Replit',
    icono: 'chispa',
  },
  tic: {
    nombre: 'Mundo TIC',
    descripcion: 'Internet, hardware y la web',
    icono: 'mundo',
  },
};

const PREGUNTAS = [
  /* --------------------------------------------------------
     ROBÓTICA (basadas en la presentación "Proyecto Robótica")
     -------------------------------------------------------- */
  {
    tema: 'robotica',
    pregunta: '¿Qué es la robótica?',
    opciones: [
      'La disciplina que diseña, construye, opera y aplica robots',
      'La ciencia que estudia solo la programación de computadores',
      'La rama de la electrónica que fabrica celulares y tablets',
      'El estudio de cómo funcionan las redes de internet',
    ],
    correcta: 0,
    explicacion: 'La robótica diseña, construye, opera y aplica robots. Es interdisciplinaria: combina ingeniería mecánica, eléctrica y biomédica con ciencias de la computación.',
  },
  {
    tema: 'robotica',
    pregunta: '¿Qué parte de un robot funciona como su “cerebro”?',
    opciones: ['Los sensores', 'El sistema de control', 'Los actuadores', 'La fuente de alimentación'],
    correcta: 1,
    explicacion: 'El sistema de control procesa la información y toma decisiones. Los sensores captan datos y los actuadores ejecutan el movimiento.',
  },
  {
    tema: 'robotica',
    pregunta: 'Un robot necesita saber a qué distancia está de una pared. ¿Qué componente le da ese dato?',
    opciones: ['Un actuador', 'La batería', 'Un sensor', 'La carcasa'],
    correcta: 2,
    explicacion: 'Los sensores captan datos del entorno como luz, temperatura, distancia o contacto. Con ellos el robot “entiende” lo que lo rodea.',
  },
  {
    tema: 'robotica',
    pregunta: '¿Qué hacen los actuadores de un robot?',
    opciones: [
      'Convierten señales eléctricas en movimiento',
      'Guardan la energía que usa el robot',
      'Miden la luz y la temperatura del entorno',
      'Almacenan el programa que controla al robot',
    ],
    correcta: 0,
    explicacion: 'Los actuadores, como los motores o los sistemas neumáticos, convierten las señales eléctricas en movimientos mecánicos.',
  },
  {
    tema: 'robotica',
    pregunta: '¿Para qué sirve la fuente de alimentación de un robot?',
    opciones: [
      'Para darle la energía que lo mantiene encendido',
      'Para detectar los obstáculos del camino',
      'Para decidir qué acción tomar',
      'Para conectarlo a internet',
    ],
    correcta: 0,
    explicacion: 'La fuente de alimentación (una batería o la conexión eléctrica) entrega la energía que necesitan el controlador, los sensores y los motores.',
  },
  {
    tema: 'robotica',
    pregunta: 'Un robot que imita la forma y el movimiento de un perro es un robot…',
    opciones: ['Androide', 'Poliarticulado', 'Zoomórfico', 'Industrial'],
    correcta: 2,
    explicacion: 'Los robots zoomórficos imitan a los animales. Los androides, en cambio, imitan la forma del cuerpo humano.',
  },
  {
    tema: 'robotica',
    pregunta: 'Los brazos mecánicos de las fábricas, con varias articulaciones, son robots…',
    opciones: ['Móviles', 'Poliarticulados', 'Zoomórficos', 'Androides'],
    correcta: 1,
    explicacion: '“Poli” significa muchos: los poliarticulados tienen múltiples articulaciones, como los brazos industriales que sueldan o pintan carros.',
  },
  {
    tema: 'robotica',
    vf: true,
    pregunta: 'Un androide es un robot que imita la forma y el cuerpo humano.',
    opciones: ['Verdadero', 'Falso'],
    correcta: 0,
    explicacion: 'Verdadero. Los androides imitan la apariencia humana: suelen tener cabeza, tronco, brazos y piernas.',
  },
  {
    tema: 'robotica',
    pregunta: 'Un robot que se desplaza por el piso con ruedas u orugas se clasifica como…',
    opciones: ['Móvil', 'Poliarticulado', 'Androide', 'Zoomórfico'],
    correcta: 0,
    explicacion: 'Los robots móviles pueden desplazarse por su entorno usando ruedas u orugas (pistas), como los robots de limpieza o los exploradores.',
  },
  {
    tema: 'robotica',
    pregunta: 'Un robot esquiva-obstáculos detecta las paredes con un sensor…',
    opciones: ['De temperatura', 'Ultrasónico', 'De humedad', 'De color'],
    correcta: 1,
    explicacion: 'El sensor ultrasónico emite un sonido que no oímos y mide cuánto tarda en rebotar. Con ese dato, una placa como Arduino decide cambiar de dirección.',
  },
  {
    tema: 'robotica',
    pregunta: '¿Con qué sensores sigue su camino un robot seguidor de línea?',
    opciones: ['Sensores ópticos infrarrojos', 'Un GPS satelital', 'Un micrófono', 'Sensores de temperatura'],
    correcta: 0,
    explicacion: 'Los sensores infrarrojos detectan cuánta luz refleja el piso: la línea oscura refleja menos que el fondo claro, y así el robot la sigue.',
  },
  {
    tema: 'robotica',
    pregunta: 'En un robot controlado por Bluetooth, ¿qué recibe las órdenes que envía la app del celular?',
    opciones: ['El sensor ultrasónico', 'Un microcontrolador', 'La batería', 'Las ruedas directamente'],
    correcta: 1,
    explicacion: 'La app envía las órdenes por Bluetooth a un microcontrolador (como el de una placa Arduino), y este activa los motores.',
  },
  {
    tema: 'robotica',
    pregunta: '¿Qué componentes mueven las articulaciones de un brazo robótico pequeño para agarrar objetos?',
    opciones: ['Servomotores', 'Paneles solares', 'Sensores infrarrojos', 'Parlantes'],
    correcta: 0,
    explicacion: 'Un servomotor gira hasta un ángulo exacto. Por eso es ideal para las articulaciones de un brazo robótico.',
  },
  {
    tema: 'robotica',
    pregunta: '¿En qué orden trabaja un robot?',
    opciones: [
      'Percepción → Procesamiento → Acción',
      'Acción → Percepción → Procesamiento',
      'Procesamiento → Acción → Percepción',
      'Acción → Procesamiento → Percepción',
    ],
    correcta: 0,
    explicacion: 'Primero los sensores perciben el entorno, luego el controlador procesa y decide, y por último los actuadores ejecutan la acción.',
  },
  {
    tema: 'robotica',
    pregunta: '¿Qué significa RPA?',
    opciones: [
      'Automatización Robótica de Procesos',
      'Robot de Programación Avanzada',
      'Red de Protección Automática',
      'Registro de Piezas Articuladas',
    ],
    correcta: 0,
    explicacion: 'RPA (Robotic Process Automation) usa “robots” de software que automatizan tareas repetitivas en el computador, como llenar formularios o copiar datos.',
  },
  {
    tema: 'robotica',
    pregunta: 'En la etapa de planificación y diseño de un robot se define…',
    opciones: [
      'Su estructura, sus grados de libertad y su propósito',
      'Únicamente el color y la marca de la carcasa',
      'Los datos que captarán los sensores en tiempo real',
      'El nivel de carga que tendrá la batería',
    ],
    correcta: 0,
    explicacion: 'Antes de construir se decide para qué será el robot (industrial, médico o doméstico), cómo será su estructura y cuántos movimientos podrá hacer.',
  },
  {
    tema: 'robotica',
    pregunta: '¿Qué son los “grados de libertad” de un robot?',
    opciones: [
      'Los movimientos independientes que puede hacer',
      'El nivel de autonomía legal que tiene el robot',
      'La temperatura máxima que soporta sin dañarse',
      'La cantidad de sensores que tiene instalados',
    ],
    correcta: 0,
    explicacion: 'Cada articulación que se mueve por su cuenta suma un grado de libertad. Muchos brazos industriales tienen 6, parecido a un brazo humano.',
  },
  {
    tema: 'robotica',
    pregunta: '¿En qué área se usa el robot da Vinci?',
    opciones: ['Agricultura', 'Cirugía médica', 'Exploración espacial', 'Limpieza del hogar'],
    correcta: 1,
    explicacion: 'El sistema quirúrgico da Vinci ayuda a los cirujanos a operar con precisión milimétrica a través de incisiones pequeñas.',
  },
  {
    tema: 'robotica',
    pregunta: '¿Cómo se llaman los robots diseñados para trabajar al lado de las personas de forma segura?',
    opciones: ['Robots colaborativos (cobots)', 'Robots zoomórficos', 'Androides', 'Drones'],
    correcta: 0,
    explicacion: 'Los cobots comparten el espacio de trabajo con humanos. Detectan el contacto y se detienen para no lastimar a nadie.',
  },
  {
    tema: 'robotica',
    pregunta: 'En la robótica educativa con enfoque STEAM, ¿qué significa la “A”?',
    opciones: ['Automatización', 'Algoritmos', 'Artes', 'Arduino'],
    correcta: 2,
    explicacion: 'STEAM son las iniciales en inglés de Ciencia, Tecnología, Ingeniería, Artes y Matemáticas. Sumar las artes impulsa la creatividad.',
  },
  {
    tema: 'robotica',
    vf: true,
    pregunta: 'La robótica solo se usa en las fábricas.',
    opciones: ['Verdadero', 'Falso'],
    correcta: 1,
    explicacion: 'Falso. También se usa en medicina, agricultura de precisión, exploración espacial, hogares y educación.',
  },
  {
    tema: 'robotica',
    pregunta: '¿Cuál es uno de los desafíos sociales de la robótica?',
    opciones: [
      'Su impacto en el empleo y la necesidad de capacitación',
      'Que los robots todavía no pueden moverse solos',
      'Que aún no existen sensores precisos',
      'Que solo funciona en la exploración espacial',
    ],
    correcta: 0,
    explicacion: 'La robótica aumenta la productividad, pero puede reemplazar algunos trabajos. Por eso es clave formarse en tecnología.',
  },
  {
    tema: 'robotica',
    pregunta: '¿En qué década aparecieron los primeros brazos robóticos industriales?',
    opciones: ['1900', '1950', '1990', '2010'],
    correcta: 1,
    explicacion: 'En los años 50 se crearon los primeros brazos industriales. Unimate, el primero en trabajar en una fábrica, empezó en 1961 en una planta de carros.',
  },
  {
    tema: 'robotica',
    pregunta: '¿Qué es Arduino?',
    opciones: [
      'Una placa electrónica programable para crear prototipos',
      'Un lenguaje para diseñar páginas web',
      'Un tipo de robot androide',
      'Una red social para ingenieros',
    ],
    correcta: 0,
    explicacion: 'Arduino es una placa de código abierto con un microcontrolador. Se usa mucho para construir robots como el esquiva-obstáculos o el seguidor de línea.',
  },

  /* --------------------------------------------------------
     CIBERSEGURIDAD
     -------------------------------------------------------- */
  {
    tema: 'ciberseguridad',
    pregunta: 'Te llega un correo de “tu banco” que pide confirmar tu contraseña en un enlace urgente. ¿Qué es?',
    opciones: ['Phishing', 'Una actualización de seguridad', 'Un antivirus', 'Un correo normal del banco'],
    correcta: 0,
    explicacion: 'El phishing suplanta a empresas reales para robar datos. Los bancos nunca piden tu contraseña por correo: entra siempre escribiendo tú la dirección.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: '¿Cuál de estas contraseñas es la más segura?',
    opciones: ['123456789', 'maria2008', 'Gato#Verde-Come7Arepas', 'contraseña'],
    correcta: 2,
    explicacion: 'Es larga y mezcla mayúsculas, minúsculas, números y símbolos. Evita nombres, fechas de cumpleaños y secuencias fáciles.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: '¿Qué es la verificación en dos pasos (2FA)?',
    opciones: [
      'Pedir un código o tu huella además de la contraseña',
      'Escribir la misma contraseña dos veces al crear la cuenta',
      'Tener dos cuentas en la misma red social por seguridad',
      'Cambiar la contraseña cada dos días',
    ],
    correcta: 0,
    explicacion: 'Aunque alguien robe tu contraseña, no podrá entrar sin el segundo factor: un código, una app o tu huella.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: 'La palabra “malware” se refiere a…',
    opciones: [
      'Un programa que limpia y acelera el computador',
      'Software creado para dañar, espiar o robar',
      'Una falla física del teclado o del mouse',
      'Una red Wi-Fi lenta o inestable',
    ],
    correcta: 1,
    explicacion: 'Malware viene de “malicious software” (software malicioso). Virus, gusanos, troyanos, spyware y ransomware son tipos de malware.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: 'Un programa cifra todos tus archivos y te pide dinero para devolverlos. ¿Qué ataque es?',
    opciones: ['Phishing', 'Spam', 'Ransomware', 'Cookies'],
    correcta: 2,
    explicacion: 'El ransomware “secuestra” tus archivos. La mejor defensa son las copias de seguridad, porque pagar no garantiza recuperarlos.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: 'Alguien te llama haciéndose pasar por soporte técnico para que le digas tu clave. Esta técnica se llama…',
    opciones: ['Ingeniería social', 'Cifrado', 'Firewall', 'Copia de seguridad'],
    correcta: 0,
    explicacion: 'La ingeniería social engaña a las personas en vez de atacar la tecnología. Desconfía de la urgencia y nunca compartas claves ni códigos.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: 'Un juego “gratis” que parece normal, pero esconde un programa espía, es un…',
    opciones: ['Firewall', 'Troyano', 'Navegador', 'Router'],
    correcta: 1,
    explicacion: 'Como el caballo de Troya: aparenta ser inofensivo para que tú mismo lo instales. Descarga apps solo de tiendas oficiales.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: '¿Qué indican el candado y “https://” en la barra del navegador?',
    opciones: [
      'Que la conexión con el sitio está cifrada',
      'Que el sitio es 100 % confiable y nunca es falso',
      'Que la página carga más rápido de lo normal',
      'Que el sitio pertenece a una entidad del gobierno',
    ],
    correcta: 0,
    explicacion: 'El cifrado protege los datos mientras viajan, pero una página falsa también puede tener candado. Revisa siempre bien la dirección.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: 'Estás conectado al Wi-Fi público de un centro comercial. ¿Qué es lo más prudente?',
    opciones: [
      'Entrar a tu banco para revisar el saldo rápidamente',
      'Evitar escribir contraseñas o datos bancarios',
      'Desactivar el antivirus para que todo cargue más rápido',
      'Compartir tus archivos con todos los de la red',
    ],
    correcta: 1,
    explicacion: 'En redes abiertas otras personas podrían ver tu tráfico. Para cosas delicadas usa tus datos móviles o una VPN.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: '¿Cuál es la función de un firewall (cortafuegos)?',
    opciones: [
      'Enfriar el procesador cuando se calienta',
      'Controlar el tráfico que entra y sale de la red',
      'Borrar los virus que ya están instalados',
      'Aumentar la velocidad del internet en casa',
    ],
    correcta: 1,
    explicacion: 'El firewall funciona como un portero: deja pasar las conexiones permitidas y bloquea las sospechosas.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: '¿Por qué es importante instalar las actualizaciones del sistema y de las apps?',
    opciones: [
      'Porque solo cambian los íconos y los colores',
      'Porque corrigen fallas de seguridad',
      'Porque liberan espacio en el disco duro',
      'No es importante, solo ocupan memoria',
    ],
    correcta: 1,
    explicacion: 'Las actualizaciones cierran vulnerabilidades que los atacantes ya conocen. Posponerlas deja la puerta abierta.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: '¿Qué es una copia de seguridad (backup)?',
    opciones: [
      'Un antivirus gratuito que viene con Windows',
      'Una copia de tus archivos guardada en otro lugar',
      'Una contraseña de respaldo por si olvidas la tuya',
      'Una segunda cuenta de correo para emergencias',
    ],
    correcta: 1,
    explicacion: 'Regla 3-2-1: tres copias, en dos medios distintos y una fuera de casa, por ejemplo en la nube.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: '¿Cuáles son los tres pilares de la seguridad de la información?',
    opciones: [
      'Velocidad, precio y diseño',
      'Hardware, software y redes',
      'Confidencialidad, integridad y disponibilidad',
      'Usuario, contraseña y correo',
    ],
    correcta: 2,
    explicacion: 'Confidencialidad: solo la ve quien debe. Integridad: nadie la altera. Disponibilidad: está lista cuando se necesita.',
  },
  {
    tema: 'ciberseguridad',
    vf: true,
    pregunta: 'Usar la misma contraseña en todas tus cuentas es seguro si es larga.',
    opciones: ['Verdadero', 'Falso'],
    correcta: 1,
    explicacion: 'Falso. Si se filtra en un sitio, los atacantes la prueban en todas tus cuentas. Usa una distinta para cada una; un gestor de contraseñas ayuda.',
  },
  {
    tema: 'ciberseguridad',
    vf: true,
    pregunta: 'Tener un antivirus instalado significa estar 100 % protegido.',
    opciones: ['Verdadero', 'Falso'],
    correcta: 1,
    explicacion: 'Falso. El antivirus ayuda, pero no frena el phishing ni la ingeniería social. La mejor protección combina herramientas y buenos hábitos.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: '¿Qué dato es más riesgoso publicar en redes sociales?',
    opciones: [
      'Tu canción favorita del momento',
      'Una foto de un paisaje que visitaste',
      'Tu ubicación en tiempo real y tu dirección',
      'Tu opinión sobre una película',
    ],
    correcta: 2,
    explicacion: 'Revela dónde estás y facilita robos o acoso. Revisa la privacidad de tus perfiles y piensa antes de publicar.',
  },
  {
    tema: 'ciberseguridad',
    pregunta: '¿Para qué sirve una VPN?',
    opciones: [
      'Para aumentar la memoria RAM del equipo',
      'Para cifrar tu conexión a internet',
      'Para eliminar el malware del computador',
      'Para no tener que usar contraseñas',
    ],
    correcta: 1,
    explicacion: 'La VPN cifra el tráfico entre tu dispositivo y su servidor. Es útil en redes públicas, aunque no te vuelve invisible.',
  },

  /* --------------------------------------------------------
     INTELIGENCIA ARTIFICIAL
     -------------------------------------------------------- */
  {
    tema: 'ia',
    pregunta: '¿Qué es la inteligencia artificial?',
    opciones: [
      'Un robot con forma humana que puede hablar y caminar',
      'Máquinas que realizan tareas propias de la inteligencia humana',
      'Un tipo de virus que aprende a esconderse en el equipo',
      'Una conexión a internet de alta velocidad y sin cables',
    ],
    correcta: 1,
    explicacion: 'La IA reconoce imágenes, entiende lenguaje, aprende de datos y toma decisiones. No necesita tener cuerpo de robot.',
  },
  {
    tema: 'ia',
    pregunta: 'Cuando una IA aprende a partir de ejemplos, sin que le programen cada regla, se llama…',
    opciones: ['Aprendizaje automático (machine learning)', 'Ingeniería social', 'Computación en la nube', 'Realidad virtual'],
    correcta: 0,
    explicacion: 'El aprendizaje automático encuentra patrones en muchos datos. Así, un filtro aprende qué correos son spam viendo miles de ejemplos.',
  },
  {
    tema: 'ia',
    pregunta: '¿Qué es un “prompt”?',
    opciones: ['Un error del sistema', 'La instrucción o pregunta que le escribes a una IA', 'Un tipo de virus', 'Una pieza del robot'],
    correcta: 1,
    explicacion: 'Un buen prompt es claro y da contexto: qué quieres, para quién y en qué formato.',
  },
  {
    tema: 'ia',
    pregunta: '¿Qué es Replit?',
    opciones: [
      'Una red social para compartir videos cortos',
      'Una plataforma para programar y publicar apps en línea',
      'Un antivirus que funciona desde el navegador',
      'Un robot industrial para fábricas de software',
    ],
    correcta: 1,
    explicacion: 'Replit permite escribir código, probarlo y compartirlo con un enlace sin instalar nada en el computador. Este Quiz TIC funciona en Replit.',
  },
  {
    tema: 'ia',
    pregunta: 'En Replit, ¿qué hace el Agent?',
    opciones: [
      'Crea apps a partir de lo que le pides por escrito',
      'Protege la red Wi-Fi de ataques externos',
      'Imprime y envía los documentos del proyecto',
      'Edita y publica videos en redes sociales',
    ],
    correcta: 0,
    explicacion: 'Le describes la app que quieres y el Agent genera el código. Después hay que revisarlo, entenderlo y probarlo.',
  },
  {
    tema: 'ia',
    pregunta: 'Una IA generativa es la que…',
    opciones: [
      'Solo guarda y organiza archivos en carpetas',
      'Crea contenido nuevo, como textos, imágenes o código',
      'Repara las piezas dañadas del computador',
      'Bloquea virus y correos falsos automáticamente',
    ],
    correcta: 1,
    explicacion: 'Ejemplos: los chatbots como ChatGPT, Gemini o Claude y los generadores de imágenes.',
  },
  {
    tema: 'ia',
    pregunta: '¿Qué es una “alucinación” de la IA?',
    opciones: [
      'Cuando la IA se apaga sola por un error',
      'Cuando la IA da una respuesta falsa con mucha seguridad',
      'Un efecto visual que aparece en la pantalla',
      'Cuando la IA pierde la conexión a internet',
    ],
    correcta: 1,
    explicacion: 'La IA puede inventar datos que suenan creíbles. Por eso hay que verificar en fuentes confiables.',
  },
  {
    tema: 'ia',
    vf: true,
    pregunta: 'Lo que responde una IA siempre es correcto, así que no hace falta revisarlo.',
    opciones: ['Verdadero', 'Falso'],
    correcta: 1,
    explicacion: 'Falso. La IA se equivoca y puede tener sesgos. Úsala como apoyo y verifica la información.',
  },
  {
    tema: 'ia',
    pregunta: 'La tecnología que permite a una IA reconocer rostros en una foto se llama…',
    opciones: ['Visión por computador', 'Ingeniería social', 'Ofimática', 'Bluetooth'],
    correcta: 0,
    explicacion: 'La visión por computador analiza imágenes y videos. La usan el desbloqueo facial, los carros autónomos y muchos robots.',
  },
  {
    tema: 'ia',
    pregunta: '¿Qué aporta la inteligencia artificial a la robótica moderna?',
    opciones: [
      'Nada, la IA y la robótica no se relacionan',
      'Más autonomía para percibir, decidir y aprender',
      'Reemplaza por completo los sensores del robot',
      'Solo sirve para que los robots hablen',
    ],
    correcta: 1,
    explicacion: 'Gracias a la IA los robots actuales reconocen objetos, planean rutas y se adaptan, por ejemplo en medicina o en exploración espacial.',
  },
  {
    tema: 'ia',
    pregunta: 'Los asistentes de voz como Siri o Alexa entienden lo que dices gracias al…',
    opciones: ['Procesamiento de lenguaje natural', 'Firewall', 'Impresión 3D', 'Bluetooth'],
    correcta: 0,
    explicacion: 'El procesamiento de lenguaje natural (PLN) permite a las máquinas entender y producir lenguaje humano, hablado o escrito.',
  },
  {
    tema: 'ia',
    pregunta: '¿Cuál es un uso responsable de la IA en tus estudios?',
    opciones: [
      'Copiar y pegar su respuesta sin leerla antes',
      'Usarla para entender y explicarlo con tus palabras',
      'Pedirle que presente el examen por ti',
      'Darle tus contraseñas para que te ayude',
    ],
    correcta: 1,
    explicacion: 'La IA es una herramienta de apoyo: te ayuda a aprender, pero tú debes revisar, verificar y entender lo que entregas.',
  },
  {
    tema: 'ia',
    pregunta: '¿Qué significa que una IA tenga sesgos?',
    opciones: [
      'Que responde más rápido que otras IA',
      'Que puede tratar injustamente a ciertos grupos',
      'Que sus datos están protegidos con cifrado',
      'Que ocupa menos espacio en la memoria',
    ],
    correcta: 1,
    explicacion: 'Si los datos de entrenamiento están desbalanceados, la IA repite esos errores. Por eso importa revisar con qué datos se entrena.',
  },

  /* --------------------------------------------------------
     MUNDO TIC
     -------------------------------------------------------- */
  {
    tema: 'tic',
    pregunta: '¿Qué significa la sigla TIC?',
    opciones: [
      'Técnicas de Internet y Computación',
      'Tecnologías de la Información y la Comunicación',
      'Tecnología Industrial Computarizada',
      'Teoría de la Informática Comunitaria',
    ],
    correcta: 1,
    explicacion: 'Las TIC son las herramientas para crear, guardar, procesar y compartir información: computadores, celulares, internet y software.',
  },
  {
    tema: 'tic',
    pregunta: '¿Cuál de estos es hardware?',
    opciones: ['WhatsApp', 'Windows', 'El teclado', 'Un antivirus'],
    correcta: 2,
    explicacion: 'El hardware son las partes físicas que puedes tocar. El software son los programas, como WhatsApp, Windows o un antivirus.',
  },
  {
    tema: 'tic',
    pregunta: '¿Qué es “la nube” en informática?',
    opciones: [
      'Una red Wi-Fi pública y sin contraseña',
      'Servidores en internet donde guardas tus archivos',
      'El programa que muestra el pronóstico del clima',
      'Una memoria USB de gran capacidad',
    ],
    correcta: 1,
    explicacion: 'Google Drive, OneDrive o el mismo Replit funcionan en la nube: tus archivos están en servidores y los abres desde cualquier dispositivo.',
  },
  {
    tema: 'tic',
    pregunta: '¿Qué es el Internet de las Cosas (IoT)?',
    opciones: [
      'Una tienda en línea de aparatos electrónicos',
      'Objetos cotidianos conectados a internet',
      'Un navegador web para dispositivos móviles',
      'Una red social para compartir objetos',
    ],
    correcta: 1,
    explicacion: 'Relojes inteligentes, bombillos o cámaras que controlas desde el celular son ejemplos de IoT.',
  },
  {
    tema: 'tic',
    pregunta: '¿Cuál es la diferencia entre internet y la web?',
    opciones: [
      'Son exactamente lo mismo con dos nombres distintos',
      'Internet es la red; la web es un servicio que usa esa red',
      'La web es más antigua y más grande que internet',
      'Internet solo funciona por cable y la web por Wi-Fi',
    ],
    correcta: 1,
    explicacion: 'El correo, los juegos en línea y WhatsApp también usan internet sin ser páginas web.',
  },
  {
    tema: 'tic',
    pregunta: '¿Qué lenguaje se usa para crear la estructura de una página web?',
    opciones: ['HTML', 'Excel', 'PDF', 'MP3'],
    correcta: 0,
    explicacion: 'HTML define los títulos, botones y textos de la página. Este Quiz TIC está hecho con HTML, CSS y JavaScript.',
  },
  {
    tema: 'tic',
    pregunta: 'En este Quiz TIC, ¿qué lenguaje se encarga de la lógica: el tiempo, el puntaje y las respuestas?',
    opciones: ['CSS', 'HTML', 'JavaScript', 'Word'],
    correcta: 2,
    explicacion: 'HTML arma la estructura, CSS le da el diseño y JavaScript hace que todo funcione. Puedes verlo en el archivo script.js.',
  },
  {
    tema: 'tic',
    pregunta: '¿Qué es un algoritmo?',
    opciones: [
      'Un tipo de computador portátil',
      'Pasos ordenados para resolver un problema',
      'Un virus informático muy antiguo',
      'Una red social para programadores',
    ],
    correcta: 1,
    explicacion: 'Una receta de cocina también es un algoritmo. Los programas son algoritmos escritos en un lenguaje que el computador entiende.',
  },
  {
    tema: 'tic',
    pregunta: '¿Cuál de estos es un navegador web?',
    opciones: ['Google Chrome', 'Microsoft Word', 'Windows', 'Gmail'],
    correcta: 0,
    explicacion: 'El navegador es el programa para abrir páginas web, como Chrome, Firefox o Edge. Google, en cambio, es un buscador.',
  },
  {
    tema: 'tic',
    pregunta: '¿Qué es la ciudadanía digital?',
    opciones: [
      'Tener muchos seguidores en redes sociales',
      'Usar la tecnología con responsabilidad y respeto',
      'Votar en las elecciones por internet',
      'Tener la cédula en formato digital',
    ],
    correcta: 1,
    explicacion: 'Incluye proteger tus datos, respetar a los demás en línea, verificar lo que compartes y cuidar tu bienestar digital.',
  },
  {
    tema: 'tic',
    pregunta: '¿Qué unidad de almacenamiento es la más grande?',
    opciones: ['Gigabyte (GB)', 'Megabyte (MB)', 'Terabyte (TB)', 'Kilobyte (KB)'],
    correcta: 2,
    explicacion: 'De menor a mayor: KB, MB, GB y TB. Cada una equivale a unas mil veces la anterior (1024 en binario).',
  },
  {
    tema: 'tic',
    pregunta: 'El sistema binario que usan los computadores tiene solo…',
    opciones: ['Ceros y unos', 'Letras de la A a la Z', 'Números del 1 al 10', 'Colores primarios'],
    correcta: 0,
    explicacion: 'Toda la información se representa con bits: 0 (apagado) y 1 (encendido). Ocho bits forman un byte.',
  },
  {
    tema: 'tic',
    vf: true,
    pregunta: 'La memoria RAM guarda tus archivos aunque apagues el computador.',
    opciones: ['Verdadero', 'Falso'],
    correcta: 1,
    explicacion: 'Falso. La RAM es temporal y se borra al apagar. Los archivos se guardan en el disco duro o en el SSD.',
  },
  {
    tema: 'tic',
    pregunta: '¿Qué es el ciberacoso?',
    opciones: [
      'Un programa que protege contra virus',
      'Acosar o humillar a alguien por medios digitales',
      'Un videojuego de combate en línea',
      'Navegar por internet sin permiso',
    ],
    correcta: 1,
    explicacion: 'Si lo vives o lo ves: no respondas, guarda evidencias, bloquea y cuéntaselo a un docente o a alguien de confianza.',
  },
];
