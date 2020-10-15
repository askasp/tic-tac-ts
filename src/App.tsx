import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  type Player = "X" | "O"
  type Result = "Draw" | "Not Finished" | "Player X Won" | "Player O Won"

  type BoxState =  "" | Player
  let initBox: BoxState = "";
  let xPlayer: Player = "X"
  let oPlayer: Player = "O"
  let initBoard: Array<Array<BoxState>> = [[initBox, initBox, initBox],[initBox,initBox,initBox],[initBox,initBox,initBox]] 

  const [board, setBoard] = useState(initBoard);
  const [nextPlayer, setNextPlayer] = useState<Player>(xPlayer);
  const [result, setResult] = useState<Result>("Not Finished");
  
  const handleChange = (row: number,column: number) => {
    if (board[row][column] == ""){
      let copy = [...board]
      copy[row][column] = nextPlayer
      setBoard(copy)
      let gameStatus: Result = checkIfFinished(copy)
      setResult(gameStatus)

      if (nextPlayer == xPlayer) {
        setNextPlayer(oPlayer)
      }
      else{        
        setNextPlayer(xPlayer)
      }
  }
}

const allEqual = (arr:any) => arr.every( (v:any) => v === arr[0] )
function transpose(a: any) {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r:any) { return r[c]; });
    });
}

const checkRowVictory = (board:Array<Array<BoxState>>) => board.map(row => {  
        if (allEqual(row)) return(row[0])
        })


function checkIfFinished(board:Array<Array<BoxState>>){
  // Check if all boxes have been played
  if (!(board.flat().includes(""))) {
    return "Draw"
  }

  //Check for row victory // Real version. 
  let row_victory = checkRowVictory(board)
  if (row_victory.includes("X"))  {
      return("Player X Won")
  } else if (row_victory.includes("O")){
      return("Player O Won")
  }
  
  //Check column victory
  let transposed_board = transpose(board)
  let col_victory = checkRowVictory(transposed_board)
  if (col_victory.includes("X"))  {
      return("Player X Won")
  } else if (col_victory.includes("O")){
      return("Player O Won")
  }


  // Check diagonal victory
  let first_diag = allEqual([ board[0][0] , board[1][1], board[2][2] ])
  let second_diag = allEqual([ board[0][2] , board[1][1], board[2][0] ])
  
  if (first_diag ||  second_diag) {
    if(board[1][1] == "X"){
      return("Player X Won")
    }
    else if(board[1][1] == "O"){
      return("Player O Won")
    }
  }
  

  return "Not Finished"
  
}


  const Box = (props: {content: BoxState, callback: any}) => 
      <button 
      className="Box"
        onClick={ () => props.callback()}> 
      {props.content}
      </button>

  const Row = (props: {row: Array<BoxState>, rowIndex:number}) => {
    let row = props.row.map((content:BoxState, colIndex:number) => <Box key={colIndex} content={content} callback={() => handleChange(props.rowIndex, colIndex)}/> )
    return(<div> {row} </div>)
  }

  const Game = (props: any) => {
    let game = props.board.map((row: Array<BoxState>, rowIndex: number) => <Row row={row} key={rowIndex} rowIndex={rowIndex} />)
    return(<div> {game} </div>)
  }

  const GameFinished= () =>  
    <div> 
      <p> {result} </p>
       <button onClick={() => {
        setBoard(initBoard)
        setResult("Not Finished")
      }}> Play Again!</button> </div>
  return (
    <div className="App" >
      <h1> Tic Tac TS</h1>
      <Game board={board}/>
      {result == "Not Finished" && <h2> Player {nextPlayer}'s turn</h2>}
      {result != "Not Finished" && <GameFinished/>}
      </div>
    

  );
}



export default App;
