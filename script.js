const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endgameEl = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");

// Init word
let randomWord;
// Init score
let score = 0;
// Initial Speed
let speed = 0;
// Init time
let time = 10;
// const fetchWords = async () => {
//   const response = await fetch(
//     "https://random-word-api.herokuapp.com/word?number=500"
//   );
//   return await response.json();
// };

// let allWords = [];
// (async () => {
//   allWords = await fetchWords();
// })();

// const getRandomWordByLength = (wordLength) => {
//   const filteredWords = allWords.filter((word) => word.length === wordLength);
//   const randomIndex = Math.floor(Math.random() * filteredWords.length);
//   return filteredWords[randomIndex];
// };
// Set difficulty to value in ls or medium
let difficulty =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "medium";

// Set difficulty select value
difficultySelect.value =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "medium";

// Focus on text on start
text.focus();
// Generate random word from API
async function getRandomWord(level) {
  let wordLength;
  if (level == "medium") {
    wordLength = Math.floor(Math.random() * 2) + 6;
  } else if (level == "hard") {
    wordLength = Math.floor(Math.random() * 4) + 6;
  } else {
    if (score >= 5) {
      wordLength = Math.floor(Math.random() * 2) + 4;
    } else {
      wordLength = Math.floor(Math.random() * 3) + 2;
    }
  }
  const response = await fetch(
    `https://random-word-api.herokuapp.com/word?length=${wordLength}`
  );
  const data = await response.json();
  if (data[0] != undefined || data[0] != null) {
    setInterval(updateTime, 1000);
  }
  return data[0];
}

// Add word to DOM
async function addWordToDOM() {
  let difficulty = localStorage.getItem('difficulty');
  let randomWord = await getRandomWord(difficulty);
  word.innerHTML = "";
  Array.from(randomWord).forEach(function (character) {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    console.log(character);
    word.appendChild(characterSpan);
  });
  text.value = null;
}

// Update score
function updateScore() {
  score++;
  scoreEl.innerHTML = score;
}

// Update time
function updateTime() {
  time--;
  timeEl.innerHTML = time + "s";

  if (time === 0) {
    clearInterval(setInterval(updateTime, 1000));
    // end game
    gameOver();
  }
}

// Game over, show end screen
function gameOver() {
  endgameEl.innerHTML = `
    <h1 class="ranOut">Time ran out!</h1>
    <div class="flex">
    <p>Final Score: ${score}&nbsp;&nbsp;</p>
    <p>Speed: ${speed} WPM</p>
    </div>
    <button class="buttonReload" onclick="location.reload()">Play Again</button>
  `;

  endgameEl.style.display = "flex";
  endgameEl.style.fontSize = "20px";
  endgameEl.style.borderRadius = "20px";
}

addWordToDOM();

// Typing
text.addEventListener("input", (e) => {
  const arrayValue = e.target.value;
  const arrayWord = word.querySelectorAll("span");
  let correct = true;
  arrayWord.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });

  if (correct) {
    addWordToDOM();
    updateScore();
    if (difficulty === "hard") {
      time += 2;
    } else if (difficulty === "medium") {
      time += 3;
    } else {
      time += 5;
    }
    speed = Math.floor(Math.random() * 10) + 30;
  }
});
// Settings btn click
settingsBtn.addEventListener("click", () => settings.classList.toggle("hide"));
// Settings select
settingsForm.addEventListener("change", (e) => {
  difficulty = e.target.value;
  localStorage.setItem("difficulty", difficulty);
  location.reload()
});
