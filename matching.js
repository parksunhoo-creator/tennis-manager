let partnerHistory = {};
let opponentHistory = {};

function getPartnerKey(a,b){
    return [a.id,b.id].sort().join("-");
}

function getOpponentKey(a,b){
    return [a.id,b.id].sort().join("-");
}

function recordPartner(a,b){
    const key = getPartnerKey(a,b);
    partnerHistory[key] =
        (partnerHistory[key] || 0) + 1;
}

function recordOpponent(team1,team2){

    team1.forEach(p1=>{

        team2.forEach(p2=>{

            const key =
                getOpponentKey(
                    p1,
                    p2
                );

            opponentHistory[key] =
                (
                    opponentHistory[key]
                    || 0
                ) + 1;

        });

    });

}

function getPartnerCount(a,b){

    return (
        partnerHistory[
            getPartnerKey(a,b)
        ] || 0
    );

}

function getOpponentCount(a,b){

    return (
        opponentHistory[
            getOpponentKey(a,b)
        ] || 0
    );

}

function compareFairness(a,b){

    const aRate =
        (a.gamesPlayed || 0)
        /
        Math.max(
            a.possibleRounds || 1,
            1
        );

    const bRate =
        (b.gamesPlayed || 0)
        /
        Math.max(
            b.possibleRounds || 1,
            1
        );

    if(
        aRate !== bRate
    ){
        return aRate - bRate;
    }

    const aRest =
        a.restCount || 0;

    const bRest =
        b.restCount || 0;

    if(
        aRest !== bRest
    ){
        return bRest - aRest;
    }

return 0;

}

function balanceTeams(
    p1,
    p2,
    p3,
    p4
){

    const options = [

        [[p1,p2],[p3,p4]],
        [[p1,p3],[p2,p4]],
        [[p1,p4],[p2,p3]]

    ];

    let best =
        options[0];

    let bestGap =
        999;

    options.forEach(
        option=>{

            const teamA =
                Number(option[0][0].rating)
                +
                Number(option[0][1].rating);

            const teamB =
                Number(option[1][0].rating)
                +
                Number(option[1][1].rating);

const gap =
    Math.abs(
        teamA - teamB
    );

const partnerPenalty =

    getPartnerCount(
        option[0][0],
        option[0][1]
    ) * 1000

    +

    getPartnerCount(
        option[1][0],
        option[1][1]
    ) * 1000;

const score =

    gap * 3000

    +

    partnerPenalty;

if(
    score < bestGap
){
    bestGap = score;
    best = option;
}

        }
    );

    return best;

}

function pickPartner(
    player,
    candidates
){

    if(
        candidates.length === 0
    ){
        return null;
    }

    const avgRating =

        candidates.reduce(
            (s,p)=>
                s + Number(p.rating || 0),
            0
        )
        /
        candidates.length;

    candidates.sort(
        (a,b)=>{

            const fairA =
                compareFairness(
                    a,
                    b
                );

            if(
                fairA !== 0
            ){
                return fairA;
            }

const partnerScoreA =
    getPartnerCount(
        player,
        a
    ) * 100;

const partnerScoreB =
    getPartnerCount(
        player,
        b
    ) * 100;

if(
    partnerScoreA !== partnerScoreB
){
    return partnerScoreA - partnerScoreB;
}
          
const opponentScoreA =
    getOpponentCount(
        player,
        a
    ) * 100;

const opponentScoreB =
    getOpponentCount(
        player,
        b
    ) * 10;

if(
    opponentScoreA !== opponentScoreB
){
    return opponentScoreA - opponentScoreB;
}
const balanceA =
                Math.abs(
                    (
                        Number(player.rating)
                        +
                        Number(a.rating)
                    )
                    -
                    (
                        avgRating * 2
                    )
                );

            const balanceB =
                Math.abs(
                    (
                        Number(player.rating)
                        +
                        Number(b.rating)
                    )
                    -
                    (
                        avgRating * 2
                    )
                );

            if(
                balanceA !== balanceB
            ){
                return balanceA - balanceB;
            }
return 0;

        }
    );

    return candidates[0];

}

function generateSchedule(){

    partnerHistory = {};
    opponentHistory = {};

    const activePlayers =
        players.filter(
            p => p.active
        );

    activePlayers.forEach(
        p => {

            p.gamesPlayed = 0;
            p.restCount = 0;
            p.possibleRounds = 0;

        }
    );

    const courtCount =
        Number(
            document.getElementById(
                "courtCount"
            ).value
        );

    const startHour =
        Number(
            document.getElementById(
                "startHour"
            ).value
        );

    const endHour =
        Number(
            document.getElementById(
                "endHour"
            ).value
        );

    const gameMinutes =
        Number(
            document.getElementById(
                "gameMinutes"
            ).value
        );

    const roundCount =
        Math.floor(
            (
                (endHour-startHour)
                * 60
            )
            /
            gameMinutes
        );

    let html =
        "<h2>매칭 결과</h2>";

    for(
        let round=1;
        round<=roundCount;
        round++
    ){

        const roundTime =

            startHour +

            (
                (round-1)
                * gameMinutes
            ) / 60;

        const availablePlayers =

            activePlayers.filter(
                p =>

                    p.arrival <= roundTime
                    &&
                    p.leave > roundTime
            );

        availablePlayers.forEach(
            p => {
                p.possibleRounds++;
            }
        );

        let males =
            availablePlayers
                .filter(
                    p =>
                        p.gender==="M"
                )
                .sort(
                    compareFairness
                );

        let females =
            availablePlayers
                .filter(
                    p =>
                        p.gender==="F"
                )
                .sort(
                    compareFairness
                );

        let courts = [];

        let maleCourts = 0;
        let femaleCourts = 0;

        while(
            courts.length < courtCount
        ){

            if(
                males.length >= 4 &&
                (
                    maleCourts <= femaleCourts
                    ||
                    females.length < 4
                )
            ){

const p1 =
    males.shift();

let p2 =
    pickPartner(
        p1,
        males
    );

males =
    males.filter(
        p =>
            p.id !== p2.id
    );

const p3 =
    males.shift();

let p4 =
    pickPartner(
        p3,
        males
    );

males =
    males.filter(
        p =>
            p.id !== p4.id
    );

const balanced =
    balanceTeams(
        p1,
        p2,
        p3,
        p4
    );

const team1 =
    balanced[0];

const team2 =
    balanced[1];

recordPartner(
    team1[0],
    team1[1]
);

recordPartner(
    team2[0],
    team2[1]
);

recordOpponent(
    team1,
    team2
);

courts.push({

    type:"남복",

    team1: team1,

    team2: team2

});

                maleCourts++;

                continue;

            }

            if(
                females.length >= 4
            ){

                const p1 =
                    females.shift();

                let p2 =
                    pickPartner(
                        p1,
                        females
                    );

                females =
                    females.filter(
                        p =>
                            p.id !== p2.id
                    );

                const p3 =
                    females.shift();

                let p4 =
                    pickPartner(
                        p3,
                        females
                    );

                females =
                    females.filter(
                        p =>
                            p.id !== p4.id
                    );
const balanced =
    balanceTeams(
        p1,
        p2,
        p3,
        p4
    );

const team1 =
    balanced[0];

const team2 =
    balanced[1];
recordPartner(
    team1[0],
    team1[1]
);

recordPartner(
    team2[0],
    team2[1]
);

recordOpponent(
    team1,
    team2
);

courts.push({

    type:"여복",

    team1: team1,

    team2: team2

});

                femaleCourts++;

                continue;

            }

            if(
                males.length >= 2 &&
                females.length >= 2
            ){

                const m1 =
                    males.shift();

                const m2 =
                    males.shift();

                const f1 =
                    females.shift();

                const f2 =
                    females.shift();

                courts.push({

                    type:"혼복",

                    team1:[
                        m1,f1
                    ],

                    team2:[
                        m2,f2
                    ]

                });

                continue;

            }

            break;

        }

        html +=
            `<div class="card">
            <h3>${round} 라운드</h3>`;

        courts.forEach(
            (court,idx)=>{

                court.team1.forEach(
                    p=>{
                        p.gamesPlayed++;
                    }
                );

                court.team2.forEach(
                    p=>{
                        p.gamesPlayed++;
                    }
                );

                html += `
                    <b>
                    코트 ${idx+1}
                    (${court.type})
                    </b>
                    <br>
                    ${court.team1[0].name}
                    /
                    ${court.team1[1].name}
                    <br>
                    VS
                    <br>
                    ${court.team2[0].name}
                    /
                    ${court.team2[1].name}
                    <br><br>
                `;

            }
        );

        const waitingPlayers =

            [
                ...males,
                ...females
            ];

        waitingPlayers.forEach(
            p => {
                p.restCount++;
            }
        );

        if(
            waitingPlayers.length > 0
        ){

            html +=
                "<hr><b>대기</b><br>";

            waitingPlayers.forEach(
                p => {

                    html +=
                        p.name + " ";

                }
            );

        }

        html += "</div>";

    }

    savePlayers();

    renderPlayers();

    document.getElementById(
        "matchResult"
    ).innerHTML = html;

}