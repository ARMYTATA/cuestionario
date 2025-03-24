const firebaseConfig = {
    apiKey: "AIzaSyDuSWAzMFXREzyAkfRhdapfvFCoizcYbwc",
    authDomain: "segundoparcial-542c8.firebaseapp.com",
    databaseURL: "https://segundoparcial-542c8-default-rtdb.firebaseio.com",
    projectId: "segundoparcial-542c8",
    storageBucket: "segundoparcial-542c8.firebasestorage.app",
    messagingSenderId: "833876746243",
    appId: "1:833876746243:web:42cba8f6c7c10d47e26e36"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Función para calcular los puntos basados en el sentimiento
const getPointsForAnswer = (sentiment) => {
    switch (sentiment) {
        case "3":
            return 3; // Sentimiento positivo
        case "2":
            return 2; // Sentimiento neutro
        case "1":
            return 1; // Sentimiento negativo
        default:
            return 0;
    }
};

// Función para clasificar el sentimiento de la encuesta
function clasificarSentimiento(respuestas) {
    let positivos = 0;
    let neutros = 0;
    let negativos = 0;

    // Contamos cuántas respuestas son positivas, neutras o negativas
    for (let respuesta in respuestas) {
        if (respuestas[respuesta] === 3) {
            positivos++;
        } else if (respuestas[respuesta] === 2) {
            neutros++;
        } else if (respuestas[respuesta] === 1) {
            negativos++;
        }
    }

    // Asignar sentimiento según la mayoría de las respuestas
    if (positivos > neutros && positivos > negativos) {
        return 'Positivo';
    } else if (negativos > positivos && negativos > neutros) {
        return 'Negativo';
    } else {
        return 'Neutro';
    }
}

// Función para manejar el envío del formulario
document.getElementById("questionnaire").addEventListener("submit", function(event) {
    event.preventDefault();

    let respuestas = {};
    let puntosTotales = 0; // Variable para acumular los puntos

    // Recoger las respuestas y calcular los puntos
    let elementos = document.querySelectorAll('input[type="radio"]:checked');

    elementos.forEach(input => {
        respuestas[input.name] = parseInt(input.value);
        puntosTotales += getPointsForAnswer(input.value); // Sumar los puntos
    });

    // Validar que todas las preguntas hayan sido contestadas
    if (Object.keys(respuestas).length < 10) {
        alert("Por favor, responde todas las preguntas antes de enviar.");
        return;
    }

    // Recoger la carrera seleccionada
    const carreraSeleccionada = document.getElementById("carreras").value;

    // Clasificar el sentimiento de la encuesta
    const sentimiento = clasificarSentimiento(respuestas);

    // Crear un objeto con las respuestas, la carrera y el total de puntos
    const encuestaData = {
        respuestas,
        carrera: carreraSeleccionada,
        sentimiento,
        totalPuntos: puntosTotales,
        timestamp: new Date().toISOString()
    };

    // Guardar las respuestas en Firebase
    database.ref("respuestas/").push(encuestaData)
        .then(() => {
            alert("Respuestas enviadas correctamente.");
            document.getElementById("questionnaire").reset();
        })
        .catch(error => {
            console.error("Error al guardar los datos: ", error);
            alert("Hubo un error al enviar las respuestas.");
        });
});
