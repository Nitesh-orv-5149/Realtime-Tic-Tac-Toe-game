import { useEffect, useState } from "react"
import Board from "./components/Board"
import Greetings from "./components/Greetings"
import { io } from "socket.io-client"

const socket = io("http://localhost:4000")


function App() {
  const [winner, setWinner] = useState(null)

  useEffect(() => {
    socket.on("winner", (winner) => {
      setWinner(winner.winner)
    })
  }, [])
  

  return (
    <>
      <main className="h-[100vh] w-full flex flex-col justify-between items-center ">
        <Greetings/>
        {winner && (
          <div>The winner is {winner}</div>
        )
        }
        <button className="p-2 px-3 bg-red-400 hover:bg-red-600 hover:scale-110 transition-all duration-100 rounded-full font-bold" onClick={() => socket.emit("reset")}>Reset</button>
        <Board/>
        <div />
      </main>
    </>
  )
}

export default App
