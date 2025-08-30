// 🎯 Factory for Player
const Player = (name, marker) => {
  return { name, marker };
};

// 🎯 GameBoard Module
const GameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  const resetBoard = () => { board = ["", "", "", "", "", "", "", "", ""]; };

  const setCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const checkWinner = () => {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8], // rows
      [0,3,6], [1,4,7], [2,5,8], // cols
      [0,4,8], [2,4,6]           // diagonals
    ];
    for (let pattern of winPatterns) {
      const [a,b,c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // return "X" or "O"
      }
    }
    if (!board.includes("")) return "Tie";
    return null;
  };

  return { getBoard, setCell, resetBoard, checkWinner };
})();

// 🎯 Game Controller Module
const GameController = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  const startGame = (name1, name2) => {
    players = [Player(name1 || "Player 1", "X"), Player(name2 || "Player 2", "O")];
    currentPlayerIndex = 0;
    gameOver = false;
    GameBoard.resetBoard();
    DisplayController.renderBoard();
    DisplayController.setStatus(`${players[currentPlayerIndex].name}'s turn`);
  };

  const playRound = (index) => {
    if (gameOver) return;
    const currentPlayer = players[currentPlayerIndex];
    if (GameBoard.setCell(index, currentPlayer.marker)) {
      DisplayController.renderBoard();
      const winner = GameBoard.checkWinner();
      if (winner) {
        gameOver = true;
        if (winner === "Tie") {
          DisplayController.setStatus("It's a Tie!");
        } else {
          const winPlayer = players.find(p => p.marker === winner);
          DisplayController.setStatus(`${winPlayer.name} Wins! 🎉`);
        }
      } else {
        currentPlayerIndex = 1 - currentPlayerIndex;
        DisplayController.setStatus(`${players[currentPlayerIndex].name}'s turn`);
      }
    }
  };

  return { startGame, playRound };
})();

// 🎯 Display Controller Module
const DisplayController = (() => {
  const boardDiv = document.getElementById("board");
  const statusDiv = document.getElementById("gameStatus");
  const startBtn = document.getElementById("startBtn");

  const renderBoard = () => {
    boardDiv.innerHTML = "";
    GameBoard.getBoard().forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      if (cell !== "") {
        cellDiv.textContent = cell;
        cellDiv.classList.add("taken");
      }
      cellDiv.addEventListener("click", () => {
        GameController.playRound(index);
      });
      boardDiv.appendChild(cellDiv);
    });
  };

  const setStatus = (message) => {
    statusDiv.textContent = message;
  };

  startBtn.addEventListener("click", () => {
    const name1 = document.getElementById("player1").value;
    const name2 = document.getElementById("player2").value;
    GameController.startGame(name1, name2);
  });

  return { renderBoard, setStatus };
})();
