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

    const printNewRound = () => {
        console.log(
            `Placing ${getActivePlayer.token}`
        )
    };
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