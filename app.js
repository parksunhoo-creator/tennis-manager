<button onclick="savePDF()">
📄 PDF 저장
</button>

loadPlayers();

function renderMemberSection() {

document.getElementById("memberSection").innerHTML = `

    <h2>회원 관리</h2>

    <div id="playerList"></div>

`;

}

function renderPlayers() {

const div =
    document.getElementById("playerList");

let html = "";

players.forEach(function(p){

    html += `

        <div class="card">

            <div class="row">

                <input
                    type="checkbox"
                    ${p.active ? "checked" : ""}
                    onchange="toggleAttendance(${p.id})">

                <b>${p.name}</b>

                (${p.gender} / ${Number(p.skill).toFixed(1)})

            </div>

            <div class="row">

                입장

                <input
                    type="number"
                    min="6"
                    max="24"
                    value="${p.arrival}"
                    onchange="updateArrival(${p.id}, this.value)">

                퇴장

                <input
                    type="number"
                    min="6"
                    max="24"
                    value="${p.leave}"
                    onchange="updateLeave(${p.id}, this.value)">

            </div>

            <div class="row">

                경기수 :
                ${p.gamesPlayed || 0}

                휴식수 :
                ${p.restCount || 0}

            </div>

            <div class="row">

                <button
                    class="btn-edit"
                    onclick="editMember(${p.id})">

                    수정

                </button>

                <button
                    class="btn-delete"
                    onclick="deleteMember(${p.id})">

                    삭제

                </button>

            </div>

        </div>

    `;

});

div.innerHTML = html;


}

function toggleAttendance(id){


const player =
    players.find(
        p => p.id === id
    );

if(!player) return;

player.active =
    !player.active;

savePlayers();


}

function updateArrival(id, value){

const player =
    players.find(
        p => p.id === id
    );

if(!player) return;

player.arrival =
    Number(value);

savePlayers();


}

function updateLeave(id, value){


const player =
    players.find(
        p => p.id === id
    );

if(!player) return;

player.leave =
    Number(value);

savePlayers();


}

function editMember(id){

const player =
    players.find(
        p => p.id === id
    );

if(!player) return;

const newName =
    prompt(
        "이름 수정",
        player.name
    );

if(!newName) return;

const newSkill =
    prompt(
        "능력치 수정 (2.0~5.0)",
        Number(player.skill).toFixed(1)
    );

if(!newSkill) return;

const allowedSkills = [

    2.0,
    2.3,
    2.5,
    2.6,
    3.0,
    3.2,
    3.3,
    3.5,
    3.8,
    4.0,
    4.5,
    5.0

];

if(
    !allowedSkills.includes(
        Number(newSkill)
    )
){

    alert(
        "허용된 등급만 입력 가능합니다."
    );

    return;

}

player.name =
    newName;

player.skill =
    Number(newSkill);

savePlayers();

renderPlayers();

}


function deleteMember(id){


if(
    !confirm(
        "삭제하시겠습니까?"
    )
){
    return;
}

players =
    players.filter(
        p => p.id !== id
    );

savePlayers();

renderPlayers();


}

function renderMemberSection() {

document.getElementById(
    "memberSection"
).innerHTML = `

    <h2>회원 관리</h2>

    <div class="card">

        이름

        <input
            id="newName"
            type="text">

        <br><br>

        성별

        <select id="newGender">

            <option value="M">
                남
            </option>

            <option value="F">
                여
            </option>

        </select>

        <br><br>

        등급

        <select id="newSkill">

            <option value="2.0">2.0</option>
            <option value="2.3">2.3</option>
            <option value="2.5">2.5</option>
            <option value="2.6">2.6</option>
            <option value="3.0">3.0</option>
            <option value="3.2">3.2</option>
            <option value="3.3">3.3</option>
            <option value="3.5">3.5</option>
            <option value="3.8">3.8</option>
            <option value="4.0">4.0</option>
            <option value="4.5">4.5</option>
            <option value="5.0">5.0</option>

        </select>

        <br><br>

        <button onclick="addMember()">

            회원 추가

        </button>
<br><br>

<button onclick="exportPlayers()">
💾 회원 백업
</button>

<br><br>
    </div>

    <div id="playerList"></div>

`;

}

function addMember(){

const name =
    document
        .getElementById(
            "newName"
        )
        .value
        .trim();

if(!name){

    alert(
        "이름을 입력하세요."
    );

    return;

}

const gender =
    document
        .getElementById(
            "newGender"
        )
        .value;

const skill =
    Number(
        document
            .getElementById(
                "newSkill"
            )
            .value
    );

players.push({

    id: Date.now(),

    name: name,

    gender: gender,

    skill: skill,

    active: true,

    arrival: 18,

    leave: 21,

    gamesPlayed: 0,

    restCount: 0

});

savePlayers();

renderPlayers();

document.getElementById(
    "newName"
).value = "";

}

function renderScheduleSection(){

document.getElementById(
    "scheduleSection"
).innerHTML = `

    <h2>매칭 설정</h2>

    <div class="card">

        코트 수

        <input
            id="courtCount"
            type="number"
            value="3">

        <br><br>

        시작 시간

        <input
            id="startHour"
            type="number"
            value="18">

        <br><br>

        종료 시간

        <input
            id="endHour"
            type="number"
            value="21">

        <br><br>

        게임 시간

        <input
            id="gameMinutes"
            type="number"
            value="25">

        <br><br>

        <button
            onclick="generateSchedule()">

            자동 매칭 생성

        </button>

    </div>

    <div id="matchResult"></div>

`;

}

renderMemberSection();
<button onclick="addMember()">
회원 추가
</button>

<br><br>

<button onclick="exportPlayers()">
💾 회원 백업
</button>

<br><br>

<input
    type="file"
    id="importFile"
    onchange="importPlayers(event)">
        
renderPlayers();

renderScheduleSection();

function savePDF(){

    const element =
        document.getElementById(
            "matchResult"
        );

    html2pdf()
        .set({
            margin: 10,
            filename:
                'Tennis_Match.pdf',
            image:{
                type:'jpeg',
                quality:0.98
            },
            html2canvas:{
                scale:2
            },
            jsPDF:{
                unit:'mm',
                format:'a4',
                orientation:'portrait'
            }
        })
        .from(element)
        .save();

}
function exportPlayers(){

    const data =
        JSON.stringify(
            players,
            null,
            2
        );

    const blob =
        new Blob(
            [data],
            {
                type:
                "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href = url;

    a.download =
        "players.json";

    a.click();

}
function importPlayers(event){

    const file =
        event.target.files[0];

    if(!file) return;

    const reader =
        new FileReader();

    reader.onload =
        function(e){

            players =
                JSON.parse(
                    e.target.result
                );

            savePlayers();

            renderPlayers();

        };

    reader.readAsText(file);

}
