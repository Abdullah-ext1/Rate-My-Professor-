import { Message } from "../models/message.models.js"
import { socketAuth } from "../middlewares/socketAuth.js"

let onlineUsers = []

export function initChat(io) {
  io.use(socketAuth)
  io.on("connection", (socket) => {
    console.log("user connected:", socket.id)

    onlineUsers.push({
      name: socket.user.name,
      college: socket.user.college,
      socketId: socket.id
    })
    io.emit("onlineUsers", onlineUsers)

    socket.on("sendMessage", async (data) => {
      try {
        const message = await Message.create({
          sender: socket.user._id,
          college: socket.user.college,
          content: data.content,
        })
        io.emit("message", message)
      } catch (error) {
        socket.emit("error", { message: "Failed to send message" })
      }
    })

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
      io.emit("onlineUsers", onlineUsers)
      console.log("user disconnected:", socket.id)
    })
  })
}