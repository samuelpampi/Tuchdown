import { Ranking } from "./utils";

class RankingManager{
    season:number;
    ranking: Ranking[];

    constructor(){
        this.season = parseInt(sessionStorage.getItem('selectedSeason') || '2024');
        this.ranking = [];
    }

    //Hace la llamada a la API para cargar el ranking de los equipos
    public async loadRanking() {
        try {
            let response: Response = await fetch(`https://api.sportsdata.io/v3/nfl/scores/json/Standings/${this.season}?key=83067119f3104d2e989a5c5238dc1fad`);
    
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            let ranking_json:any[] = await response.json();

            //Generamos la lista de partidos con la interfaz
            for(let ranking of ranking_json){
                let newRanking: Ranking = {
                    team_id: ranking.TeamID,
                    season: ranking.Season,
                    wins: ranking.Wins,
                    losses: ranking.Losses,
                    ties: ranking.Ties,
                    percentage: ranking.Percentage,
                    points_for: ranking.PointsFor,
                    points_against: ranking.PointsAgainst,
                    conference: ranking.Conference,
                    division: ranking.Division
                }

                this.ranking.push(newRanking);
            }

            console.log("Clasificacion:", this.ranking);
        } catch (error) {
            console.error("Error al cargar los partidos:", error);
        }
    }

    //Devuelve la lista ordenada por conferencia
    public getConferenceRanking(conference: string){
        //Obtenemos los rankings de la conferencia
        let rankingConference:Ranking[] = this.ranking.filter(rank => rank.conference == conference);

        //Los ordenamos
        let sortedRankings:Ranking[] = rankingConference.sort((a, b) => b.percentage - a.percentage); // Ordena de mayor a menor

        console.log(`Orden por ${conference}`, sortedRankings);
        return sortedRankings;
    }

    //Devuelve la lista ordenada por conferencia-division
    public getDivisionRanking(rank_list: Ranking[], division: string){
        //Filtramos por la division
        let divisionRanking: Ranking[] = rank_list.filter(rank => rank.division == division);
        let sortedRankings:Ranking[] = divisionRanking.sort((a, b) => b.percentage - a.percentage); // Ordena de mayor a menor

        console.log(`Orden por ${division}`, sortedRankings);
        return sortedRankings;
    }
}

export{RankingManager};