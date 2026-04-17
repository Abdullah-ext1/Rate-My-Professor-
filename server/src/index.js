import { createServer } from 'http'
import { Server } from 'socket.io'
import app from './app.js'
import { connectDb } from "./db/db.connection.js"
import { initChat } from './socket/chat.socket.js'

connectDb()
.then(() => {
  const server = createServer(app)
 const io = new Server(server, {
  cors: {
    origin: process.env.CORS || 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST"]
  }
})

  app.set('io', io)

  initChat(io)

  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
  })
})
.catch((error) => {
  console.error('Failed to connect to the database:', error)
})