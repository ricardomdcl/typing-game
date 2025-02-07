import { wordList } from './wordsList.js';

const container = document.querySelector('.container');
const timer = document.querySelector('.timer');
const appContainer = document.querySelector('.app-container');

function startTimer() {
  let timerCount = 60;
  const timerInterval = setInterval(() => {
    timer.textContent = timerCount;
    timerCount--;
    if (timerCount === 0) clearInterval(timerInterval);
  }, 1000);
}

function getRandomWordList(wordList) {
  let randomWordList = [];
  let randomWord = '';
  for (let i = 0; i < 50; i++) {
    randomWord = wordList[Math.floor(Math.random() * wordList.length - 1) + 1];
    randomWordList.push(randomWord);
  }
  return randomWordList;
}

function makeWordElementList(randomWordList) {
  container.innerHTML = randomWordList
    .map(
      (word) =>
        `<span class="word">${word
          .split('')
          .map((char) => `<span class="char">${char}</span>`)
          .join('')}</span>`,
    )
    .join(' ');
}

function initGame() {
  const randomWordList = getRandomWordList(wordList);
  makeWordElementList(randomWordList);
  // startTimer();
}

initGame();


