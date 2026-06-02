function savePlayers(){

    localStorage.setItem(
        "players",
        JSON.stringify(players)
    );

}

function createPlayerObject(data){

    return {

        id: Date.now() + Math.random(),

        name: data.name,

        gender: data.gender,

        skill: Number(data.skill),

        active: false,

        arrival: 18,

        leave: 22,

        gamesPlayed: 0,

        restCount: 0,

        partnerHistory: [],

        opponentHistory: []

    };

}

function loadPlayers(){

    const saved =
        localStorage.getItem(
            "players"
        );

    if(saved){

        players =
            JSON.parse(saved);

        return;

    }

    players =
        DEFAULT_PLAYERS.map(
            createPlayerObject
        );

    savePlayers();

}