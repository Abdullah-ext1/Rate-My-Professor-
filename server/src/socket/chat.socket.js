import { Message } from "../models/message.models.js"
import { socketAuth } from "../middlewares/socketAuth.js"

export function initChat(io) {
    io.use(socketAuth)
    io.on("connection", (socket) => {
        console.log("user connected:", socket.id)

        socket.on("sendMessage", async (data) => {
            try {
                //create message in MongoDB
                const message = await Message.create({
                    sender: socket.user._id,
                    college: socket.user.college,
                    content: data.content,
                })

                //broadcast to everyone with io.emit
                io.emit("message", message);

            } catch (error) {
                socket.emit("error", { message: "Failed to send message" })
            }
        })

        socket.on("disconnect", () => {
            console.log("user disconnected:", socket.id)
        })
    })
}