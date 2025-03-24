// 🔥 Configuración de Firebase
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

// Verifica si Firebase se inicializa correctamente
console.log("Iniciando análisis...");

// Leer datos desde Firebase
database.ref("respuestas/").once("value")
    .then(snapshot => {
        const datos = snapshot.val();
        if (datos) {
            mostrarResultados(datos);
            generarGraficaClasificacion(datos);
        } else {
            console.log("No hay datos disponibles.");
        }
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });

// Función para mostrar los resultados en la tabla
function mostrarResultados(datos) {
    const tabla = document.querySelector("#encuestasTabla tbody");
    tabla.innerHTML = ""; // Limpiar tabla antes de llenarla

    let contador = 1;
    for (let id in datos) {
        const dato = datos[id];
        const fila = `
            <tr>
                <td>Encuestado ${contador}</td>
                <td>${dato.carrera || "No especificado"}</td>
                <td>${dato.sentimiento || "No clasificado"}</td>
            </tr>
        `;
        tabla.innerHTML += fila;
        contador++;
    }
}

// Función para generar gráfica de clasificación
function generarGraficaClasificacion(datos) {
    let conteoSentimientos = { Positivo: 0, Neutro: 0, Negativo: 0 };

    for (let id in datos) {
        const dato = datos[id];
        if (conteoSentimientos[dato.sentimiento]) {
            conteoSentimientos[dato.sentimiento]++;
        }
    }

    // Crear la gráfica
    const ctx = document.getElementById("graficaClasificacion").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Positivo", "Neutro", "Negativo"],
            datasets: [{
                label: "Clasificación por Sentimientos",
                data: [
                    conteoSentimientos.Positivo,
                    conteoSentimientos.Neutro,
                    conteoSentimientos.Negativo
                ],
                backgroundColor: ["#4caf50", "#ffeb3b", "#f44336"]
            }]
        }
    });
}

