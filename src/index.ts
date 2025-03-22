import 'bootstrap/dist/css/bootstrap.min.css'; //Importa el CSS de Bootstrap
import 'bootstrap'; //Importa los componentes JS de Bootstrap
import '../public/css/style.css'; //Asegura que tu CSS se carga después

//Clases
import { MatchManager } from './utils/matchManager';
import { TeamManager } from './utils/teamManager';
import { RankingManager } from './utils/rankingManager';

//Interfaces
import { Position, PositionCategory, Team, Player, Stadium, Conference, Division, Ranking } from "./utils/utils";

//Elementos del DOM
const grid_nfc_tems:HTMLDivElement = document.getElementById("grid-nfc") as HTMLDivElement;
const grid_afc_tems:HTMLDivElement = document.getElementById("grid-afc") as HTMLDivElement;
const grid_offensive:HTMLDivElement = document.getElementById("grid-off") as HTMLDivElement;
const grid_deffensive:HTMLDivElement = document.getElementById("grid-deff") as HTMLDivElement;
const grid_special:HTMLDivElement = document.getElementById("grid-st") as HTMLDivElement;
const stadium_h2:HTMLHeadElement = document.getElementById("stadium-name") as HTMLHeadElement;
const city_p:HTMLParagraphElement = document.getElementById("staudion-city") as HTMLParagraphElement;
const mapa:HTMLDivElement = document.getElementById("map") as HTMLDivElement;
const afc_table:HTMLTableElement = document.getElementById("afc-table") as HTMLTableElement;
    const afc_nth_table:HTMLTableElement = document.getElementById("afc-nth-table") as HTMLTableElement;
    const afc_est_table:HTMLTableElement = document.getElementById("afc-est-table") as HTMLTableElement;
    const afc_wst_table:HTMLTableElement = document.getElementById("afc-wst-table") as HTMLTableElement;
    const afc_sth_table:HTMLTableElement = document.getElementById("afc-sth-table") as HTMLTableElement;
const nfc_table:HTMLTableElement = document.getElementById("nfc-table") as HTMLTableElement;
    const nfc_nth_table:HTMLTableElement = document.getElementById("nfc-nth-table") as HTMLTableElement;
    const nfc_est_table:HTMLTableElement = document.getElementById("nfc-est-table") as HTMLTableElement;
    const nfc_wst_table:HTMLTableElement = document.getElementById("nfc-wst-table") as HTMLTableElement;
    const nfc_sth_table:HTMLTableElement = document.getElementById("nfc-sth-table") as HTMLTableElement;


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

    //Obtenemos los equipos y los estadios
    await teamManager.loadTeams();
    await teamManager.loadStadiums();
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
            cargarEstadio(teamManager, parseInt(teamId));
        })
    }    
}

//Carga los jugadores de un equipo
async function cargarJugadores(teamManager: TeamManager, id_team: number){    

    //Cargamos jugadores de los Vikings
    await teamManager.loadPlayers(id_team);
    let players:Player[] = teamManager.getPlayers();
    console.log(players);

    //Recorremos los jugadores y los agregamos al DOM
    for (let player of players) {

        //Creamos el nuevo elemento para la imagen del logo del jugador
        let divItem = document.createElement('div');
        divItem.classList.add("d-flex", "flex-column", "align-items-center", "text-center", "player-card");

        let imgItem = document.createElement('img');
        imgItem.id = player.id.toString();
        imgItem.src = './img/headshot_temp.png';
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

//Carga el mapa con la ubicacion y la info del estadio de un equipo
async function cargarEstadio(teamManager: TeamManager, id_team: number){
    //Cargamos todos los estadios
    let stadium: Stadium | undefined = teamManager.getStadium(id_team);

    if(stadium){
       //Actualizamos datos del DOM
        stadium_h2.innerText = stadium.name;
        city_p.innerText = `${stadium.city} - ${stadium.state}`; 
    } else{
        //Actualizamos datos del DOM
        stadium_h2.innerText = "Error datos Estadio";
        city_p.innerText = "-"; 
    }

    //Actualizar mapa
    if (!mapa) {
        console.error("Error: No se encontró el elemento 'map' en el DOM.");
        return; // Salimos de la función si el mapa no existe
    }

    if (!stadium?.latitude || !stadium?.longitude) {
        console.error("Error: El estadio no tiene coordenadas válidas.");
        return;
    }

    let coordenadas:any = {lat: stadium.latitude, lng: stadium.longitude};
    var map = new google.maps.Map(mapa, {
        zoom: 10,
        center: coordenadas
    });
    var marker = new google.maps.Marker({
        position: coordenadas,
        map: map
    });
}

//Carga los datos de la clasificadion
async function cargarRanking(){
    //Creamos instancia de RankingManager
    const rankingManager: RankingManager = new RankingManager();
    // Crear instancia de TeamManager para acceder a los equipos
    const teamManager: TeamManager = new TeamManager();

    await teamManager.loadTeams();
    await rankingManager.loadRanking();

    //Cargamos los ranking de la conferencia Americana y dibujamos las tablas
    var afc_ranking: Ranking[] = rankingManager.getConferenceRanking(Conference.AFC);
    dibujarTablaRanking(afc_ranking, teamManager, afc_table);

    var afc_north_ranking: Ranking[] = rankingManager.getDivisionRanking(afc_ranking, Division.NTH);
    dibujarTablaRanking(afc_north_ranking, teamManager, afc_nth_table);

    var afc_east_ranking: Ranking[] = rankingManager.getDivisionRanking(afc_ranking, Division.EST);
    dibujarTablaRanking(afc_east_ranking, teamManager, afc_est_table);

    var afc_west_ranking: Ranking[] = rankingManager.getDivisionRanking(afc_ranking, Division.WST);
    dibujarTablaRanking(afc_west_ranking, teamManager, afc_wst_table);

    var afc_south_ranking: Ranking[] = rankingManager.getDivisionRanking(afc_ranking, Division.STH);
    dibujarTablaRanking(afc_south_ranking, teamManager, afc_sth_table);

    //Cargamos los ranking de la conferencia Nacional y dibujamos las tablas
    var nfc_ranking: Ranking[] = rankingManager.getConferenceRanking(Conference.NFC);
    dibujarTablaRanking(nfc_ranking, teamManager, nfc_table);

    var nfc_north_ranking: Ranking[] = rankingManager.getDivisionRanking(nfc_ranking, Division.NTH);
    dibujarTablaRanking(nfc_north_ranking, teamManager, nfc_nth_table);

    var nfc_east_ranking: Ranking[] = rankingManager.getDivisionRanking(nfc_ranking, Division.EST);
    dibujarTablaRanking(nfc_east_ranking, teamManager, nfc_est_table);

    var nfc_west_ranking: Ranking[] = rankingManager.getDivisionRanking(nfc_ranking, Division.WST);
    dibujarTablaRanking(nfc_west_ranking, teamManager, nfc_wst_table);

    var nfc_south_ranking: Ranking[] = rankingManager.getDivisionRanking(nfc_ranking, Division.STH);
    dibujarTablaRanking(nfc_south_ranking, teamManager, nfc_sth_table);    
}

//Dibuja un ranking en una tabla
function dibujarTablaRanking(ranking: Ranking[], teamManager:TeamManager, htmlTable: HTMLTableElement){    
    //Crear el cuerpo de la tabla
    var tbody = document.createElement("tbody");
    let position = 1;

    //Crear filas del ranking
    ranking.forEach(rank => {
        let row = crearRankingRow(position, rank, teamManager);
        if(row){
            tbody.appendChild(row);
        }

        position++;
    });

    //Añadir body
    htmlTable.appendChild(tbody);

}

//Crea una fila del ranking
function crearRankingRow(position:number, ranking: Ranking, teamManager: TeamManager){
    let team:Team | undefined = teamManager.getTeam(ranking.team_id);
    let tr = document.createElement("tr");

    if(team){

        //Celda posicion
        let tdPosition:HTMLTableCellElement = document.createElement('td') as HTMLTableCellElement;
        tdPosition.innerText = `${position}º`;
        tr.appendChild(tdPosition); //Añadimos la celda a la fila

        //Celda nombre-logo
        let tdName:HTMLTableCellElement = document.createElement('td') as HTMLTableCellElement;
        tdName.classList.add("team-name");

        let imgItem:HTMLImageElement = document.createElement('img') as HTMLImageElement;
        imgItem.src = team.logo;
        imgItem.alt = team.name;
        imgItem.width=30;
        imgItem.height=30;

        let spanItem:HTMLSpanElement = document.createElement('span') as HTMLSpanElement;
        spanItem.innerText = team.name;

        tdName.appendChild(imgItem);
        tdName.appendChild(spanItem);
        tr.appendChild(tdName); //Añadimos la celda a la fila

        //Celda Partidos
        let tdMatches:HTMLTableCellElement = document.createElement('td') as HTMLTableCellElement;
        let totalMatches:number = ranking.wins + ranking.ties + ranking.losses;
        tdMatches.innerText = totalMatches.toString();
        tr.appendChild(tdMatches); //Añadimos la celda a la fila

        //Celda Victorias
        let tdWins:HTMLTableCellElement = document.createElement('td') as HTMLTableCellElement;
        tdWins.innerText = ranking.wins.toString();
        tr.appendChild(tdWins); //Añadimos la celda a la fila

        //Celda Empates
        let tdTies:HTMLTableCellElement = document.createElement('td') as HTMLTableCellElement;
        tdTies.innerText = ranking.ties.toString();
        tr.appendChild(tdTies); //Añadimos la celda a la fila

        //Celda Derrotas
        let tdLosses:HTMLTableCellElement = document.createElement('td') as HTMLTableCellElement;
        tdLosses.innerText = ranking.losses.toString();
        tr.appendChild(tdLosses); //Añadimos la celda a la fila

        //Celda Puntos
        let tdPoints:HTMLTableCellElement = document.createElement('td') as HTMLTableCellElement;
        tdPoints.innerText = `${ranking.points_for}:${ranking.points_against}`;
        tr.appendChild(tdPoints); //Añadimos la celda a la fila

        //Celda Porcentaje
        let tdPercentage:HTMLTableCellElement = document.createElement('td') as HTMLTableCellElement;
        tdPercentage.innerText = ranking.percentage.toString();
        tr.appendChild(tdPercentage); //Añadimos la celda a la fila

        return tr;
    }

    return null;

}

//Carga los datos
function cargarDatos(){
    cargarPartidos();
    cargarEquipos();
    cargarRanking();
}

document.addEventListener('DOMContentLoaded', cargarDatos);