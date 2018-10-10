import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={ () => props.onClick() }>
      { props.value }
    </button>
  );
}

function SortBtn(props) {
  return (
    <div>
      <button className="sort-btn" onClick={ () => props.onClick() }>
        Sort
      </button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && 
      squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getPosition(i) {
  const pos = [
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 1],
    [2, 2],
    [2, 3],
    [3, 1],
    [3, 2],
    [3, 3],
  ];

  let posItem = {
    x: pos[i][0], 
    y: pos[i][1]
  };

  return posItem;
}

class Board extends React.Component {

  renderSquare(i) {
    return (
    	<Square
        key={ i } 
    		value={ this.props.squares[i] } 
    		onClick={ () => this.props.onClick(i) }
  		/>
  	);
  }

  getBoard() {

    let board = [];
    let count = 0;

    for (let c = 0; c < 3; c++) {
      let row = [];
      for (let r = 0; r < 3; r++) {
        row.push(this.renderSquare(count));
        count++;
      }
      board.push(<div key={'row_' + (c + 1)} className="board-row">{ row }</div>);
    }

    return board;
  }

  render() {
    return (
      <div>
        { this.getBoard() }
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      position: [{x: null, y: null}],
      stepNumber: 0,
      sort: false,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0,
      this.state.stepNumber + 1);
    const pos = this.state.position.slice(0,
      this.state.stepNumber + 1);
    pos.push(getPosition(i));
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({ 
      history: history.concat([{
        squares: squares
      }]),
      position: pos,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  handleSortClick() {
    this.setState({
      sort: !this.state.sort
    });
  }

  render() {
    const history = this.state.history;
    const pos = this.state.position;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const stepNumber = this.state.stepNumber;
    const sort = this.state.sort;

    const moves = history.map((squares, step) => {

      if (sort) {
        step = (history.length - 1) - step;
      }

      let selected;
      if (step === stepNumber) {
        selected = "selected";
      }

      const desc = step ?
        'Go to move #' + step + ' - (' + pos[step].x + ', ' + pos[step].y + ')' :
        'Go to game start';
      return (
        <li key={ step }>
          <button className={ selected } onClick={ () => this.jumpTo(step) }>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares= { current.squares }
            onClick={ (i) => this.handleClick(i) }
          />
          <SortBtn
            onClick={ () => this.handleSortClick() }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);