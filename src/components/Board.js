import Square from "./Square";

const Board = (props) => {
  const renderSquare = (i) => {
    return (
      <Square
        value={props.squares[i]}
        onClick={() => {
          props.onClick(i);
        }}
      />
    );
  };

  return (
    <div>
      {[0, 1, 2].map((i) => {
        return (
          <div className="board-row" key={i}>
            {[0, 1, 2].map((j) => {
              return renderSquare(i * 3 + j);
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
