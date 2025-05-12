import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Task } from '../../backend/tasks/task.interface';

// Create an API service
export const tasksApi = createApi({
	reducerPath: 'tasksApi',
	baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:4040',
	}), // API base URL
	tagTypes: ['Task', 'Tasks'],
	endpoints: (builder) => ({
		// Define a "getPosts" endpoint to fetch posts
		getPosts: builder.query<Task[], void>({
			query: () => ({
				url: 'tasks',
				method: 'GET',
			}),
			providesTags: ['Tasks'],
		}),

		getTaskById: builder.query({
			// Define query with post ID in the URL path
			query: (id) => `/tasks/${id}`,

			// Tag individual post by ID for selective cache invalidation
			providesTags: (result, error, taskID) => [{ type: 'Tasks', taskID }],
		}),

		// Mutation to create a new post
		addNewTask: builder.mutation({
			// Configure the POST request details and payload
			query: (newTask: Task) => ({
				url: 'tasks',
				method: 'POST',
				body: newTask,
			}),
			// Invalidate all posts (paginated list) to refresh after creating a post
			invalidatesTags: ['Tasks'],
		}),

		// Mutation to create a new post
		updateTask: builder.mutation({
			query: ({ taskID, ...updatedData }) => ({
				url: `/tasks/${taskID}`,
				method: 'PUT',
				body: updatedData,
			}),
			invalidatesTags: ['Tasks'],
		}),

		// Mutation to create a new post
		deleteTask: builder.mutation({
			// Configure the POST request details and payload
			query: (taskID) => ({
				url: 'tasks/' + taskID,
				method: 'DELETE',
			}),
			// Invalidate all posts (paginated list) to refresh after creating a post
			invalidatesTags: ['Tasks'],
		}),
	}),
});

export const { useGetPostsQuery, useGetTaskByIdQuery, useAddNewTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } = tasksApi;
