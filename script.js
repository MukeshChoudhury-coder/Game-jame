// ==========================
// SCREENS
// ==========================

const nameScreen =
document.getElementById("nameScreen");

const selectionScreen =
document.getElementById("selectionScreen");

const gameScreen =
document.getElementById("gameScreen");

// ==========================
// INPUTS
// ==========================

const playerNameInput =
document.getElementById("playerName");

const startBtn =
document.getElementById("startBtn");

// ==========================
// CHARACTER SELECT
// ==========================

const omnitrix =
document.getElementById("omnitrix");

const characterImage =
document.getElementById("characterImage");

const characterName =
document.getElementById("characterName");

const selectCharacterBtn =
document.getElementById("selectCharacterBtn");

// ==========================
// VARIABLES
// ==========================

let playerName = "";

let selectedPokemon = null;

let selectedPokemonId = null;

// ==========================
// LOAD SAVED NAME
// ==========================

window.addEventListener("load",()=>{

    const savedName =
    localStorage.getItem("playerName");

    if(savedName){

        playerNameInput.value =
        savedName;

    }

});

// ==========================
// START GAME BUTTON
// ==========================

startBtn.addEventListener(
"click",
()=>{

    const name =
    playerNameInput.value.trim();

    if(name === ""){

        alert(
        "Enter your name first 💙"
        );

        return;

    }

    playerName = name;

    localStorage.setItem(
        "playerName",
        playerName
    );

    nameScreen.classList.remove(
        "active"
    );

    selectionScreen.classList.add(
        "active"
    );

});

// ==========================
// LOAD RANDOM POKEMON
// ==========================

async function loadRandomPokemon(){

    try{

        const randomId =

        Math.floor(
            Math.random()*151
        ) + 1;

        const response =
        await fetch(

        `https://pokeapi.co/api/v2/pokemon/${randomId}`

        );

        const data =
        await response.json();

        selectedPokemon = data;

        selectedPokemonId =
        data.id;

        characterImage.src =

        data.sprites.other[
        "official-artwork"
        ].front_default;

        characterName.textContent =

        data.name.toUpperCase();

    }

    catch(error){

        console.log(error);

    }

}

// ==========================
// OMNITRIX CLICK
// ==========================

omnitrix.addEventListener(
"click",
()=>{

    loadRandomPokemon();

});

// ==========================
// SELECT CHARACTER
// ==========================

selectCharacterBtn.addEventListener(
"click",
()=>{

    if(!selectedPokemon){

        alert(
        "Choose a character first ⚡"
        );

        return;

    }

    localStorage.setItem(

        "selectedPokemon",

        JSON.stringify(
            selectedPokemon
        )

    );

    selectionScreen.classList.remove(
        "active"
    );

    gameScreen.classList.add(
        "active"
    );

});

// ==========================
// HELPER
// ==========================

function getSavedPokemon(){

    return JSON.parse(

        localStorage.getItem(
            "selectedPokemon"
        )

    );

} 
// ==========================
// GAME ELEMENTS
// ==========================

const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");

const leftBtn =
document.getElementById("leftBtn");

const rightBtn =
document.getElementById("rightBtn");

const shootBtn =
document.getElementById("shootBtn");

const levelText =
document.getElementById("levelText");

const scoreText =
document.getElementById("scoreText");

const gameOmnitrix =
document.getElementById("gameOmnitrix");

const omnitrixMessage =
document.getElementById("omnitrixMessage");

const levelPopup =
document.getElementById("levelPopup");

// ==========================
// GAME VARIABLES
// ==========================

let currentLevel = 1;

let score = 0;

let enemiesKilled = 0;

let enemySpeed = 1.5;

let gameRunning = false;

let bullets = [];

let enemies = [];

let moveLeft = false;
let moveRight = false;

let omnitrixReady = false;

// ==========================
// PLAYER
// ==========================

const player = {

    x:180,
    y:560,

    width:70,
    height:70,

    speed:6,

    image:null

};

// ==========================
// LOAD PLAYER
// ==========================

function loadPlayer(){

    const pokemon =
    getSavedPokemon();

    if(!pokemon) return;

    player.image =
    new Image();

    player.image.src =

    pokemon.sprites.other[
    "official-artwork"
    ].front_default;

}

// ==========================
// START GAME
// ==========================

selectCharacterBtn.addEventListener(
"click",
()=>{

    loadPlayer();

    startGame();

});

// ==========================
// START GAME
// ==========================

function startGame(){

    gameRunning = true;

    spawnEnemy();

    startOmnitrixReload();

    gameLoop();

}

// ==========================
// DRAW PLAYER
// ==========================

function drawPlayer(){

    if(player.image){

        ctx.drawImage(

            player.image,

            player.x,
            player.y,

            player.width,
            player.height

        );

    }

}

// ==========================
// BULLETS
// ==========================

function shoot(){

    bullets.push({

        x:player.x + 30,

        y:player.y,

        width:8,

        height:20

    });

}

function drawBullets(){

    ctx.fillStyle =
    "#38bdf8";

    bullets.forEach(
    (bullet,index)=>{

        bullet.y -= 10;

        ctx.fillRect(

            bullet.x,
            bullet.y,

            bullet.width,
            bullet.height

        );

        if(bullet.y < 0){

            bullets.splice(
                index,
                1
            );

        }

    });

}

// ==========================
// SINGLE ENEMY
// ==========================

function spawnEnemy(){

    if(enemies.length > 0)
    return;

    enemies.push({

        x:
        Math.random() *
        (canvas.width - 60),

        y:-70,

        width:60,

        height:60

    });

}

// ==========================
// DRAW ENEMY
// ==========================

function drawEnemies(){

    ctx.fillStyle =
    "#ef4444";

    enemies.forEach(
    (enemy,index)=>{

        enemy.y += enemySpeed;

        ctx.fillRect(

            enemy.x,
            enemy.y,

            enemy.width,
            enemy.height

        );

        if(
            enemy.y >
            canvas.height
        ){

            enemy.y = -70;

        }

    });

}

// ==========================
// COLLISION
// ==========================

function checkCollision(){

    bullets.forEach(
    (bullet,bIndex)=>{

        enemies.forEach(
        (enemy,eIndex)=>{

            if(

                bullet.x <
                enemy.x +
                enemy.width &&

                bullet.x +
                bullet.width >
                enemy.x &&

                bullet.y <
                enemy.y +
                enemy.height &&

                bullet.y +
                bullet.height >
                enemy.y

            ){

                bullets.splice(
                    bIndex,
                    1
                );

                enemies.splice(
                    eIndex,
                    1
                );

                score++;

                enemiesKilled++;

                scoreText.textContent =
                score;

                if(
                    enemiesKilled >= 2
                ){

                    levelComplete();

                }

                else{

                    spawnEnemy();

                }

            }

        });

    });

}

// ==========================
// LEVEL COMPLETE
// ==========================

function levelComplete(){

    gameRunning = false;

    levelPopup.classList.add(
        "active"
    );

}

// ==========================
// GAME LOOP
// ==========================

function gameLoop(){

    if(!gameRunning)
    return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if(moveLeft){

        player.x -=
        player.speed;

    }

    if(moveRight){

        player.x +=
        player.speed;

    }

    if(player.x < 0){

        player.x = 0;

    }

    if(
        player.x >
        canvas.width -
        player.width
    ){

        player.x =
        canvas.width -
        player.width;

    }

    drawPlayer();

    drawBullets();

    drawEnemies();

    checkCollision();

    requestAnimationFrame(
        gameLoop
    );

}

// ==========================
// MOBILE CONTROLS
// ==========================

leftBtn.addEventListener(
"touchstart",
()=>{

    moveLeft = true;

});

leftBtn.addEventListener(
"touchend",
()=>{

    moveLeft = false;

});

rightBtn.addEventListener(
"touchstart",
()=>{

    moveRight = true;

});

rightBtn.addEventListener(
"touchend",
()=>{

    moveRight = false;

});

shootBtn.addEventListener(
"click",
shoot
);

// ==========================
// KEYBOARD
// ==========================

document.addEventListener(
"keydown",
(e)=>{

    if(e.key==="ArrowLeft")
    moveLeft=true;

    if(e.key==="ArrowRight")
    moveRight=true;

    if(e.code==="Space")
    shoot();

});

document.addEventListener(
"keyup",
(e)=>{

    if(e.key==="ArrowLeft")
    moveLeft=false;

    if(e.key==="ArrowRight")
    moveRight=false;

});

// ==========================
// OMNITRIX RELOAD
// ==========================

function startOmnitrixReload(){

    setInterval(()=>{

        omnitrixReady = true;

        omnitrixMessage.style.display =
        "block";

        omnitrixMessage.innerText =

        "⚡ Select Your Character";

        setTimeout(()=>{

            omnitrixMessage.style.display =
            "none";

        },2000);

    },3000);

}

// ==========================
// CHANGE CHARACTER
// ==========================

gameOmnitrix.addEventListener(
"click",
async()=>{

    if(!omnitrixReady)
    return;

    omnitrixReady = false;

    await loadRandomPokemon();

    player.image =
    new Image();

    player.image.src =

    selectedPokemon.sprites.other[
    "official-artwork"
    ].front_default;

});
// ==========================
// REWARD ELEMENTS
// ==========================

const claimRewardBtn =
document.getElementById("claimRewardBtn");

const rewardScreen =
document.getElementById("rewardScreen");

const rewardBoxes =
document.querySelectorAll(".rewardBox");

const rewardPokemon =
document.getElementById("rewardPokemon");

const complimentText =
document.getElementById("complimentText");

const playAgainBtn =
document.getElementById("playAgainBtn");

// ==========================
// COMPLIMENT GENERATOR
// ==========================

const starters = [
/*"your smile",
"your kindness",
"your energy",
"your personality",
"your laugh",
"your positivity",
"your confidence",
"your vibe",
"your caring nature",
"your presence"*/

"gulab phool, genda phool"
];

const middles = [
/*"lights up every room",
"makes people smile",
"creates beautiful memories",
"makes life brighter",
"brings happiness",
"feels magical",
"spreads positivity",
"makes hearts happy",
"makes everything better",
"is truly special"*/

"all i want to say maan jao meri beautiful ❤️"
];

const endings = [
/*"every single day 💖",
"wherever you go ✨",
"in the cutest way possible 🧸",
"without even trying 🌸",
"and everyone notices it 💫",
"like pure sunshine ☀️",
"more than you realize ❤️",
"and that's amazing 🌟",
"like a real pookie 🐻",
"all the time 💙"
*/
" tum jitna karo gi gussa mai utna manaunga,  kuch bhi ho jaye tumko chor ke kabhi nhi jaunga 😌?"  
];

function generateCompliment(){

    const name =
    localStorage.getItem("playerName")
    || "Pookie";

    const s =
    starters[
        Math.floor(
            Math.random() *
            starters.length
        )
    ];

    const m =
    middles[
        Math.floor(
            Math.random() *
            middles.length
        )
    ];

    const e =
    endings[
        Math.floor(
            Math.random() *
            endings.length
        )
    ];

    return `${name}, ${s} ${m} ${e}`;
}

// ==========================
// CLAIM REWARD
// ==========================

claimRewardBtn.addEventListener(
"click",
()=>{

    levelPopup.classList.remove(
        "active"
    );

    gameScreen.classList.remove(
        "active"
    );

    rewardScreen.classList.add(
        "active"
    );

});

// ==========================
// RANDOM CUTE POKEMON
// ==========================

async function loadRewardPokemon(){

    const cutePokemon = [

        25,   // Pikachu
        133,  // Eevee
        39,   // Jigglypuff
        172,  // Pichu
        175,  // Togepi
        151,  // Mew
        37,   // Vulpix
        35    // Clefairy

    ];

    const randomId =

    cutePokemon[
        Math.floor(
            Math.random() *
            cutePokemon.length
        )
    ];

    const response =
    await fetch(
    `https://pokeapi.co/api/v2/pokemon/${randomId}`
    );

    const data =
    await response.json();

    rewardPokemon.src =

    data.sprites.other[
    "official-artwork"
    ].front_default;

}

// ==========================
// OPEN BOX
// ==========================

rewardBoxes.forEach(box=>{

    box.addEventListener(
    "click",
    async ()=>{

        rewardBoxes.forEach(
        b=>{

            b.style.pointerEvents =
            "none";

        });

        await loadRewardPokemon();

        rewardPokemon.style.display =
        "block";

        complimentText.textContent =
        generateCompliment();

        playAgainBtn.style.display =
        "inline-block";

        box.innerHTML = "🎉";

    });

});

// ==========================
// PLAY AGAIN
// ==========================

playAgainBtn.addEventListener(
"click",
()=>{

    currentLevel++;

    localStorage.setItem(
        "highestLevel",
        currentLevel
    );

    levelText.textContent =
    currentLevel;

    enemySpeed += 0.2;

    enemiesKilled = 0;

    bullets = [];

    enemies = [];

    scoreText.textContent =
    score;

    rewardPokemon.style.display =
    "none";

    complimentText.textContent =
    "";

    playAgainBtn.style.display =
    "none";

    rewardBoxes.forEach(box=>{

        box.innerHTML = "📦";

        box.style.pointerEvents =
        "auto";

    });

    rewardScreen.classList.remove(
        "active"
    );

    gameScreen.classList.add(
        "active"
    );

    gameRunning = true;

    spawnEnemy();

    gameLoop();

});

// ==========================
// LOAD SAVED LEVEL
// ==========================

window.addEventListener(
"load",
()=>{

    const savedLevel =
    localStorage.getItem(
        "highestLevel"
    );

    if(savedLevel){

        currentLevel =
        Number(savedLevel);

        levelText.textContent =
        currentLevel;

    }

});
