// we import express to add types to the request/response objects from our controller functions
import express from 'express';

// we import our newly created user services
import TaskService from "./tasks.service";

class TasksController {
  async listTasks(req: express.Request, res: express.Response) {
    try {
      const tasks = await TaskService.list();
      // console.log('control-list:', tasks)
      res.status(200).json(tasks);
    } catch (e) {
      res.status(500).json({
        errorCode: 500,
        message: e
      });
    }
  }

  async getTaskById(req: express.Request, res: express.Response) {
    try {
      const task = await TaskService.find(req.params.id);
      res.status(200).json(task);
    } catch (e) {
      res.status(500).json({
        errorCode: 500,
        message: e
      });
    }
  }

  async createTask(req: express.Request, res: express.Response) {
    try {
      const taskDoc = await TaskService.create(req.body);
      console.log('create-resp:', taskDoc)
      res.status(201).json(taskDoc);
    } catch (e) {
      res.status(500).json({
        errorCode: 500,
        message: e
      });
    }
  }

  async putTask(req: express.Request, res: express.Response) {
    try {
      const taskDoc = await TaskService.update(req.body);
      res.status(201).json(taskDoc);
    } catch (e) {
      res.status(500).json({
        errorCode: 500,
        message: e
      });
    }
  }

  async removeTask(req: express.Request, res: express.Response) {
    try {
      const taskDoc = await TaskService.delete(req.params.id);
      console.log('delete-task:', taskDoc)
      res.status(201).json(taskDoc);
    } catch (e) {
      res.status(500).json({
        errorCode: 500,
        message: e
      });
    }
  }
}

export default new TasksController();