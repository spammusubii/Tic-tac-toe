const WIN_PATTERNS = [
    //Rows
    [[0,0],[0,1],[0,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    // Diagonals
    [[0,0],[1,1],[2,2]],
    [[2,0],[1,1],[0,2]],
    // Columns
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]]
]

const CellValue = {
    EMPTY: " ",
};
  
const GameResult = {
    WINNER: "winner",
    TIE: "tie",
    CONTINUE: "continue",
};

const Gameboard = function() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++){
        board[i] = [];
        for (let j = 0; j < columns; j++){
            board[i][j] = Cell();
        }
    }

    function updateCell(row, col, playerToken){
        if (board[row][col].getValue()==" "){
            board[row][col].setValue(playerToken);
            return true;
        }
        return false;
    }

    function getBoard() {
        return board.map(row=>row.map(cell=>({getValue:cell.getValue()})));
    }

    function printBoard() {
        for (let i = 0; i < 3; i++){
            let boardLine = "";
            for (let j = 0; j < 3; j++){
                if (j > 0) boardLine += " | ";
                boardLine += board[i][j].getValue();
            }
            console.log(boardLine);
        }
    }

    function resetBoard() {
        board.forEach(row => row.forEach(cell => cell.resetValue()));
    }

    function getCellValue(row, col){
        return board[row][col].getValue();
    }

    return {
        updateCell,
        getBoard,
        printBoard,
        resetBoard,
        getCellValue
    }
};

function Game(board, playerOneName = "Player One", playerTwoName = "Player Two"){
    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const checkRound = () => {
        const winnerFound = WIN_PATTERNS.find(([a, b, c]) => {
            const valA = board.getCellValue(a[0],a[1]);
            const valB = board.getCellValue(b[0],b[1]);
            const valC = board.getCellValue(c[0],c[1]);
            return valA !== CellValue.EMPTY && valA === valB && valB === valC;
        })
        if (winnerFound) return "winner";
        const tie = board.getBoard().flat().filter(cell => cell.getValue !== " ").length === 9;
        if (tie) return "tie";
        return "continue";
    }

    const playRound = (row, col) => {
        board.updateCell(row, col, getActivePlayer().token);
        const roundResult = checkRound();
        if (roundResult !== "continue") return roundResult;
        switchPlayerTurn();
        return roundResult;
    }

    const resetGame = () => {
        board.resetBoard();
    }

    return {playRound, getActivePlayer, resetGame}
};

function Cell(){
    let value = " ";

    function getValue(){
        return value;
    }

    function setValue(newValue){
        if (value === " ") value = newValue;
    }

    function resetValue(){
        value = " ";
    }

    return {getValue, setValue, resetValue};
}

// DOM Controllers
function BoardController(board, game){
    const cells = [...document.querySelectorAll(".cell>button")];

    function initiateBoard(){
        cells.forEach(
            (cell) => {
                cell.addEventListener("click", ()=> {
                    const row = Number(cell.getAttribute("data-row"));
                    const col = Number(cell.getAttribute("data-col"));
                    const roundResult = game.playRound(row, col);
                    const cPlayer = game.getActivePlayer();
                    updateBoard();
                    if (roundResult === "tie"){
                        alert("It's a tie. Good game!");
                        disableBoard();
                    }
                    else if (roundResult === "winner"){
                        alert(`We have a winner! ${cPlayer.name} has won with ${cPlayer.token}!`);
                        disableBoard();
                    }
                    else if (roundResult === "retry"){
                        alert("Space already has a value. Please choose another space.");
                    }
                })
            }
        )
    }

    function resetBoard(){
        cells.forEach(cell=>{
            cell.textContent=""
            cell.disabled=false;
        });
    }

    function updateBoard(){
        board.getBoard().forEach(
            (row, rowIndex) => row.forEach(
                (cell, columnIndex) => {
                    const button = document.querySelector(`[data-row="${rowIndex}"][data-col="${columnIndex}"]`)
                    const value = cell.getValue;
                    if (value !== " "){
                        button.textContent = value;
                        button.disabled = true;
                    }
                }
            )
        )
    }

    function disableBoard(){
        cells.forEach(cell=>cell.disabled = true);
    }

    return {initiateBoard, resetBoard, updateBoard, disableBoard};
};

function GameController(player1Name = "Player 1", player2Name = "Player 2"){
    const board = Gameboard();
    const tictactoe = Game(board, player1Name, player2Name);
    const boardController = BoardController(board, tictactoe);
    boardController.initiateBoard();
};

GameController();