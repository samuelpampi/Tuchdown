import 'bootstrap/dist/css/bootstrap.min.css'; //Importa el CSS de Bootstrap
import 'bootstrap'; //Importa los componentes JS de Bootstrap
import '../public/css/style.css'; //Asegura que tu CSS se carga después

//Clases
import { MatchManager } from './utils/matchManager';
import { TeamManager } from './utils/teamManager';
import { RankingManager } from './utils/rankingManager';

//Interfaces
import { Position, PositionCategory, Team, Player, Stadium, Conference, Division, Ranking, Match } from "./utils/utils";

//Elementos del DOM
const carousel:HTMLDivElement = document.getElementById("carousel") as HTMLDivElement;
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

var index = 0;
var teamManager:TeamManager;
var matches:Match[] = [];

//Carga los partidos en la página
async function cargarPartidos() {
    //Creamos instancia de MatchManager
    const matchManager: MatchManager = new MatchManager();

    //Obtenemos los partidos
    await matchManager.loadMatches();
    matches = matchManager.getMatches();

    console.log(matches);

    //Habilitamos botones del carousel
    let carouselBack: HTMLButtonElement = document.getElementById("carousel_back") as HTMLButtonElement;
    let carouselNext: HTMLButtonElement = document.getElementById("carousel_next") as HTMLButtonElement;
    carouselBack.addEventListener('click', prevCard);
    carouselNext.addEventListener('click', nextCard);

    //Construir el carousel de partidos
    crearCarousel();
}

//Inicializa el carrusel de cartas (solo una vez)
function crearCarousel() {
    carousel.innerHTML = "";

    for (let i = 0; i < matches.length; i++) {
        let card = createMatchCard(matches[i]);
        carousel.appendChild(card);
    }

    // Aplicamos las clases para la posición inicial
    updateCarousel();
}

//Actualiza las clases para la animación del carrusel
function updateCarousel() {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card, i) => {
        card.classList.remove("center", "left", "right", "hidden");

        if (i === index) {
            card.classList.add("center");
        } else if (i === (index + 1) % matches.length) {
            card.classList.add("right");
        } else if (i === (index - 1 + matches.length) % matches.length) {
            card.classList.add("left");
        } else {
            card.classList.add("hidden");
        }
    });
}

//Devuelve el elemento html de la carta del partido
function createMatchCard(match: Match): HTMLElement {
    let card: HTMLDivElement = document.createElement('div');
    card.classList.add("card", "text-center", "px-3", "py-4", "d-flex", "flex-column", "justify-content-around", "align-items-center");

    //Recuperamos los datos del equipo local
    let teamHome: Team | undefined = teamManager.getTeamKey(match.home_team); 
    let homeTeamDiv: HTMLDivElement = document.createElement('div');
    homeTeamDiv.classList.add("d-flex", "flex-column", "align-items-center", "match-team");

    //Verificación de que el equipo local existe
    if (teamHome) {
        let imgHomeTeam: HTMLImageElement = document.createElement('img');
        imgHomeTeam.src = teamHome.logo;
        imgHomeTeam.alt = `Escudo de ${teamHome.name}`;
        imgHomeTeam.width = 70;

        let pHomeTeam: HTMLParagraphElement = document.createElement('p');
        pHomeTeam.classList.add("fs-6", "fw-bold");
        pHomeTeam.innerText = teamHome.name;

        homeTeamDiv.appendChild(imgHomeTeam);
        homeTeamDiv.appendChild(pHomeTeam);
    } else {
        homeTeamDiv.innerText = "Equipo no encontrado";
    }

    //Recuperamos los datos del equipo visitante
    let teamAway: Team | undefined = teamManager.getTeamKey(match.away_team); 
    let awayTeamDiv: HTMLDivElement = document.createElement('div');
    awayTeamDiv.classList.add("d-flex", "flex-column", "align-items-center", "match-team");

    //Verificación de que el equipo visitante existe
    if (teamAway) {
        let imgAwayTeam: HTMLImageElement = document.createElement('img');
        imgAwayTeam.src = teamAway.logo;
        imgAwayTeam.alt = `Escudo de ${teamAway.name}`;
        imgAwayTeam.width = 70;

        let pAwayTeam: HTMLParagraphElement = document.createElement('p');
        pAwayTeam.classList.add("fs-6", "fw-bold");
        pAwayTeam.innerText = teamAway.name;

        awayTeamDiv.appendChild(imgAwayTeam);
        awayTeamDiv.appendChild(pAwayTeam);
    } else {
        awayTeamDiv.innerText = "Equipo no encontrado";
    }


    //Completamos el bloque de los equipos
    let teamsMatch: HTMLDivElement = document.createElement('div');
    teamsMatch.classList.add("d-flex", "justify-content-between", "align-items-center", "gap-3", "mb-4");

    let vs: HTMLParagraphElement = document.createElement('p');
    vs.classList.add("fs-6", "fw-semibold");
    vs.innerText = "VS";

    teamsMatch.appendChild(homeTeamDiv);
    teamsMatch.appendChild(vs);
    teamsMatch.appendChild(awayTeamDiv);

    
    //Completamos el bloque del horario y fecha
    let schedulerDiv: HTMLDivElement = document.createElement("div");

    let location: HTMLHeadElement = document.createElement('h5');
    location.classList.add("card-title", "fw-semibold", "fs-6");
    location.innerText = teamHome?.city || "Ciudad no disponible";

    let date: HTMLParagraphElement = document.createElement('p');
    date.classList.add("card-text", "fw-medium", "fs-6");
    date.innerText = match.date || "Fecha no disponible";

    schedulerDiv.appendChild(location);
    schedulerDiv.appendChild(date);


    //Completamos la carta
    card.appendChild(teamsMatch);
    card.appendChild(schedulerDiv);

    return card;
}

// Retrocede una posición en el carrusel
function prevCard() {
    index = (index - 1 + matches.length) % matches.length;
    updateCarousel();
}

// Avanza una posición en el carrusel
function nextCard() {
    index = (index + 1) % matches.length;
    updateCarousel();
}


//Carga los equipos en la página
async function cargarEquipos(){
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
            cargarJugadores(parseInt(teamId));
            cargarEstadio(parseInt(teamId));
        })
    }    
}

//Carga los jugadores de un equipo
async function cargarJugadores(id_team: number){    

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
async function cargarEstadio(id_team: number){
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
    await rankingManager.loadRanking();

    //Cargamos los ranking de la conferencia Americana y dibujamos las tablas
    var afc_ranking: Ranking[] = rankingManager.getConferenceRanking(Conference.AFC);
    dibujarTablaRanking(afc_ranking, afc_table);

    var afc_north_ranking: Ranking[] = rankingManager.getDivisionRanking(afc_ranking, Division.NTH);
    dibujarTablaRanking(afc_north_ranking, afc_nth_table);

    var afc_east_ranking: Ranking[] = rankingManager.getDivisionRanking(afc_ranking, Division.EST);
    dibujarTablaRanking(afc_east_ranking, afc_est_table);

    var afc_west_ranking: Ranking[] = rankingManager.getDivisionRanking(afc_ranking, Division.WST);
    dibujarTablaRanking(afc_west_ranking, afc_wst_table);

    var afc_south_ranking: Ranking[] = rankingManager.getDivisionRanking(afc_ranking, Division.STH);
    dibujarTablaRanking(afc_south_ranking, afc_sth_table);

    //Cargamos los ranking de la conferencia Nacional y dibujamos las tablas
    var nfc_ranking: Ranking[] = rankingManager.getConferenceRanking(Conference.NFC);
    dibujarTablaRanking(nfc_ranking, nfc_table);

    var nfc_north_ranking: Ranking[] = rankingManager.getDivisionRanking(nfc_ranking, Division.NTH);
    dibujarTablaRanking(nfc_north_ranking, nfc_nth_table);

    var nfc_east_ranking: Ranking[] = rankingManager.getDivisionRanking(nfc_ranking, Division.EST);
    dibujarTablaRanking(nfc_east_ranking, nfc_est_table);

    var nfc_west_ranking: Ranking[] = rankingManager.getDivisionRanking(nfc_ranking, Division.WST);
    dibujarTablaRanking(nfc_west_ranking, nfc_wst_table);

    var nfc_south_ranking: Ranking[] = rankingManager.getDivisionRanking(nfc_ranking, Division.STH);
    dibujarTablaRanking(nfc_south_ranking, nfc_sth_table);    
}

//Dibuja un ranking en una tabla
function dibujarTablaRanking(ranking: Ranking[], htmlTable: HTMLTableElement){    
    //Crear el cuerpo de la tabla
    var tbody = document.createElement("tbody");
    let position = 1;

    //Crear filas del ranking
    ranking.forEach(rank => {
        let row = crearRankingRow(position, rank);
        if(row){
            tbody.appendChild(row);
        }

        position++;
    });

    //Añadir body
    htmlTable.appendChild(tbody);

}

//Crea una fila del ranking
function crearRankingRow(position:number, ranking: Ranking){
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






//Carga los equipos en la página
async function cargarAllTeams(){
    //Creamos instancia de TeamManager
    teamManager = new TeamManager();

    //Obtenemos los equipos y los estadios
    await teamManager.loadTeams();
    await teamManager.loadStadiums();

}

//Carga los datos
async function cargarDatos(){
    await cargarAllTeams(); //Carga todos los equipos y estadios en la web para luego utilizarlos
    cargarPartidos();
    cargarEquipos();
    cargarRanking();
}

document.addEventListener('DOMContentLoaded', cargarDatos);