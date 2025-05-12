import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import tasksController from './tasks/tasks.controller';
import { connectDB } from './db/connect';
import 'dotenv/config';
/**
 * Required External Modules
 */


/**
 * App Variables
 */

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();


/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 * Server Activation
 */

// app
connectDB()
  .then((res) => {
    console.log("Connected to DB");

    app.get("/tasks", tasksController.listTasks);
    app.get("/tasks/:id", tasksController.getTaskById);
    app.post("/tasks", tasksController.createTask)
    app.put("/tasks/:id", tasksController.putTask);
    app.delete("/tasks/:id", tasksController.removeTask);

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
