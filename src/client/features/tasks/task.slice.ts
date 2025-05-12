import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskBase as Task } from '../../../backend/tasks/task.interface';

export interface TasksState {
  tasks: Task[];
  task: Task;
}

const initialState : TasksState = {
  tasks: [],
  task: {
    title: '',
    description: '',
    status: '',
    taskID: '',
    userID: '',
    createdAt: 0,
    updatedAt: 0
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    getPosts: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addPost: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    openTask: (state, action: PayloadAction<Task>) => {
      state.task = action.payload;
    }
  },
});

export const { getPosts, addPost, openTask } = tasksSlice.actions;
export default tasksSlice.reducer;