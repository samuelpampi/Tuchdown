import {Match} from './utils';

class MatchManager{
    private matches: Match[] = [];
    private season: number;
    private week: number;
    constructor(){
        this.season = parseInt(sessionStorage.getItem('selectedSeason') || '2024');
        this.week = parseInt(sessionStorage.getItem('selectedWeek') || '18');
    }

    //Hace la llamada a la API para cargar los partidos
    public async loadMatches() {
        try {
            let response: Response = await fetch(`https://api.sportsdata.io/v3/nfl/scores/json/ScoresBasic/${this.season}/${this.week}?key=83067119f3104d2e989a5c5238dc1fad`);
    
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            let matches_json:any[] = await response.json();

            //Generamos la lista de partidos con la interfaz
            for(let match of matches_json){
                let newMatch: Match = {
                    home_team: match.HomeTeam,
                    away_team: match.AwayTeam,
                    stadium: match.StadiumID,
                    date: match.DateTimeUTC
                }

                this.matches.push(newMatch);
            }

            //console.log("Partidos cargados:", this.matches);
        } catch (error) {
            console.error("Error al cargar los partidos:", error);
        }
    }

    //Devuelve la lista de partidos
    public getMatches(): Match[]{
        return this.matches;
    }
}

export {MatchManager};
