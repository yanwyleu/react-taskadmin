import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchTasks, useGetPostsQuery } from '../services/apis';
import { TaskBase as Task } from '../../backend/tasks/task.interface.ts';

const Posts: React.FC = () => {
  const dispatch = useDispatch();
  // const tasks = useSelector((state: RootState) => state.tasks);
  const { data: tasks, error, isLoading } = useGetPostsQuery(); // Use RTK Query hook


  // useEffect(() => {
  //   fetchTasks().then((data) => {
  //     dispatch(setPosts(data));
  //   });
  // }, [dispatch]);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {tasks?.map((task: Task) => (
            <li key={task.id}>{task.title}</li>
          ))
        }
      </ul>
    </div>
  );
};

export default Posts;