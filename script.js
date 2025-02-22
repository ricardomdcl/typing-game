import { wordList } from './wordsList.js';

const container = document.querySelector('.container');
const timer = document.querySelector('.timer');
const appContainer = document.querySelector('.app-container');
const gameContainer = document.querySelector('.game-container');
const resultsContainer = document.querySelector('.results-container');
const resultWPM = document.querySelector('.result-wpm');
const resultAcc = document.querySelector('.result-acc');
const btnRestart = document.querySelector('.btn-restart');

appContainer.addEventListener('keydown', checkCorrectKeyPressed);
btnRestart.addEventListener('click', () => {
  initGame();
  startCaret();
});

function startTimer() {
  let timerCount = 60;
  const timerInterval = setInterval(() => {
    timer.textContent = timerCount;
    timerCount--;
    if (timerCount === 0) {
      getResultView();
      resultsContainer.style.display = 'flex';
      gameContainer.style.display = 'none';
      clearInterval(timerInterval);
    }
  }, 1000);
}

function getResultView() {
  const totalWords = gameContainer.querySelectorAll('.word');

  const { correctChars, wrongChars, completedWords } = [...totalWords].reduce(
    (acc, word) => {
      const correctChars = word.querySelectorAll('.correct');
      const wrongChars = word.querySelectorAll('.wrong');
      if (correctChars.length + wrongChars.length === word.childElementCount) acc.completedWords.push(word);
      if (correctChars.length) acc.correctChars.push([...correctChars]);
      if (wrongChars.length) acc.wrongChars.push([...correctChars]);
      return acc;
    },
    { correctChars: [], wrongChars: [], completedWords: [] },
  );
  const correctWordsPct = (correctChars.length * 100) / (correctChars.length + wrongChars.length);
  resultWPM.textContent = completedWords.length;
  resultAcc.textContent = correctWordsPct ? `${Math.floor(correctWordsPct)}%` : '0%';
}

function getRandomWordList(wordList) {
  let randomWordList = [];
  let randomWord = '';
  for (let i = 0; i < 100; i++) {
    randomWord = wordList[Math.floor(Math.random() * wordList.length - 1) + 1];
    randomWordList.push(randomWord);
  }
  return randomWordList;
}

function generateWordElementString(randomWordList) {
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

function startCaret() {
  const wordElementList = container.querySelectorAll('.word');
  const firstLetter = wordElementList[0].querySelector('.char');
  wordElementList[0].classList.add('active');
  firstLetter.classList.add('active');
}

function checkCorrectKeyPressed(event) {
  let currentWord = document.querySelector('.word.active');
  let currentChar = currentWord.querySelector('.active');
  let nextWord = currentWord.nextElementSibling;
  let nextChar = currentChar.nextElementSibling;

  if (event.key === 'Backspace') {
    let prevChar = currentChar.previousElementSibling;
    let prevWord = currentWord.previousElementSibling;

    if (prevChar && !nextChar && currentChar.classList.contains('last-char')) {
      currentChar.classList.remove('correct', 'wrong', 'last-char');
    } else if (prevChar) {
      currentChar.classList.remove('active', 'correct', 'wrong');
      prevChar.classList.remove('correct', 'wrong');
      prevChar.classList.add('active');
      currentChar = prevChar;
    } else if (!prevChar && prevWord && prevWord.querySelectorAll('.wrong').length) {
      currentWord.classList.remove('active');
      prevWord.classList.add('active');
      prevChar = prevWord.lastChild;
      currentChar.classList.remove('active');
      prevChar.classList.add('active', 'last-char');
    }

    return;
  }

  if (currentChar.classList.contains('last-char') && event.key !== ' ') return;

  if (currentChar.textContent === event.key && !currentChar.classList.contains('last-char')) {
    currentChar.classList.add('correct');
  } else if (!currentChar.classList.contains('last-char')) {
    currentChar.classList.add('wrong');
  }

  if (!nextChar && !nextWord) return;

  if (!nextChar && event.key === ' ') {
    nextChar = nextWord.querySelector('.char');
    currentWord.classList.remove('active');
    nextWord.classList.add('active');
  }
  if (!nextChar && !currentChar.classList.contains('last-char')) {
    currentChar.classList.add('last-char');
    return;
  }

  currentChar.classList.remove('active');
  nextChar.classList.add('active');
}

function initGame() {
  gameContainer.style.display = 'flex';
  resultsContainer.style.display = 'none';
  appContainer.focus();
  const randomWordList = getRandomWordList(wordList);
  generateWordElementString(randomWordList);
  startCaret();

  startTimer();
}
initGame();
