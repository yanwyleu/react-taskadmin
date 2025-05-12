// src/backend/tasks/task.interface.ts

import { Document } from "mongoose";

export interface TaskBase {
  title: string;
  description: string;
  status: string;
  taskID: string;
  userID: string;
  createdAt: Date | number;
  updatedAt: Date | number;
}

export interface Task extends TaskBase, Document { }
export interface NewTask extends Task { }
export interface Tasks extends Array<Task> { }
