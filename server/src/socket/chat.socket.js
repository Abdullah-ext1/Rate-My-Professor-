import { Message } from "../models/message.models.js"
import { socketAuth } from "../middlewares/socketAuth.js"

let onlineUsers = []

export function initChat(io) {
  io.use(socketAuth)
  io.on("connection", (socket) => {
    console.log("user connected:", socket.id, "user:", socket.user.name)
    socket.join(`user:${socket.user._id.toString()}`)

    onlineUsers.push({
      name: socket.user.name,
      college: socket.user.college,
      socketId: socket.id
    })
    
    // Emit to all clients
    io.emit("onlineUsers", onlineUsers)

    socket.on("sendMessage", async (data) => {
      try {
        const message = await Message.create({
          sender: socket.user._id,
          college: socket.user.college,
          content: data.content,
          senderName: data.senderName || 'Anonymous',
          replyTo: data.replyTo || null,
        });
        const populatedMessage = await message.populate([
          { path: "sender", select: "name avatar role username _id" },
          { path: "replyTo", select: "senderName content" }
        ]);
        io.emit("message", populatedMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    })

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
      io.emit("onlineUsers", onlineUsers)
      console.log("user disconnected:", socket.id)
    })
  })
}