"use strict";

const SCORE_STORAGE_KEY = "matematicki-klub-high-scores-v1";
const MAX_SCORES = 10;
const ROUND_MS = 30000;
const MATCH_COUNT = 10;
const POINTS_CORRECT = 5;
const POINTS_WRONG = 3;
const SVG_NS = "http://www.w3.org/2000/svg";

const DIFFICULTIES = { lako: "Lako", srednje: "Srednje", tesko: "Teško" };

const LETTER_PAIRS = [
  ["А", "A"], ["Б", "B"], ["В", "V"], ["Г", "G"], ["Д", "D"], ["Ђ", "Đ"], ["Е", "E"],
  ["Ж", "Ž"], ["З", "Z"], ["И", "I"], ["Ј", "J"], ["К", "K"], ["Л", "L"], ["Љ", "Lj"],
  ["М", "M"], ["Н", "N"], ["Њ", "Nj"], ["О", "O"], ["П", "P"], ["Р", "R"], ["С", "S"],
  ["Т", "T"], ["Ћ", "Ć"], ["У", "U"], ["Ф", "F"], ["Х", "H"], ["Ц", "C"], ["Ч", "Č"],
  ["Џ", "Dž"], ["Ш", "Š"]
].map(([cyrillic, latin]) => ({ cyrillic, latin }));

const EASY_LATIN = ["A", "B", "V", "G", "D", "E", "Z", "I", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U"];
const HARD_LATIN = ["Đ", "Ž", "J", "Lj", "Nj", "Ć", "F", "H", "C", "Č", "Dž", "Š"];

const GAMES = {
  mnozenje: {
    name: "Tablica množenja",
    hints: {
      lako: "Množenje brojeva od 1 do 5",
      srednje: "Množenje brojeva od 1 do 9",
      tesko: "Množenje brojeva od 6 do 9, a ponuđeni odgovori su bliski"
    },
    correctLabel: "Tačni odgovori",
    wrongLabel: "Netačni odgovori",
    rules: (difficulty) => [
      ["⏱️", "Vreme igre:", "30 sekundi"],
      ["⭐", "Tačan odgovor:", `+${POINTS_CORRECT} poena`, "plus"],
      ["❌", "Netačan odgovor:", `−${POINTS_WRONG} poena`, "minus"],
      ["🔢", "Izaberi jedan od", "4 odgovora"],
      ["🎯", "Težina:", DIFFICULTIES[difficulty]]
    ]
  },
  spojnice: {
    name: "Spojnice",
    hints: {
      lako: "Slova koja se lako prepoznaju",
      srednje: "Sva slova azbuke",
      tesko: "Teška slova: Ђ, Ж, Љ, Њ, Ћ, Џ, Ш…"
    },
    correctLabel: "Tačni parovi",
    wrongLabel: "Netačni parovi",
    rules: (difficulty) => [
      ["🔤", "Spoji:", "10 ćiriličnih slova sa latiničnim"],
      ["⭐", "Tačan par:", `+${POINTS_CORRECT} poena`, "plus"],
      ["❌", "Netačan par:", `−${POINTS_WRONG} poena`, "minus"],
      ["✅", "Kad završiš, pritisni", "Gotovo"],
      ["🎯", "Težina:", DIFFICULTIES[difficulty]]
    ]
  }
};

const screens = {
  home: document.querySelector("#home-screen"),
  ready: document.querySelector("#ready-screen"),
  game: document.querySelector("#game-screen"),
  match: document.querySelector("#match-screen"),
  results: document.querySelector("#results-screen"),
  scores: document.querySelector("#scores-screen")
};
const nameInput = document.querySelector("#player-name");
const answerButtons = Array.from(document.querySelectorAll(".answer-button"));

const selection = { grade: null, subject: null, game: "mnozenje", difficulty: "srednje" };
const rankFilter = { game: "mnozenje", difficulty: "srednje" };

let game = null;
let match = null;
let timerInterval = null;
let feedbackTimeout = null;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const otherIndex = randomInt(0, index);
    [result[index], result[otherIndex]] = [result[otherIndex], result[index]];
  }
  return result;
}

function showScreen(screenName) {
  Object.entries(screens).forEach(([name, element]) => {
    element.hidden = name !== screenName;
  });
  window.scrollTo(0, 0);
  if (screenName === "match") window.requestAnimationFrame(drawMatchLines);
}

function stopTimers() {
  window.clearInterval(timerInterval);
  window.clearTimeout(feedbackTimeout);
  timerInterval = null;
  feedbackTimeout = null;
}

/* Glavni meni */

function markSelected(container, attribute, value) {
  container.querySelectorAll(`[${attribute}]`).forEach((button) => {
    const isSelected = button.getAttribute(attribute) === value;
    button.classList.toggle("is-selected", isSelected);
    if (button.hasAttribute("aria-checked")) button.setAttribute("aria-checked", String(isSelected));
  });
}

function renderMenuSelection() {
  document.querySelectorAll("[data-subject-game]").forEach((card) => {
    card.hidden = card.dataset.subjectGame !== selection.subject;
  });
  markSelected(document.querySelector("#game-picker"), "data-game", selection.game);
  markSelected(document.querySelector("#difficulty-picker"), "data-difficulty", selection.difficulty);
  document.querySelector("#difficulty-hint").textContent = GAMES[selection.game].hints[selection.difficulty];
  document.querySelectorAll("#subject-picker [data-subject]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.subject === selection.subject);
  });
}

function showMenuStep(step) {
  ["grade", "subject", "game"].forEach((name) => {
    document.querySelector(`#${name}-step`).hidden = name !== step;
  });
  document.querySelector("#start-button").hidden = step !== "game";
}

function renderReadyScreen() {
  const config = GAMES[selection.game];
  document.querySelector("#ready-game-name").textContent = config.name;
  const board = document.querySelector("#rules-board");
  board.replaceChildren();
  config.rules(selection.difficulty).forEach(([emoji, label, value, tone]) => {
    const row = document.createElement("p");
    const icon = document.createElement("span");
    icon.className = "rule-emoji";
    icon.textContent = emoji;
    const text = document.createElement("span");
    text.append(`${label} `);
    const strong = document.createElement("strong");
    if (tone) strong.className = tone;
    strong.textContent = value;
    text.append(strong);
    row.append(icon, text);
    board.append(row);
  });
  showScreen("ready");
}

function newGameState() {
  const playerName = nameInput.value.trim().slice(0, 18) || "Igrač";
  nameInput.value = playerName;
  return {
    gameId: selection.game,
    difficulty: selection.difficulty,
    playerName,
    score: 0,
    correct: 0,
    wrong: 0,
    total: 0,
    currentQuestion: null,
    deadline: 0,
    savedDate: null,
    scores: []
  };
}

function startSelectedGame() {
  stopTimers();
  if (selection.game === "spojnice") startMatchGame();
  else startMultiplicationGame();
}

/* Tablica množenja */

function makeQuestion(difficulty) {
  const [min, max] = difficulty === "lako" ? [1, 5] : difficulty === "tesko" ? [6, 9] : [1, 9];
  const first = randomInt(min, max);
  const second = randomInt(min, max);
  const correctAnswer = first * second;
  const answers = new Set([correctAnswer]);

  if (difficulty === "tesko") {
    const nearby = [
      first * (second + 1), first * (second - 1), (first + 1) * second, (first - 1) * second,
      correctAnswer + 1, correctAnswer - 1, correctAnswer + 2, correctAnswer - 2,
      correctAnswer + 10, correctAnswer - 10
    ];
    shuffle(nearby).forEach((candidate) => {
      if (answers.size < 4 && candidate > 0) answers.add(candidate);
    });
  }

  const poolMax = difficulty === "lako" ? 25 : 81;
  while (answers.size < 4) answers.add(randomInt(1, poolMax));

  return { first, second, correctAnswer, choices: shuffle(Array.from(answers)) };
}

function renderQuestion() {
  const question = makeQuestion(game.difficulty);
  game.currentQuestion = question;
  document.querySelector("#question-text").innerHTML =
    `${question.first} <span>×</span> ${question.second} <span>=</span> ?`;
  answerButtons.forEach((button, index) => {
    button.textContent = String(question.choices[index]);
    button.disabled = false;
    button.className = "answer-button";
  });
  document.querySelector("#feedback-overlay").hidden = true;
}

function updateScore() {
  document.querySelector("#score-text").textContent = String(game.score);
  document.querySelector("#correct-text").textContent = String(game.correct);
  document.querySelector("#wrong-text").textContent = String(game.wrong);
}

function updateTimer() {
  const remainingMs = Math.max(0, game.deadline - Date.now());
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = String(remainingSeconds % 60).padStart(2, "0");
  document.querySelector("#timer-text").textContent = `${minutes}:${seconds}`;
  const timerFill = document.querySelector("#timer-fill");
  timerFill.style.width = `${(remainingMs / ROUND_MS) * 100}%`;
  timerFill.classList.toggle("is-low", remainingSeconds <= 10);

  if (remainingMs <= 0) finishMultiplicationGame();
}

function startMultiplicationGame() {
  game = newGameState();
  game.deadline = Date.now() + ROUND_MS;
  updateScore();
  renderQuestion();
  showScreen("game");
  updateTimer();
  timerInterval = window.setInterval(updateTimer, 100);
}

function showFeedback(isCorrect, correctAnswer) {
  const card = document.querySelector("#feedback-card");
  const note = document.querySelector("#correct-answer-note");
  card.classList.toggle("is-wrong", !isCorrect);
  document.querySelector("#feedback-icon").textContent = isCorrect ? "✓" : "×";
  document.querySelector("#feedback-title").textContent = isCorrect ? "Tačno!" : "Netačno!";
  document.querySelector("#feedback-points").textContent = isCorrect ? `+${POINTS_CORRECT} poena` : `−${POINTS_WRONG} poena`;
  note.hidden = isCorrect;
  note.textContent = isCorrect ? "" : `Tačan odgovor je: ${correctAnswer}`;
  document.querySelector("#feedback-overlay").hidden = false;
}

function selectAnswer(button) {
  if (!game || game.gameId !== "mnozenje" || game.deadline <= Date.now() || button.disabled) {
    if (game && game.gameId === "mnozenje" && game.deadline <= Date.now()) finishMultiplicationGame();
    return;
  }

  const { correctAnswer } = game.currentQuestion;
  const isCorrect = Number(button.textContent) === correctAnswer;
  game.total += 1;
  if (isCorrect) {
    game.score += POINTS_CORRECT;
    game.correct += 1;
  } else {
    game.score -= POINTS_WRONG;
    game.wrong += 1;
  }

  answerButtons.forEach((answerButton) => {
    answerButton.disabled = true;
    if (Number(answerButton.textContent) === correctAnswer) {
      answerButton.classList.add(isCorrect && answerButton === button ? "is-correct" : "is-reveal");
    } else if (answerButton === button) {
      answerButton.classList.add("is-wrong");
    }
  });

  updateScore();
  showFeedback(isCorrect, correctAnswer);
  feedbackTimeout = window.setTimeout(() => {
    if (game && game.deadline > Date.now()) renderQuestion();
    else if (game) finishMultiplicationGame();
  }, 850);
}

function finishMultiplicationGame() {
  if (!game || screens.game.hidden) return;
  stopTimers();
  persistResult();
  showResults();
}

/* Spojnice */

function pickLetters(difficulty) {
  let pool = LETTER_PAIRS;
  if (difficulty === "lako") pool = LETTER_PAIRS.filter((pair) => EASY_LATIN.includes(pair.latin));
  if (difficulty === "tesko") pool = LETTER_PAIRS.filter((pair) => HARD_LATIN.includes(pair.latin));
  return shuffle(pool).slice(0, MATCH_COUNT);
}

function createMatchBox(text, side, id) {
  const box = document.createElement("button");
  box.type = "button";
  box.className = `match-box match-box-${side}`;
  box.textContent = text;
  box.dataset.id = String(id);
  box.setAttribute("aria-label", `${side === "left" ? "Ćirilica" : "Latinica"} ${text}`);
  box.addEventListener("click", () => (side === "left" ? onLeftBox(id) : onRightBox(id)));
  return box;
}

function startMatchGame() {
  game = newGameState();
  const letters = pickLetters(game.difficulty);
  match = {
    letters,
    connections: new Map(),
    selectedLeft: null,
    checked: false,
    leftBoxes: new Map(),
    rightBoxes: new Map()
  };

  const leftColumn = document.querySelector("#match-left");
  const rightColumn = document.querySelector("#match-right");
  leftColumn.replaceChildren();
  rightColumn.replaceChildren();
  shuffle(letters.map((_, id) => id)).forEach((id) => {
    const box = createMatchBox(letters[id].cyrillic, "left", id);
    match.leftBoxes.set(id, box);
    leftColumn.append(box);
  });
  shuffle(letters.map((_, id) => id)).forEach((id) => {
    const box = createMatchBox(letters[id].latin, "right", id);
    match.rightBoxes.set(id, box);
    rightColumn.append(box);
  });

  document.querySelector("#match-result").hidden = true;
  document.querySelector("#match-done-button").hidden = false;
  document.querySelector("#match-instruction").textContent = "Dodirni ćirilično slovo, pa njegov par u latinici.";
  updateMatchUi();
  showScreen("match");
}

function onLeftBox(id) {
  if (!match || match.checked) return;
  if (match.connections.has(id)) {
    match.connections.delete(id);
    match.selectedLeft = id;
  } else {
    match.selectedLeft = match.selectedLeft === id ? null : id;
  }
  updateMatchUi();
}

function onRightBox(id) {
  if (!match || match.checked) return;
  if (match.selectedLeft !== null) {
    match.connections.forEach((rightId, leftId) => {
      if (rightId === id) match.connections.delete(leftId);
    });
    match.connections.set(match.selectedLeft, id);
    match.selectedLeft = null;
  } else {
    match.connections.forEach((rightId, leftId) => {
      if (rightId === id) match.connections.delete(leftId);
    });
  }
  updateMatchUi();
}

function updateMatchUi() {
  const connectedRight = new Set(match.connections.values());
  match.leftBoxes.forEach((box, id) => {
    box.classList.toggle("is-selected", match.selectedLeft === id);
    box.classList.toggle("is-connected", match.connections.has(id));
    box.disabled = match.checked;
  });
  match.rightBoxes.forEach((box, id) => {
    box.classList.toggle("is-connected", connectedRight.has(id));
    box.disabled = match.checked;
  });
  document.querySelector("#match-count").textContent = String(match.connections.size);
  document.querySelector("#match-done-button").disabled = match.connections.size !== MATCH_COUNT;
  drawMatchLines();
}

function drawMatchLines() {
  if (!match || screens.match.hidden) return;
  const svg = document.querySelector("#match-lines");
  const boardRect = document.querySelector("#match-board").getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${boardRect.width} ${boardRect.height}`);
  svg.replaceChildren();

  match.connections.forEach((rightId, leftId) => {
    const leftRect = match.leftBoxes.get(leftId).getBoundingClientRect();
    const rightRect = match.rightBoxes.get(rightId).getBoundingClientRect();
    const group = document.createElementNS(SVG_NS, "g");
    if (match.checked) group.setAttribute("class", leftId === rightId ? "is-correct" : "is-wrong");

    const x1 = leftRect.right - boardRect.left;
    const y1 = leftRect.top + leftRect.height / 2 - boardRect.top;
    const x2 = rightRect.left - boardRect.left;
    const y2 = rightRect.top + rightRect.height / 2 - boardRect.top;
    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", String(x1));
    line.setAttribute("y1", String(y1));
    line.setAttribute("x2", String(x2));
    line.setAttribute("y2", String(y2));
    group.append(line);
    [[x1, y1], [x2, y2]].forEach(([x, y]) => {
      const dot = document.createElementNS(SVG_NS, "circle");
      dot.setAttribute("cx", String(x));
      dot.setAttribute("cy", String(y));
      dot.setAttribute("r", "5");
      group.append(dot);
    });
    svg.append(group);
  });
}

function checkMatches() {
  if (!match || match.checked || match.connections.size !== MATCH_COUNT) return;
  match.checked = true;
  match.selectedLeft = null;

  let correct = 0;
  match.connections.forEach((rightId, leftId) => {
    const isCorrect = leftId === rightId;
    if (isCorrect) correct += 1;
    const state = isCorrect ? "is-correct" : "is-wrong";
    match.leftBoxes.get(leftId).classList.add(state);
    match.rightBoxes.get(rightId).classList.add(state);
  });

  game.correct = correct;
  game.wrong = MATCH_COUNT - correct;
  game.total = MATCH_COUNT;
  game.score = correct * POINTS_CORRECT - game.wrong * POINTS_WRONG;
  persistResult();

  updateMatchUi();
  document.querySelector("#match-done-button").hidden = true;
  document.querySelector("#match-result").hidden = false;
  document.querySelector("#match-result-text").textContent =
    `Tačno: ${correct} od ${MATCH_COUNT} · ${game.score} poena`;
  document.querySelector("#match-instruction").textContent =
    game.wrong === 0 ? "Bravo! Sve je tačno!" : "Zeleno je tačno, a crveno netačno.";
}

/* Rezultati i rang lista */

function loadScores() {
  const storedScores = localStorage.getItem(SCORE_STORAGE_KEY);
  if (!storedScores) return [];

  const parsedScores = JSON.parse(storedScores);
  if (!Array.isArray(parsedScores)) {
    throw new Error("Lokalna tabela rezultata nije u očekivanom formatu.");
  }
  return parsedScores
    .filter((score) =>
      score &&
      typeof score.name === "string" &&
      Number.isFinite(score.points) &&
      Number.isFinite(score.correct) &&
      typeof score.date === "string"
    )
    .map((score) => ({
      ...score,
      game: GAMES[score.game] ? score.game : "mnozenje",
      difficulty: DIFFICULTIES[score.difficulty] ? score.difficulty : "srednje"
    }));
}

function sortAndTrim(scores) {
  const counts = {};
  return scores
    .sort((left, right) => right.points - left.points || right.date.localeCompare(left.date))
    .filter((score) => {
      const key = `${score.game}|${score.difficulty}`;
      counts[key] = (counts[key] || 0) + 1;
      return counts[key] <= MAX_SCORES;
    });
}

function scoresFor(scores, gameId, difficulty) {
  return scores.filter((score) => score.game === gameId && score.difficulty === difficulty);
}

function persistResult() {
  game.savedDate = new Date().toISOString();
  game.storageError = null;
  try {
    const scores = loadScores();
    scores.push({
      name: game.playerName,
      points: game.score,
      correct: game.correct,
      wrong: game.wrong,
      game: game.gameId,
      difficulty: game.difficulty,
      date: game.savedDate
    });
    game.scores = sortAndTrim(scores);
    localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(game.scores));
  } catch (error) {
    console.error("Rezultat nije mogao da se sačuva u lokalnoj tabeli:", error);
    game.storageError = error;
    try {
      game.scores = loadScores();
    } catch (readError) {
      console.error("Lokalna tabela rezultata ne može da se učita:", readError);
      game.scores = [];
    }
  }
}

function renderLeaderboard(scores, body, emptyState, highlightDate) {
  body.replaceChildren();
  emptyState.hidden = scores.length > 0;

  scores.forEach((score, index) => {
    const row = document.createElement("tr");
    if (score.date === highlightDate) row.className = "is-current";
    [String(index + 1), score.name, String(score.correct), String(score.points)].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });
    body.append(row);
  });
}

function showResults() {
  const config = GAMES[game.gameId];
  document.querySelector("#result-title").textContent = `Igrač: ${game.playerName}`;
  document.querySelector("#result-message").textContent =
    game.gameId === "spojnice"
      ? `Spojio/la si ${game.correct} od ${MATCH_COUNT} slova tačno.`
      : game.total === 0
        ? "Vreme je isteklo. Sledeći put ćeš stići da rešiš još više zadataka!"
        : `Odgovorio/la si na ${game.total} ${game.total === 1 ? "pitanje" : "pitanja"}.`;
  document.querySelector("#final-score").textContent = String(game.score);
  document.querySelector("#final-correct").textContent = String(game.correct);
  document.querySelector("#final-wrong").textContent = String(game.wrong);
  document.querySelector("#final-correct-label").textContent = config.correctLabel;
  document.querySelector("#final-wrong-label").textContent = config.wrongLabel;
  document.querySelector("#leaderboard-context").textContent = `${config.name} · ${DIFFICULTIES[game.difficulty]}`;

  const storageMessage = document.querySelector("#storage-message");
  storageMessage.hidden = !game.storageError;
  storageMessage.textContent = game.storageError
    ? "Rezultat nije mogao da se sačuva. Proveri podešavanja memorije pregledača."
    : "";
  renderLeaderboard(
    scoresFor(game.scores, game.gameId, game.difficulty),
    document.querySelector("#leaderboard-body"),
    document.querySelector("#empty-leaderboard"),
    game.savedDate
  );
  showScreen("results");
}

function renderRankScreen() {
  markSelected(document.querySelector("#rank-game-filter"), "data-game", rankFilter.game);
  markSelected(document.querySelector("#rank-difficulty-filter"), "data-difficulty", rankFilter.difficulty);
  const message = document.querySelector("#scores-message");
  try {
    renderLeaderboard(
      scoresFor(loadScores(), rankFilter.game, rankFilter.difficulty),
      document.querySelector("#scores-body"),
      document.querySelector("#scores-empty")
    );
    message.hidden = true;
  } catch (error) {
    console.error("Lokalna tabela rezultata ne može da se učita:", error);
    message.hidden = false;
    document.querySelector("#scores-body").replaceChildren();
    document.querySelector("#scores-empty").hidden = true;
  }
}

function openRankScreen() {
  rankFilter.game = selection.game;
  rankFilter.difficulty = selection.difficulty;
  renderRankScreen();
  showScreen("scores");
}

function returnHome() {
  stopTimers();
  game = null;
  match = null;
  showMenuStep(selection.subject ? "game" : selection.grade ? "subject" : "grade");
  showScreen("home");
}

/* Događaji */

document.querySelector("#grade-picker").addEventListener("click", (event) => {
  const button = event.target.closest("[data-grade]");
  if (!button || button.disabled) return;
  selection.grade = button.dataset.grade;
  showMenuStep("subject");
});
document.querySelector("#subject-picker").addEventListener("click", (event) => {
  const button = event.target.closest("[data-subject]");
  if (!button || button.disabled) return;
  selection.subject = button.dataset.subject;
  selection.game = selection.subject === "matematika" ? "mnozenje" : "spojnice";
  renderMenuSelection();
  showMenuStep("game");
});
document.querySelector("#subjects-back-button").addEventListener("click", () => showMenuStep("grade"));
document.querySelector("#games-back-button").addEventListener("click", () => showMenuStep("subject"));
document.querySelector("#game-picker").addEventListener("click", (event) => {
  const card = event.target.closest("[data-game]");
  if (!card || card.disabled) return;
  selection.game = card.dataset.game;
  renderMenuSelection();
});
document.querySelector("#difficulty-picker").addEventListener("click", (event) => {
  const button = event.target.closest("[data-difficulty]");
  if (!button) return;
  selection.difficulty = button.dataset.difficulty;
  renderMenuSelection();
});
document.querySelector("#rank-game-filter").addEventListener("click", (event) => {
  const chip = event.target.closest("[data-game]");
  if (!chip) return;
  rankFilter.game = chip.dataset.game;
  renderRankScreen();
});
document.querySelector("#rank-difficulty-filter").addEventListener("click", (event) => {
  const chip = event.target.closest("[data-difficulty]");
  if (!chip) return;
  rankFilter.difficulty = chip.dataset.difficulty;
  renderRankScreen();
});

document.querySelector("#start-button").addEventListener("click", renderReadyScreen);
document.querySelector("#begin-round-button").addEventListener("click", startSelectedGame);
document.querySelector("#ready-back-button").addEventListener("click", returnHome);
document.querySelector("#home-scores-button").addEventListener("click", openRankScreen);
document.querySelector("#scores-back-button").addEventListener("click", returnHome);
document.querySelector("#scores-home-button").addEventListener("click", returnHome);
document.querySelector("#quit-button").addEventListener("click", returnHome);
document.querySelector("#match-quit-button").addEventListener("click", returnHome);
document.querySelector("#match-done-button").addEventListener("click", checkMatches);
document.querySelector("#match-continue-button").addEventListener("click", showResults);
document.querySelector("#play-again-button").addEventListener("click", startSelectedGame);
document.querySelector("#home-button").addEventListener("click", returnHome);
answerButtons.forEach((button) => {
  button.addEventListener("click", () => selectAnswer(button));
});
window.addEventListener("resize", drawMatchLines);

renderMenuSelection();
showMenuStep("grade");

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.error("Offline režim nije mogao da se aktivira:", error);
    });
  });
}
