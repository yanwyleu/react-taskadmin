import { timeStamp } from "console";
import { Task } from "../tasks/task.interface";
import * as mongoose from "mongoose";

// Defining Task Schema
const TaskSchema = new mongoose.Schema<Task>({
  title: { type: String, required: true },
  description: { type: String, required: false },
  status: { type: String, required: true },
  userID: { type: String, required: true },
  taskID: { type: String, required: true },
  createdAt: { type: Number },
  updatedAt: { type: Number },
}, {
  timestamps: true
});

// Creating and Exporting the Model
const Task = mongoose.model("task", TaskSchema);

class TasksDao {

  async addTask(task: Task) {
    const _task:Task = task || {
      title: 'aaa',
      description: 'test test',
      stataus: 'PEND',
      userID: 'AAA',
      taskID: 'CCC',
    }
    console.log('task-create:', _task);

    const doc = await Task.create(_task)
    console.log('task-create-doc:', doc);
    return await doc.save({ timestamps: { createdAt: true, updatedAt: false } });
  }

  async getTasks() {
    return Task.find();
  }

  async getTaskById(taskID: string) {
    return Task.findOne({ taskID }).exec();
  }

  async putTaskById(taskID: string, task: Task) {
    task = this.sanitiseData(task);

    const existing = await this.getTaskById(taskID)
    if (existing == null) {
      return null
    }

    return Task.findOneAndUpdate({ taskID }, task, { new: true })
  }

  async removeTaskById(taskID: string) {
    return Task.findOneAndDelete({ taskID });
  }
  
  private sanitiseData(data: Task): Task {
    delete data['_id']
    delete data['id']
    delete data['uid']

    return data
  }

  async getTasksByUserID(userID: string) {
    return Task.find({
      userID
    }).exec();
  }  
  
}

export default new TasksDao();