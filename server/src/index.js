import app from './app.js';
import {connectDb} from "./db/db.connection.js"

connectDb()
.then( () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
})
.catch( (error) => {
  console.error('Failed to connect to the database:', error);
})