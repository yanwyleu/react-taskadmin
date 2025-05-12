/**
 * Data Model Interfaces
 */

import TasksDao from '../dao/tasks';
import { Task } from './task.interface';

/**
 * Service Methods
 */

class TasksService {
  async list(limit: number = 10, page: number = 5) {
    console.log('service-list:', TasksDao.getTasks())
    return TasksDao.getTasks();
  }

  async find(taskID: string) {
    return TasksDao.getTaskById(taskID);
  }

  async findByUserID(userID: string) {
    return TasksDao.getTasksByUserID(userID);
  }
  
  async create(task: Task) {
    return TasksDao.addTask(task);
  }

  async update(task: Task) {
    return TasksDao.putTaskById(task.taskID, task);
  }

  async delete(taskID: string) {
    return TasksDao.removeTaskById(taskID);
  }
 
}

export default new TasksService();