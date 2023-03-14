const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const endgameEl = document.getElementById("end-game-container");

quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span')
  const arrayValue = quoteInputElement.value.split('')

  let correct = true
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index]
    if (character == null) {
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
      correct = false
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    } else {
      characterSpan.classList.remove('correct')
      characterSpan.classList.add('incorrect')
      correct = false
    }
  })

  if (correct) renderNewQuote()
})

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}

async function renderNewQuote() {
  const quote = await getRandomQuote()
  quoteDisplayElement.innerHTML = ''
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    quoteDisplayElement.appendChild(characterSpan)
  })
  quoteInputElement.value = null
  startTimer()
}

let startTime = 30;
let timer1;
function startTimer() {
  timerElement.innerText = startTime;
   timer1 = new Date()
  setInterval(() => {
    timer.innerText = getTimerTime();
  }, 1000)
}

// Game over, show end screen
function gameOver() {
  endgameEl.innerHTML = `
    <h1 class="ranOut">Time ran out!</h1>
    <div class="flex">
    <p>Final Score: 0&nbsp;&nbsp;</p>
    <p>Speed: 0 WPM</p>
    </div>
    <button class="buttonReload" onclick="location.reload()">Play Again</button>
  `;

  endgameEl.style.display = "flex";
  timerElement.style.display = "none";
  endgameEl.style.fontSize = "30px";
  endgameEl.style.borderRadius = "20px";
}

function getTimerTime() {
  let currentTimer = startTime - Math.floor(((new Date() - timer1) / 1000))
  if(currentTimer === 0 ){
    clearInterval(setInterval(getTimerTime, 1000));
    gameOver();
  }
  return currentTimer;
}

renderNewQuote()