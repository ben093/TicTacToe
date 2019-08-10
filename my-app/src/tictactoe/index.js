import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//// This is more complex than we need, adding in a functional component instead
//class Square extends React.Component {
//  
//  //// Below was removed, cause state is now stored in Board class.
//  //constructor() {
//  //	super();
//  //	this.state = {
//  //		value:null,
//  //	};
//  //}
//  render() {
//    return (
//	  //v3:
//	  <button className="square"
//	     onClick={() => this.props.onClick()}>
//			 {this.props.value}
//	  </button>
//      ////v2: 
//      //<button className="square" onClick={() => this.setState({value: 'X'})}>
//		//  {this.state.value}
//	  //</button>
//	  ////v1: 
//      //<button className="square" onClick={() => alert('you clicked: ' +this.props.value)} >
//      //  {this.props.value}
//      //</button>
//    );
//  }
//}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  
  // New renderSquare() func
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  
  //this will create the board
  render() {
    //const winner = calculateWinner(this.state.squares); //calculate if there is a winner (null returned if not)
    //let status; // create status variable
    //if (winner != null) {
    //  status = "Winner: " + winner;
    //}
    //else {
    //  status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    //}

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  
  // handle the clicking of a move
  jumpTo(step) {
    this.setState({
        stepNumber: step,
        xIsNext: (step % 2) ? false : true,
    });
  }
  
  
  // handle the click event
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // create copy of squares
    if (calculateWinner(squares) != null || // if already a winner
        squares[i] != null) { // or if square is filled
      return; // don't update squares.
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'; //set value, either X or O, in clicked square
    
	this.setState({
        history: history.concat([{
            squares: squares, // set the new state of the squares to the history
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext, // invert xIsNext to alernate turns
    });	
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });
    
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');  
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares} 
            onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
    [2, 4, 6],
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if( squares[a] && //if not null
        squares[a] == squares[b] && // check if a == b == c
        squares[a] == squares[c]) {
        
      return squares[a];
    }
  }
  
  return null; //no win condition has been met
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
