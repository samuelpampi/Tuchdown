import { Team, Player, Stadium, Position, PositionCategory } from "./utils";

class TeamManager{
    private teams: Team[] = [];
    private players: Player[] = [];
    private stadiums: Stadium[] = [];

    //Hace la llamada a la API para cargar los equipos
    public async loadTeams() {
        try{

            let response: Response = await fetch('https://api.sportsdata.io/v3/nfl/scores/json/TeamsBasic?key=83067119f3104d2e989a5c5238dc1fad');

            if(!response.ok){
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            let teams_json: any[] = await response.json();

            //Generamos la lista de equipos con la interfaz
            for(let team of teams_json){
                let newTeam: Team ={
                    id: team.TeamID,
                    key: team.Key,
                    name: team.FullName,
                    conference: team.Conference,
                    division: team.Division,
                    city: team.City,
                    logo: team.WikipediaLogoURL,
                    stadium: team.StadiumID
                }

                this.teams.push(newTeam);
            }

            //console.log("Equipos cargados:", this.teams);

        } catch (error) {
            console.error("Error al cargar los equipos:", error);
        }
    }

    //Hace la llamada a la API para cargar los jugadores de un equipo
    public async loadPlayers(team_id:number){
        //Vaciamos el array de jugadores
        this.players = [];

        //Recuperamos la clave del equipo
        let team_selected: any = this.getTeam(team_id);
        let team_key: string = team_selected.key;

        try{

            let response: Response = await fetch(`https://api.sportsdata.io/v3/nfl/scores/json/PlayersBasic/${team_key}?key=83067119f3104d2e989a5c5238dc1fad`);

            if(!response.ok){
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            let players_json: any[] = await response.json();

            //Generamos la lista de jugadores con la interfaz
            for(let player of players_json){
                let newPlayer: Player ={
                    id: player.PlayerID,
                    name: player.Name,
                    position: Position[player.Position as keyof typeof Position],
                    position_category: PositionCategory[player.PositionCategory as keyof typeof PositionCategory],
                    team: player.TeamID,
                    number: player.Number,
                    age: player.Age,
                    headshot: player.UsaTodayHeadshotNoBackgroundUrl
                }

                this.players.push(newPlayer);
            }

            //console.log("Jugadores:", this.players);

        } catch (error) {
            console.error("Error al cargar los equipos:", error);
        }
    }

    //Hace la llamada a la API para cargar todos los stadios
    public async loadStadiums() {
        try {
            let response: Response = await fetch(`https://api.sportsdata.io/v3/nfl/scores/json/Stadiums?key=83067119f3104d2e989a5c5238dc1fad`);
    
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
    
            let stadiums_json:any[] = await response.json();

            //Generamos la lista de partidos con la interfaz
            for(let stadium of stadiums_json){
                let newStadium: Stadium = {
                    id: stadium.StadiumID,
                    name: stadium.Name,
                    city: stadium.City,
                    state: stadium.State,
                    longitude: stadium.GeoLong,
                    latitude: stadium.GeoLat
                }

                this.stadiums.push(newStadium);
            }

            console.log("Estadios cargados:", this.stadiums);
        } catch (error) {
            console.error("Error al cargar los partidos:", error);
        }
    }

    

    //---- Getters -------

    //Devuelve todos los equipos
    public getTeams(){
        return this.teams;
    }

    //Devuelve el equipo con ID
    public getTeam(id_team:number): Team | undefined{
        return this.teams.find(team => team.id === id_team);
    }

    //Devuelve el equipo con la KY
    public getTeamKey(key_team:string): Team | undefined{
        return this.teams.find(team => team.key === key_team);
    }

    //Devuelve todos los jugadores del equipo
    public getPlayers(){
        return this.players;
    }

    //Devuelve el estadio de un equipo
    public getStadium(id_team: number): Stadium | undefined {
        let team = this.teams.find(team => team.id === id_team);
        
        if (!team) {
            console.error(`Equipo con ID ${id_team} no encontrado.`);
            return undefined;
        }
    
        if (!team.stadium) {
            console.warn(`El equipo ${team.name} no tiene un estadio asignado.`);
            return undefined;
        }
    
        return this.stadiums.find(stadium => stadium.id === team.stadium);
    }
}

export {TeamManager};