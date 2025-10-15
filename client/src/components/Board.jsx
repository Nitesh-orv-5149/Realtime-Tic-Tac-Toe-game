import { useState, useEffect } from "react";
import Tile from "./Tile";
import { io } from "socket.io-client"

const socket = io("http://localhost:4000")

export default function Board() {
  const dimensions = 3;
  const [connected, setConnected] = useState(false)
  const [board, setBoard] = useState(Array(dimensions * dimensions).fill(null));
  const [turn, setTurn] = useState("⭕");

  useEffect(() => {
    socket.connect()

    socket.on("connect", () => {
      setConnected(true)
    })

    socket.on("boardUpdate", ({ board, turn }) => {
      setBoard(board);
      setTurn(turn);
    });

    socket.emit("reset")

    socket.on("disconnect", () => {
      setConnected(false)
      console.log("Disconnected")
    })

    return () => {
      socket.off("boardUpdate");
    };
  }, []);

  const handleClick = (index) => {
    if (board[index]) return;

    socket.emit("playerMove", index);
  };

  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${dimensions}, minmax(0, 120px))` }}
    >
      {board.map((value, i) => (
        <Tile key={i} value={value} onClick={() => handleClick(i)} />
      ))}
    </div>
  );
}
