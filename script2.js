const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const endgameEl = document.getElementById("end-game-container");

let previousCorrectWordCount = 0;
let correctWordsCount = 0;
let previousCharCount = 0;
let totalCharCount = 0;
let startTime = 31;
let wrongCharCount = 0; // initialize to 0
let timer1;

quoteInputElement.addEventListener("input", () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll("span");
  const arrayValue = quoteInputElement.value.split("");
  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      if (!characterSpan.classList.contains("incorrect")) {
        characterSpan.classList.remove("correct");
        characterSpan.classList.add("incorrect");
        wrongCharCount = wrongCharCount + 1;
        console.log(wrongCharCount);
      }
      correct = false;
    }
  });
  totalCharCount = previousCharCount + arrayValue.length;
  let mergedInnerHTML = "";

  for (let i = 0; i < arrayQuote.length; i++) {
    if (arrayQuote[i].classList.contains("correct")) {
      mergedInnerHTML += arrayQuote[i].innerHTML;
    }
  }
  const correctWords = mergedInnerHTML.trim().split(" ");
  correctWordsCount = correctWords.length + previousCorrectWordCount;
  if (correct) {
    renderNewQuote();
    previousCorrectWordCount = correctWordsCount;
    console.log(previousCorrectWordCount);
    previousCharCount = arrayValue.length;
  };
});

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = "";
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
}

function startTimer() {
  timer1 = new Date();
  setInterval(() => {
    const remainingTime = getTimerTime();
    if (remainingTime >= 0) {
      timerElement.innerText = remainingTime;
    } else {
      clearInterval(timer1);
      gameOver();
    }
  }, 1000);
}
console.log(wrongCharCount);

function gameOver() {
  console.log(totalCharCount);
  console.log(wrongCharCount);
  let accuracy = (((totalCharCount - wrongCharCount) / totalCharCount) * 100).toFixed(2);

  endgameEl.innerHTML = `
    <h1 class="ranOut">Time ran out!</h1>
    <div class="flex">
    <p>Accuracy: ${accuracy}%&nbsp;&nbsp;</p>
    <p>Speed: ${(correctWordsCount/(startTime/60)).toFixed(1)} WPM</p>
    </div>
    <button class="buttonReload" onclick="location.reload()">Play Again</button>
  `;

  endgameEl.style.display = "flex";
  timerElement.style.display = "none";
  endgameEl.style.fontSize = "30px";
  endgameEl.style.borderRadius = "20px";
}
function getTimerTime() {
  const elapsedTime = Math.floor((new Date() - timer1) / 1000);
  const remainingTime = startTime - elapsedTime;
  return remainingTime;
}
renderNewQuote();
startTimer();