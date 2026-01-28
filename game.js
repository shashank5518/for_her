const firebaseConfig = {
    apiKey: "AIzaSyBy3G56k25rnzkJ2BZQ1SdpexEOPKwv6Ww",
    authDomain: "for-her-connect4.firebaseapp.com",
    projectId: "for-her-connect4",
    storageBucket: "for-her-connect4.firebasestorage.app",
    messagingSenderId: "388692320036",
    appId: "1:388692320036:web:683b062ce7a7bfb2d11db1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const ROWS = 6;
const COLS = 7;
let currentGameId = null;
let playerColor = null;

const boardEl = document.getElementById("connect4");
const statusEl = document.getElementById("gameStatus");
const gameCodeEl = document.getElementById("gameCode");

async function generateUniqueCode() {
  let code;
  let exists = true;

  while (exists) {
    code = Math.floor(1000 + Math.random() * 9000).toString();
    const doc = await db.collection("codes").doc(code).get();
    exists = doc.exists;
  }

  return code;
}

function checkWin(board, player) {
  const directions = [
    [0, 1],   // →
    [1, 0],   // ↓
    [1, 1],   // ↘
    [1, -1]   // ↗
  ];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const startIndex = r * COLS + c;
      if (board[startIndex] !== player) continue;

      for (const [dr, dc] of directions) {
        const cells = [startIndex];

        for (let i = 1; i < 4; i++) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          const idx = nr * COLS + nc;

          if (
            nr < 0 || nr >= ROWS ||
            nc < 0 || nc >= COLS ||
            board[idx] !== player
          ) break;

          cells.push(idx);
        }

        if (cells.length === 4) return cells;
      }
    }
  }

  return null;
}


function renderBoard(board, winningCells = []) {
  boardEl.innerHTML = "";

  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.className = "cell";

    if (cell) div.classList.add(cell);
    if (winningCells.includes(index)) div.classList.add("win-glow");

    div.onclick = () => makeMove(index % COLS);
    boardEl.appendChild(div);
  });
}

async function createGame() {
  const gameRef = await db.collection("games").add({
    board: Array(ROWS * COLS).fill(null),
    currentPlayer: "red",
    winner: null
  });

  currentGameId = gameRef.id;
  playerColor = "red";

  const code = await generateUniqueCode();


  // Save short code mapping
  await db.collection("codes").doc(code).set({
    gameId: currentGameId
  });

  gameCodeEl.textContent = "Game Code: " + code;
  listenToGame();
}


async function joinGame() {

  const codeDoc = await db.collection("codes").doc(code).get();
  if (!codeDoc.exists) {
    alert("Invalid game code 💔");
    return;
  }

  currentGameId = codeDoc.data().gameId;
  playerColor = "yellow";
  listenToGame();
}

function listenToGame() {
  db.collection("games").doc(currentGameId)
    .onSnapshot(doc => {
      const data = doc.data();
      const playAgainBtn = document.getElementById("playAgain");

      renderBoard(data.board, data.winningCells || []);
      playAgainBtn.classList.remove("show");
      if (data.winner) {
  playAgainBtn.classList.add("show");

  if (data.winner === playerColor) {
    statusEl.textContent = "💛 You won!";
    launchConfetti();
  } else {
    statusEl.textContent = "😌 I lost… rematch?";
  }
}

else if (data.currentPlayer === playerColor) {
  statusEl.textContent = "Your turn bbg, Make a move";
} else {
  statusEl.textContent = "Waiting for your move… ⏳";
}

    });
}

async function makeMove(col) {
  const ref = db.collection("games").doc(currentGameId);
  const snap = await ref.get();
  const data = snap.data();

  if (data.currentPlayer !== playerColor || data.winner) return;

  let placed = false;

  // drop piece
  for (let r = ROWS - 1; r >= 0; r--) {
    const index = r * COLS + col;
    if (!data.board[index]) {
      data.board[index] = playerColor;
      placed = true;
      break;
    }
  }

  if (!placed) return; // column full

  // 🏆 CHECK WIN
  const winningCells = checkWin(data.board, playerColor);


  await ref.update({
  board: data.board,
  currentPlayer: winningCells
    ? data.currentPlayer
    : playerColor === "red" ? "yellow" : "red",
  winner: winningCells ? playerColor : null,
  winningCells: winningCells || []
});
}

document.getElementById("createGame").onclick = createGame;
const joinModal = document.getElementById("joinModal");
const joinInput = document.getElementById("joinCodeInput");
const confirmJoin = document.getElementById("confirmJoin");
const cancelJoin = document.getElementById("cancelJoin");

// open modal
function openJoinModal() {
  joinInput.value = "";
  joinModal.classList.add("active");
  setTimeout(() => joinInput.focus(), 200);
}

// close modal
function closeJoinModal() {
  joinModal.classList.remove("active");
}

// override join button
document.getElementById("joinGame").onclick = openJoinModal;

cancelJoin.onclick = closeJoinModal;

// confirm join
confirmJoin.onclick = async () => {
  const code = joinInput.value.trim();
  if (code.length !== 4) return;

  const codeDoc = await db.collection("codes").doc(code).get();
  if (!codeDoc.exists) {
    joinInput.value = "";
    joinInput.placeholder = "Invalid 💔";
    return;
  }

  currentGameId = codeDoc.data().gameId;
  playerColor = "yellow";
  closeJoinModal();
  listenToGame();
};

// allow Enter key
joinInput.addEventListener("keydown", e => {
  if (e.key === "Enter") confirmJoin.click();
});
// ===== CONFETTI EFFECT =====
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

let confettiPieces = [];
let confettiActive = false;

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti() {
  if (confettiActive) return; // prevent double trigger
  confettiActive = true;

  const colors = [
    "#f5d078", // lantern gold
    "#fff3b0",
    "#d4a5c8",
    "#8b6cb8",
    "#ffffff"
  ];

  confettiPieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height - confettiCanvas.height,
    size: Math.random() * 6 + 4,
    speed: Math.random() * 3 + 2,
    drift: Math.random() * 2 - 1,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  animateConfetti();

  // stop after 4 seconds
  setTimeout(() => {
    confettiActive = false;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }, 4000);
}

function animateConfetti() {
  if (!confettiActive) return;

  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiPieces.forEach(p => {
    p.y += p.speed;
    p.x += p.drift;

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateConfetti);
}
document.getElementById("playAgain").onclick = async () => {
  if (!currentGameId) return;

  const ref = db.collection("games").doc(currentGameId);

  await ref.update({
    board: Array(ROWS * COLS).fill(null),
    currentPlayer: "red",
    winner: null,
    winningCells: []
  });
};


