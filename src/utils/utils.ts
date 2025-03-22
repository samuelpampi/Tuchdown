enum PositionCategory{
    OFF = "Ofensiva",
    DEF = "Defensiva",
    ST = "Special Teams"
}

enum Position{
    //Ofensiva
    QB = "Quarterback",
    RB = "Running Back",
    WR = "Wide Receiver",
    TE = "Tight End",
    OT = "Offensive Tackle",
    G = "Guard",
    C = "Center",
    FB = "Fullback",
    OL = "Offensive Lineman",
    T = "Tackle",
    //Defensiva
    NT = "Nose Tackle",
    DL = "Defensive Lineman",   
    DT = "Defensive Tackle",
    DE = "Defensive End",
    LB = "Linebacker",
    ILB = "Inside Linebacker",
    OLB = "Outside Linebacker",
    CB = "Cornerback",
    S = "Safety",
    FS = "Free Safety",
    SS = "Strong Safety",
    DB = "Defensive Back",
    //Special Teams
    P = "Punter",
    LS = "Long Snapper",
    K = "Kicker",
    KR = "Kick Returner",
}


//Objeto Partido de la API
interface Match{
    home_team: string;
    away_team: string;
    stadium:string;
    date: string;
}

//Objeto Estadio de la API
interface Stadium{
    id: number;
    name: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
}

//Objeto Equipo de la API
interface Team{
    id: number;
    key: string;
    name: string;
    conference: string;
    division: string;
    city: string;
    logo: string;
    stadium: number;
}

//Objeto Jugador de la API
interface Player{
    id: number;
    name: string;
    position: Position;
    position_category: PositionCategory;
    team: number;
    number: number;
    age: number;
    headshot: string;
}

//Objeto Datos Clasificacion de la API
interface Ranking{
    team_id: number;
    season: number;
    wins: number;
    losses: number;
    ties: number;
    percentage: number;
    points_for: number;
    points_against: number;
}

export {Match, Stadium, Team, Player, Ranking, Position, PositionCategory};
