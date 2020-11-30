import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Board from "./components/Board";
import Popup from "./components/Popup";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialStates();
  }

  initialStates() {
    return {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true,
      winner: null,
      totalWins: {
        x: 0,
        o: 0,
        tie: 0,
      },
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    let current = history[history.length - 1];
    let squares = current.squares.slice();
    // check if clicking on an already clicked box
    // or someone has already won
    if (squares[i] || this.state.winner) {
      return;
    }

    // update clicked box
    squares[i] = this.state.xIsNext ? "X" : "O";

    // check if someone has won
    const winner = calculateWinner(squares);
    if (!this.state.winner && winner) {
      this.setState({ winner: winner, isPopupOpen: true });
      this.countWins(winner.toLowerCase());
    }

    // check if no valid moves left
    const availableMoves = getaAvailableMoves(squares);
    if (availableMoves === 0) {
      // end game; declare a tie
      this.setState({ winner: "Nobody", isPopupOpen: true });
      this.countWins("tie");
    }

    // set next player's move
    const xIsNext = !this.state.xIsNext;
    this.setState({
      history: history.concat([
        { squares: squares, xIsNext: xIsNext, move: i },
      ]),
      stepNumber: history.length,
      xIsNext: xIsNext,
    });
  }

  jumpTo(step) {
    let newStates = {
      stepNumber: step,
      xIsNext: step % 2 === 0,
    };

    const history = this.state.history.slice(0, newStates.stepNumber + 1);
    let current = history[history.length - 1];
    let squares = current.squares.slice();

    // check if someone has won
    if (calculateWinner(squares)) {
      newStates.winner = calculateWinner(squares);
      newStates.isPopupOpen = true;
    } else {
      newStates.winner = null;
      newStates.isPopupOpen = false;
    }

    // check if no valid moves left
    const availableMoves = getaAvailableMoves(squares);
    if (availableMoves === 0) {
      // end game; declare a tie
      newStates.winner = "Nobody";
      newStates.isPopupOpen = true;
    }

    this.setState(newStates);
  }

  handleClose = () => {
    this.setState({ isPopupOpen: false });
  };

  restartGame = () => {
    this.setState(this.initialStates());
  };

  undo = () => {
    let step = this.state.stepNumber - 1;
    this.jumpTo(step);
  };

  redo = () => {
    let step = this.state.stepNumber + 1;
    this.jumpTo(step);
  };

  countWins = (winner) => {
    let totalWins = JSON.parse(JSON.stringify(this.state.totalWins));
    totalWins[winner]++;
    this.setState({ totalWins: totalWins });
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.state.winner;
    let status = `Turn: ${this.state.xIsNext ? "X" : "O"}`;
    if (winner) {
      status = `Winner: ${winner}`;
    }

    const winCount = `X: ${this.state.totalWins.x} | O: ${this.state.totalWins.o} | Tie: ${this.state.totalWins.tie}`;

    const showUndoButton = this.state.stepNumber > 0 ? true : false;
    const showRedoButton =
      this.state.stepNumber < history.length - 1 ? true : false;

    return (
      <>
        {winner && this.state.isPopupOpen ? (
          <Popup
            title={`"${winner}" has won the game!`}
            onClick={this.handleClose}
          />
        ) : (
          ""
        )}
        <div className="game">
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "20px",
            }}
          >
            {status}
            <br />
            {winCount}
          </div>
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => {
                this.handleClick(i);
              }}
            />
          </div>
          <div className="game-info">
            {/* undo button */}
            <button
              disabled={!showUndoButton ? true : false}
              onClick={() => {
                this.undo();
              }}
            >
              undo
            </button>

            <button
              onClick={() => {
                this.restartGame();
              }}
            >
              Restart
            </button>

            {/* redo button */}

            <button
              disabled={!showRedoButton ? true : false}
              onClick={() => {
                this.redo();
              }}
            >
              redo
            </button>
          </div>
        </div>
      </>
    );
  }
}

// calculate winner helper function
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// get available moves
function getaAvailableMoves(squares) {
  return squares.reduce((count, val) => {
    return val === null ? count + 1 : count;
  }, 0);
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
