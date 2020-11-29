import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Board from "./components/Board";
import Popup from "./components/Popup";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true,
      winner: null,
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
    if (!this.state.winner && calculateWinner(squares)) {
      this.setState({ winner: calculateWinner(squares), isPopupOpen: true });
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

    this.setState(newStates);
  }

  handleClose = () => {
    this.setState({ isPopupOpen: false });
  };

  render() {
    const history = this.state.history;
    const current = this.state.history[this.state.stepNumber];
    const winner = this.state.winner;
    let status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    if (winner) {
      status = `Winner: ${winner}`;
    }

    let moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #${move} - ${step.xIsNext ? "O" : "X"}(${
            Math.floor(step.move / 3) + 1
          }, ${(step.move % 3) + 1})`
        : "Go to start";

      return (
        <li key={move}>
          <button
            onClick={() => {
              this.jumpTo(move);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });

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
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => {
                this.handleClick(i);
              }}
            />
          </div>
          {/* <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div> */}
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

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
