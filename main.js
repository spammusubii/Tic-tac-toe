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

const CELLS = [...document.querySelectorAll(".cell>button")];

const Gameboard = (function () {
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
        return board;
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
        printBoard();
    }

    return {
        updateCell,
        getBoard,
        printBoard,
        resetBoard,
    }
})();

function GameController(playerOneName = "Player One", playerTwoName = "Player Two"){

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

    const printNewRound = (row, col) => {
        console.log(
            `Placing ${getActivePlayer().token} on row:${row+1} and column:${col+1}`
        )
    };

    const checkRound = () => {
        const board = Gameboard.getBoard();
        
        const winnerFound = WIN_PATTERNS.find(([a, b, c]) => {
            const valA = board[a[0]][a[1]].getValue();
            const valB = board[b[0]][b[1]].getValue();
            const valC = board[c[0]][c[1]].getValue();
            return valA !== " " && valA === valB && valB === valC;
        })
        if (winnerFound) return "winner";
        const tie = board.flat().filter(cell => cell.getValue() !== " ").length === 9;
        if (tie) return "tie";
        return "continue";
    }

    const playRound = (row, col) => {
        printNewRound(row, col);
        if (!Gameboard.updateCell(row, col, getActivePlayer().token)) {
            console.log("Invalid move. Try again.");
            return "retry";
        }
        Gameboard.printBoard();
        const roundResult = checkRound();
        if (roundResult !== "continue") return roundResult;
        switchPlayerTurn();
        return roundResult;
    }

    const resetGame = () => {
        Gameboard.resetBoard();
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

function displayController(){
    const tictactoe = GameController("player 1", "player 2");
    CELLS.forEach(
        (cell) => {
            cell.addEventListener("click", ()=> {
                console.log('clicked')
                let [row, col] = cell.getAttribute("id").split("").map(Number);
                const roundResult = tictactoe.playRound(row, col);
                if (roundResult === "tie"){
                    console.log("It's a tie. Good game!");
                }
                else if (roundResult === "winner"){
                    console.log(`We have a winner! ${cPlayer.name} has won with ${cPlayer.token}!`);
                }
                else if (roundResult === "retry"){
                    console.log("Space already has a value. Please choose another space.");
                }
                updateBoard();
            })
        }
    )

    
    // while (round <= 9){
    //     const cPlayer = tictactoe.getActivePlayer();
    //     let input = prompt(`${cPlayer.name}, enter row,col (e.g., 0,2):`);
    //     let [row, col] = input?.replaceAll(" ", "").split(",").map(Number);

    //     if (
    //         isNaN(row) || isNaN(col) ||
    //         row < 0 || row > 2 ||
    //         col < 0 || col > 2
    //     ) {
    //         console.log("Invalid input. Please enter values between 0 and 2.");
    //         continue;
    //     }
    //     row = Number(row)
    //     col = Number(col);
    //     const roundResult = tictactoe.playRound(row, col);
    //     if (roundResult === "tie"){
    //         console.log("It's a tie. Good game!");
    //         break;
    //     }
    //     else if (roundResult === "winner"){
    //         console.log(`We have a winner! ${cPlayer.name} has won with ${cPlayer.token}!`);
    //         break;
    //     }
    //     else if (roundResult === "retry"){
    //         console.log("Space already has a value. Please choose another space.");
    //         continue;
    //     }
    //     round++;
    // }
    // tictactoe.resetGame();
}

// DOM
function resetBoard(){
    CELLS.forEach(cell=>cell.textContent="");
}

function updateBoard(){
    Gameboard.getBoard().forEach(
        (row, rowIndex) => row.forEach(
            (cell, columnIndex) => {
                const button = document.getElementById(`${rowIndex}${columnIndex}`);
                const value = cell.getValue();
                if (value !== " "){
                    button.textContent = value;
                    button.disabled = true;
                }
            }
        )
    )
}

displayController();