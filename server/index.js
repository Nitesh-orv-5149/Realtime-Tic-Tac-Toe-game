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

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.emit("boardUpdate", { board, turn })

  socket.on("playerMove", (index) => {
    if (board[index]) return

    board[index] = turn
    turn = turn === "⭕" ? "❌" : "⭕"

    
    io.emit("boardUpdate", { board, turn }) 
    console.log(board)
    
    const winner = checkWinner(board)
    if (winner === null) return
    console.log(winner)

    io.emit("winner", winner)
  })

  socket.on("reset", () => {
    board = Array(dimensions * dimensions).fill(null)
    turn = "⭕"
    io.emit("boardUpdate", { board, turn })
  })

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

server.listen(4000, () => {
  console.log("server started at port - http://localhost:4000")
})
