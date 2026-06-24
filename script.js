// ======================================
// SCREENS
// ======================================
const togetherBtn =
document.getElementById(
"togetherBtn"
);

const togetherScreen =
document.getElementById(
"togetherScreen"
);

const togetherText =
document.getElementById(
"togetherText"
);

const finalBackBtn =
document.getElementById(
"finalBackBtn"
);

const nameScreen =
document.getElementById("nameScreen");

const selectionScreen =
document.getElementById("selectionScreen");

const gameScreen =
document.getElementById("gameScreen");

const levelPopup =
document.getElementById("levelPopup");

// ======================================
// INPUTS
// ======================================

const playerNameInput =
document.getElementById("playerName");

const startBtn =
document.getElementById("startBtn");

// ======================================
// CHARACTER SELECTION
// ======================================

const omnitrix =
document.getElementById("omnitrix");

const characterImage =
document.getElementById("characterImage");

const characterName =
document.getElementById("characterName");

const selectCharacterBtn =
document.getElementById("selectCharacterBtn");

// ======================================
// VARIABLES
// ======================================

let playerName = "";

let selectedPokemon = null;

let selectedPokemonId = null;

// ======================================
// LOAD SAVED NAME
// ======================================

window.addEventListener(
"load",
()=>{

    const savedName =
    localStorage.getItem(
        "playerName"
    );

    if(savedName){

        playerNameInput.value =
        savedName;

    }

}
);

// ======================================
// START BUTTON
// ======================================

startBtn.addEventListener(
"click",
()=>{

    const name =
    playerNameInput.value.trim();

    if(name === ""){

        alert(
        "Please enter your name 💙"
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

}
);

// ======================================
// RANDOM POKEMON LOAD
// ======================================

async function loadRandomPokemon(){

    try{

        const randomId =

        Math.floor(
            Math.random() * 151
        ) + 1;

        const response =
        await fetch(

        `https://pokeapi.co/api/v2/pokemon/${randomId}`

        );

        const data =
        await response.json();

        selectedPokemon =
        data;

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

        console.log(
        "Pokemon Load Error",
        error
        );

    }

}

// ======================================
// OMNITRIX CLICK
// ======================================

omnitrix.addEventListener(
"click",
()=>{

    loadRandomPokemon();

}
);

// ======================================
// SAVE CHARACTER
// ======================================

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

    loadPlayer();

    startGame();

}
);

// ======================================
// GET SAVED CHARACTER
// ======================================

function getSavedPokemon(){

    return JSON.parse(

        localStorage.getItem(
            "selectedPokemon"
        )

    );

}


// ======================================
// PLAYER OBJECT
// ======================================

const player = {

    x:180,
    y:560,

    width:70,
    height:70,

    speed:6,

    image:null

};

// ======================================
// LOAD PLAYER IMAGE
// ======================================

function loadPlayer(){

    const pokemon =
    getSavedPokemon();

    if(!pokemon)
    return;

    player.image =
    new Image();

    player.image.src =

    pokemon.sprites.other[
    "official-artwork"
    ].front_default;

}

// ======================================
// GAME ELEMENTS
// ======================================

const canvas =
document.getElementById(
"gameCanvas"
);

const ctx =
canvas.getContext("2d");

const leftBtn =
document.getElementById(
"leftBtn"
);

const rightBtn =
document.getElementById(
"rightBtn"
);

const shootBtn =
document.getElementById(
"shootBtn"
);

const scoreText =
document.getElementById(
"scoreText"
);

// ======================================
// GAME VARIABLES
// ======================================

let gameRunning = false;

let score = 0;

let enemySpeed = 1.5;

let enemiesKilled = 0;

let bullets = [];

let enemies = [];

let moveLeft = false;

let moveRight = false;

// ======================================
// START GAME
// ======================================

function startGame(){

    gameRunning = true;

    score = 0;

    enemiesKilled = 0;

    bullets = [];

    enemies = [];

    scoreText.textContent = "0";

    spawnEnemy();

    gameLoop();

}

// ======================================
// DRAW PLAYER
// ======================================

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

// ======================================
// SHOOT
// ======================================

function shoot(){

    bullets.push({

        x:
        player.x + 30,

        y:
        player.y,

        width:8,

        height:20

    });

}

// ======================================
// DRAW BULLETS
// ======================================

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

        if(
            bullet.y < 0
        ){

            bullets.splice(
                index,
                1
            );

        }

    });

}

// ======================================
// SPAWN ENEMY
// ======================================

function spawnEnemy(){

    if(
        enemies.length > 0
    ) return;

    enemies.push({

        x:
        Math.random() *
        (canvas.width - 60),

        y:-70,

        width:60,

        height:60

    });

}

// ======================================
// DRAW ENEMIES
// ======================================

function drawEnemies(){

    ctx.fillStyle =
    "#ef4444";

    enemies.forEach(
    (enemy,index)=>{

        enemy.y +=
        enemySpeed;

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

// ======================================
// COLLISION DETECTION
// ======================================

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

                // Mission Complete

                if(
                    enemiesKilled >= 5
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

// ======================================
// LEVEL COMPLETE
// ======================================

function levelComplete(){

    gameRunning = false;

    levelPopup.classList.add(
        "active"
    );

}

// ======================================
// GAME LOOP
// ======================================

function gameLoop(){

    if(
        !gameRunning
    ) return;

    ctx.clearRect(

        0,
        0,

        canvas.width,
        canvas.height

    );

    // Move Player

    if(moveLeft){

        player.x -=
        player.speed;

    }

    if(moveRight){

        player.x +=
        player.speed;

    }

    // Boundary

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

// ======================================
// MOBILE CONTROLS
// ======================================

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

// ======================================
// KEYBOARD SUPPORT
// ======================================

document.addEventListener(
"keydown",
(e)=>{

    if(
        e.key ===
        "ArrowLeft"
    ){

        moveLeft = true;

    }

    if(
        e.key ===
        "ArrowRight"
    ){

        moveRight = true;

    }

    if(
        e.code ===
        "Space"
    ){

        shoot();

    }

});

document.addEventListener(
"keyup",
(e)=>{

    if(
        e.key ===
        "ArrowLeft"
    ){

        moveLeft = false;

    }

    if(
        e.key ===
        "ArrowRight"
    ){

        moveRight = false;

    }

});

// ======================================
// STORY ELEMENTS
// ======================================

const claimRewardBtn =
document.getElementById(
"claimRewardBtn"
);

const storyScreen =
document.getElementById(
"storyScreen"
);

const missScreen =
document.getElementById(
"missScreen"
);

const loveScreen =
document.getElementById(
"loveScreen"
);

const pandaScreen =
document.getElementById(
"pandaScreen"
);

const storyText =
document.getElementById(
"storyText"
);

const missBtn =
document.getElementById(
"missBtn"
);

const loveBtn =
document.getElementById(
"loveBtn"
);

const specialBtn =
document.getElementById(
"specialBtn"
);

const backBtn =
document.getElementById(
"backBtn"
);

const counter =
document.getElementById(
"counter"
);

const teddyImg =
document.getElementById(
"teddyImg"
);

const pandaImg =
document.getElementById(
"pandaImg"
);

const finalMsg =
document.getElementById(
"finalMsg"
);

const bgMusic =
document.getElementById(
"bgMusic"
);

// ======================================
// 100 LOVE MESSAGES
// ======================================

const loveMessages = [];

for(
let i = 1;
i <= 100;
i++
){

loveMessages.push(

` {name},

Since the day you entered my life, everything started feeling a little brighter.

`

);

}

// ======================================
// CLAIM REWARD
// ======================================

claimRewardBtn.addEventListener(
"click",
()=>{

levelPopup.classList.remove(
"active"
);

startStory();

}
);

// ======================================
// STORY START
// ======================================
function startStory() {

  gameScreen.classList.remove("active");
  storyScreen.classList.add("active");

  const name =
    localStorage.getItem("playerName") || "Pookie";

  const randomMessage =
    loveMessages[
      Math.floor(Math.random() * loveMessages.length)
    ];

  const msg =
    randomMessage.replace("{name}", name);

  let i = 0;
  storyText.innerHTML = "";

  let interval = setInterval(() => {

    storyText.innerHTML += msg.charAt(i);

    i++;

    if(i >= msg.length){

      clearInterval(interval);

      missBtn.style.display = "block";
    }

  }, 60); // slow cinematic typing

}

// ======================================
// MISS YOU SCREEN
// ======================================

missBtn.addEventListener(
"click",
()=>{

storyScreen.classList.remove(
"active"
);

missScreen.classList.add(
"active"
);

// TEDDY IMAGE

teddyImg.src =
"teddy.png";

teddyImg.style.display =
"block";

let count = 0;

const counterInterval =
setInterval(()=>{

count += Math.floor(
Math.random() * 5000000
);

if(
count >= 1000000000
){

counter.innerText = "∞";

clearInterval(
counterInterval
);

}

else{

counter.innerText =

count.toLocaleString();

}

},30);

}
);

// ======================================
// LOVE SCREEN
// ======================================

loveBtn.addEventListener(
"click",
()=>{

missScreen.classList.remove(
"active"
);

loveScreen.classList.add(
"active"
);

}
);
togetherBtn.addEventListener(
"click",
()=>{

    pandaScreen.classList.remove(
    "active"
    );

    togetherScreen.classList.add(
    "active"
    );

    startTogetherStory();

}
);
// ======================================
// PANDA SCREEN
// ======================================

specialBtn.addEventListener(
"click",
()=>{

loveScreen.classList.remove(
"active"
);

pandaScreen.classList.add(
"active"
);

// PANDA IMAGE

pandaImg.src =
"heart.jpg";

pandaImg.style.display =
"block";

// FINAL MESSAGE

finalMsg.innerHTML =

`${playerName},

Thank you for being a beautiful part of my life.

Some people enter our lives and leave memories.

Some people enter our lives and change everything.

You belong to the second category.

Your smile, your kindness, your presence and the happiness you bring are truly special.

No matter what happens in life, I will always be grateful that our paths crossed.

Thank you for existing.

Thank you for being you.

💙`;

}
);

// ======================================
// BACK TO GAME
// ======================================

// ==========================
// TOGETHER STORY
// ==========================

function startTogetherStory(){

    const togetherText =
    document.getElementById("togetherText");

    const messages = [

`Every beautiful memory starts with a simple moment.

I never knew that someone could become so important without even trying.

Some people enter our lives and leave memories.

But some people enter our hearts and stay there forever.

You became one of those special people for me.

Thank you for every smile, every conversation and every moment.

No matter where life takes us, these memories will always remain special. 💙`,

`Life is full of thousands of people.

Yet somehow there are only a few who make everything feel different.

Your presence brings comfort, happiness and peace.

You may never realize how much your smile can brighten someone's day.

Thank you for being part of my story.

You are truly special and always will be. ✨`

    ];

    const randomMessage =
    messages[
        Math.floor(
            Math.random() *
            messages.length
        )
    ];

    togetherText.innerHTML = "";

    let i = 0;

    const typing = setInterval(()=>{

        togetherText.innerHTML +=
        randomMessage.charAt(i);

        i++;

        if(i >= randomMessage.length){

            clearInterval(typing);

        }

    },50);

}


backBtn.addEventListener(
"click",
()=>{

pandaScreen.classList.remove(
"active"
);

selectionScreen.classList.add(
"active"
);

score = 0;

enemiesKilled = 0;

bullets = [];

enemies = [];

scoreText.textContent =
"0";

}
); 
