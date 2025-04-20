const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++){
        board[i] = [];
        for (let j = 0; j < columns; j++){
            board[i].push(Cell());
        }
    }

    function updateCell(row, col, playerToken){
        if (!board[row][col].getValue()) board[row][col].setValue(playerToken);
    }

    function getBoard() {
        return board;
    }

    function printBoard() {
        board.forEach(row => row.forEach((cell)=>console.log(cell.getValue())));
    }

    return {
        updateCell,
        getBoard,
        printBoard
    }
})();

const GameController = (function (playerOneName = "Player One", playerTwoName = "Player Two"){

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
            `Placing ${getActivePlayer.token} on row: =${row} and column:${col}`
        )
    };

    const checkRound = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
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
        const result = winPatterns.find(([a, b, c]) => {
            const valA = board[a[0]][a[1]].getValue();
            const valB = board[b[0]][b[1]].getValue();
            const valC = board[c[0]][c[1]].getValue();
            return valA !== 0 && valA === valB && valB === valC;
        })
        if (result) return {gameFinished: true, winner: board[result[0][0]][result[0][1]].getValue()};
        return {gameFinished: false, winner: ""};
    }

    const playRound = (row, col) => {
        printNewRound(row, col);
        Gameboard.updateCell(row, col, activePlayer.playerToken);
        switchPlayerTurn();
    }
})();

function Cell(){
    let value = "";

    function getValue(){
        return value;
    }

    function setValue(newValue){
        value = newValue;
    }

    return {getValue, setValue};
}