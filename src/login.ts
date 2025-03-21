import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '../public/css/login.css';

//Obtener referencias a los elementos del DOM
const season_select: HTMLSelectElement = document.getElementById('season-select') as HTMLSelectElement;
const week_select: HTMLSelectElement = document.getElementById('week-select') as HTMLSelectElement;
const button_submit: HTMLButtonElement = document.getElementById('btn_submit') as HTMLButtonElement;

//Variables globales para almacenar los valores
let current_season: number;
let current_week: number;

//Carga la temporada actual
async function loadCurrentSeason() {
    try {
        const response = await fetch('https://api.sportsdata.io/v3/nfl/scores/json/CurrentSeason?key=83067119f3104d2e989a5c5238dc1fad');

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        current_season = await response.json();
        console.log("Temporada actual:", current_season);
    } catch (error) {
        console.error("Error en la petición de temporada:", error);
    }
}

//Carga la semana actual
async function loadCurrentWeek() {
    try {
        const response = await fetch('https://api.sportsdata.io/v3/nfl/scores/json/CurrentWeek?key=83067119f3104d2e989a5c5238dc1fad');

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        current_week = await response.json();
        console.log("Semana actual:", current_week);
    } catch (error) {
        console.error("Error en la petición de semana:", error);
    }
}

//Rellena los selects una vez que los datos han sido obtenidos
function rellenarSelects() {

    //Rellenar el select de temporada
    for (let season = 2018; season <= current_season; season++) {
        let option = document.createElement('option');
        option.value = season.toString();
        option.text = season.toString();

        if (season === current_season) {
            option.selected = true;
        }
        
        season_select.add(option);
    }

    //Añadir la semana actual como primera opción del select de semanas
    let option = document.createElement('option');
    option.text = `Current Week`;
    option.value = current_week.toString();
    week_select.add(option);
    week_select.selectedIndex = 0;

    //Agregar las semanas 1-18
    for (let week = 1; week <= 18; week++) {
        let option = document.createElement('option');
        option.text = `Week ${week}`;
        option.value = week.toString();
        week_select.add(option);
    }
}

//Función principal para cargar datos
async function cargarDatos() {    
    await loadCurrentSeason();  
    await loadCurrentWeek();    
    rellenarSelects(); 
    
    button_submit.addEventListener('click', () => {
        //Guardar los datos en Session Storage
        sessionStorage.setItem('selectedSeason', season_select.value);
        sessionStorage.setItem('selectedWeek', week_select.value);
    });
}

//Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarDatos);
