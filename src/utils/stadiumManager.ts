import { Stadium } from "./utils"

class StadiumManager{
    stadiums: Stadium[];
    
    constructor(){
        this.stadiums = [];
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

    //Devuelve un estadio
    public getStadium(stadium_id:number): Stadium | undefined{
        return this.stadiums.find(stadium => stadium.id === stadium_id);
    }
}

export{StadiumManager};