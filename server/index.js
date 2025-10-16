const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

const checkWinner = require("./state")

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

const dimensions = 3
let board = Array(dimensions * dimensions).fill(null)
let turn = "⭕"
let winner = null

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.emit("boardUpdate", { board, turn })

  socket.on("playerMove", (index) => {
    if (winner !== null) return

    if (board[index]) return

    board[index] = turn
    turn = turn === "⭕" ? "❌" : "⭕"

    
    io.emit("boardUpdate", { board, turn }) 
    console.log(board)
    
    const gameWinner = checkWinner(board)
    
    if (gameWinner !== null) {
      winner = gameWinner
      console.log(winner)
      io.emit("winner", winner)
    }
  })

  socket.on("reset", () => {
    if (dimensions === null) {
      console.log("no dimension")
    }
    board = Array(dimensions * dimensions).fill(null)
    turn = "⭕"
    winner = null
    console.log(winner)
    io.emit("winner", null)
    io.emit("boardUpdate", { board, turn, winner })
  })

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

server.listen(4000, () => {
  console.log("server started at port - http://localhost:4000")
})
