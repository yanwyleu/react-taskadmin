import Input from '@material-tailwind/react/components/Input';
import moment from 'moment';
import React from 'react';
import store from '../../store';
import { AgGridReact } from 'ag-grid-react';
import { Button, Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,  
 } from '@material-tailwind/react';
import { openTask } from '../../features/tasks/task.slice';
import { Task } from '../../../backend/tasks/task.interface';
import { TaskBase } from '../../../../../Assignment/src/backend/tasks/task.interface';
import { useDeleteTaskMutation, useGetPostsQuery, useGetTaskByIdQuery } from '../../services/apis';
import { useDispatch } from 'react-redux';
import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-material.min.css';
import { formInit } from './taskForm';

import type {
  GridApi,
  GridReadyEvent,
  GridOptions,
  ColDef,
} from "ag-grid-community";


import {
  type FunctionComponent,
  useState,
} from "react";

export const TaskList: FunctionComponent = () => {

  const [modal, setModel] = React.useState(false);
  const handleModal = () => setModel(!modal);  
  const [deleteID, setDeleteID] = useState();

  const statusDisplay = {
    PEND: "Pending",
    INPRG: "In-Progress",
    ONHLD: "On Hold",
    COMPD: "Completed",
  };

  // Calling the `useGetPostsQuery()` hook automatically fetches data!
  const {
    data: tasks = [],
    isLoading,
  } = useGetPostsQuery();
  
  const dispatch = useDispatch();

  // Calling the `useGetPostsQuery()` hook automatically fetches data!
  const [
    deleteTask,
  ] = useDeleteTaskMutation();

  let gridApi: GridApi;
  const onGridReady = (params: GridReadyEvent) => {
    gridApi = params.api;

    const columnState = { 
      state: [
        {
          colId: 'updatedAt',
          sort: 'desc'
        }
      ]
    }
    gridApi.applyColumnState(columnState);
  };

  // Update an existing post and add "HASAN" to its title
  const handleEditTask = (taskData) => {
    dispatch(openTask(taskData))
    console.log('task-edit: ', taskData, store.getState().tasks)
  };

  // Delete a post and remove it from the UI immediately
  const handleDeletePost = async (taskID: any) => {
    await deleteTask(taskID);
    dispatch(openTask({...formInit}))
    setDeleteID(null);
    handleModal();
    gridApi.redrawRows();
  };

  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: "taskID",
      // rowGroup: false,
      width: 'auto',
      suppressSizeToFit: true,
      // enableRowGroup: false,
      // enablePivot: false,
      // pinned: true,
      // editable: false,
      // cellRenderer: ProductCellRenderer,
    },
    { field: "title", rowGroup: false },
    { field: "description", rowGroup: false },
    {
      field: "status", rowGroup: false,
      valueFormatter: (_params: { value: string | number; }) => {
        return statusDisplay[_params.value] || _params.value
      }
    },
    {
      field: 'updatedAt',
      sortable: true,
      cellDataType: 'date',
      valueFormatter: (_params: { value: moment.MomentInput; }) => moment(_params.value).format('YYYY-MM-DD'),
    },
    {
      field: 'button',
      headerName: 'Action',
      width: 50,
      cellRenderer: (props: any) => {
        return <div>
          <Button size='sm' color='blue' onClick={() => handleEditTask(props.data)}>EDIT</Button>
          &nbsp;
          <Button size='sm' color='red' onClick={() => {
            setDeleteID(props.data.taskID);
            handleModal();
          }}>DEL</Button>
        </div>
      }
      ,
    },
  ]);

  const [keywordInput, setKeywordInput] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeywordInput(value);
  };

  return (
    <div className='ag-theme-material w-full h-full bg-blue-gray-50/50'>
      <div className='w-full h-full ajustify-center px-6 py-6'>
        <div className='w-full py-3'>
          <Typography
            variant="small"
            className="mb-2 text-left font-medium !text-gray-900"
          >
            Keywords
          </Typography>
          <Input
            label='Keywords'
            onChange={handleChange}
            color="gray"
            size="lg"
            placeholder="Keywords"
            name="keyword"
            className="focus:border-t-gray-900"
            labelProps={{
              className: "hidden",
            }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
        </div>
        <div className='aw-full h-full apy-3' style={{ maxHeight: '90%' }}>
          <AgGridReact
            // debug
            columnDefs={colDefs}
            quickFilterText={keywordInput}
            onGridReady={onGridReady}
            rowData={isLoading ? null : tasks}
            defaultColDef={{
              flex: 1,
              filter: false,
              suppressSizeToFit: true,
              headerComponentParams: {
                menuIcon: 'fa-bars'
              }
            }}
          />
        </div>
        <Dialog open={modal} handler={handleModal}>
          <DialogHeader>Alert</DialogHeader>
          <DialogBody>
            Confirm to delete ?
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleModal}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" onClick={() => handleDeletePost(deleteID) }>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
};
