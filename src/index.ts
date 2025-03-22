import 'bootstrap/dist/css/bootstrap.min.css'; //Importa el CSS de Bootstrap
import 'bootstrap'; //Importa los componentes JS de Bootstrap
import '../public/css/style.css'; //Asegura que tu CSS se carga después

//Clases
import { MatchManager } from './utils/matchManager';
import { TeamManager } from './utils/teamManager'; 

//Interfaces
import { Position, PositionCategory, Team } from "./utils/utils";

//Elementos del DOM
const grid_nfc_tems:HTMLDivElement = document.getElementById("grid-nfc") as HTMLDivElement;
const grid_afc_tems:HTMLDivElement = document.getElementById("grid-afc") as HTMLDivElement;
const grid_offensive:HTMLDivElement = document.getElementById("grid-off") as HTMLDivElement;
const grid_deffensive:HTMLDivElement = document.getElementById("grid-deff") as HTMLDivElement;
const grid_special:HTMLDivElement = document.getElementById("grid-st") as HTMLDivElement;

//Carga los partidos en la página
async function cargarPartidos(){
    //Creamos instancia de MatchManager
    const matchManager: MatchManager = new MatchManager();

    //Obtenemos los partidos
    await matchManager.loadMatches();
    let matches = matchManager.getMatches();

    //Mostramos los partidos en el carrusel
    console.log(matches);
}

//Carga los equipos en la página
async function cargarEquipos(){
    //Creamos instancia de TeamManager
    const teamManager: TeamManager = new TeamManager();

    //Obtenemos los equipos
    await teamManager.loadTeams();
    let teams = teamManager.getTeams();
    
    //Recorremos los equipos y los agregamos al DOM
    for (let team of teams) {
        //Creamos el nuevo elemento para la imagen del logo del equipo
        let divItem = document.createElement('div');
        let imgItem = document.createElement('img');
        imgItem.id = team.id.toString();
        imgItem.src = team.logo;
        imgItem.alt = `Logo de ${team.name}`;
        imgItem.width = 70; // Ajusta el tamaño de la imagen

        // Aquí, agregamos la imagen al divItem
        divItem.appendChild(imgItem);

        // Dependiendo de la conferencia, agregamos la imagen a un contenedor específico
        if (team.conference === "AFC") {
            grid_afc_tems.appendChild(divItem);
        } else if (team.conference === "NFC") {
            grid_nfc_tems.appendChild(divItem);
        }

        divItem.addEventListener('click', (event) => {
            //Reseteamos los grids    
            grid_offensive.innerHTML = "";
            grid_deffensive.innerHTML = "";
            grid_special.innerHTML = "";

            //Cambiamos nombre del equipo
            let nameTeam:HTMLHeadElement = document.getElementById('team_name') as HTMLHeadElement;
            nameTeam.innerText = team.name;          

            //Cargamos jugadores
            let teamId:string = (event.target as HTMLImageElement).id;
            cargarJugadores(teamManager, parseInt(teamId));
        })
    }    
}

//Carga los jugadores de un equipo
async function cargarJugadores(teamManager: TeamManager, id_team: number){    

    //Cargamos jugadores de los Vikings
    await teamManager.loadPlayers(id_team);
    let players = teamManager.getPlayers();
    console.log(players);

    //Recorremos los jugadores y los agregamos al DOM
    for (let player of players) {

        //Creamos el nuevo elemento para la imagen del logo del jugador
        let divItem = document.createElement('div');
        divItem.classList.add("d-flex", "flex-column", "align-items-center", "text-center");

        let imgItem = document.createElement('img');
        imgItem.id = player.id.toString();
        imgItem.src = './img/headshot_temp.jpg';
        imgItem.alt = `Headshot de ${player.name}`;
        imgItem.width = 90;

        let pName = document.createElement('p');
        pName.innerText = player.name;
        pName.classList.add("fs-5", "fw-medium")
        let pPosition = document.createElement('p');
        pPosition.innerText = `#${player.number} - ${player.position}`;
        pPosition.classList.add("fs-6", "fw-light")

        divItem.appendChild(imgItem);
        divItem.appendChild(pName);
        divItem.appendChild(pPosition);

        // Dependiendo de la categoria de la posicion, agregamos la imagen a un contenedor específico
        if (player.position_category === PositionCategory.OFF) {
            grid_offensive.appendChild(divItem);
        } else if (player.position_category === PositionCategory.DEF) {
            grid_deffensive.appendChild(divItem);
        } else if ((player.position_category === PositionCategory.ST)){
            grid_special.appendChild(divItem);
        }
    }
}

//Carga los datos
function cargarDatos(){
    cargarPartidos();
    cargarEquipos();
}

document.addEventListener('DOMContentLoaded', cargarDatos);