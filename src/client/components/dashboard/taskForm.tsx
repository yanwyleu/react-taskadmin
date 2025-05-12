/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useRef, useEffect } from 'react';
import SelectOption from '@material-tailwind/react/components/Select/SelectOption';
import {
  Button,
  Card,
  CardHeader,
  Input,
  Select,
  Textarea,
  Typography,
} from '@material-tailwind/react';
import { Controller, useForm } from 'react-hook-form';
import { Task } from '../../../backend/tasks/task.interface';
import { useAddNewTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from '../../services/apis';
import store from '../../store';
import { openTask } from '../../features/tasks/task.slice';
import { useDispatch } from 'react-redux';

type SubmitFormInput = {
  title: string;
  description: string;
  status: string;
  userID: string;
  taskID: string;
}

// const randomString = (length) => {
//   return randomBytes(Math.ceil(length / 2))
//     .toString('hex')
//     .slice(0, length)
// }

export const formInit: Task = {
  taskID: `TASK-${(Math.random() + 1).toString(36).substring(7).toUpperCase()}`,
  title: null,
  description: null,
  status: null,
  userID: null,
}

const TaskForm = () => {

  const dispatch = useDispatch();
  const formRef = useRef();
  const [formMode, setFormMode] = useState('new');
  const [formData, setFormData] = useState<SubmitFormInput | Task>(formInit)

  const optionsList = [
    { value: "PENDG", label: "Pending" },
    { value: "INPRG", label: "In Progress" },
    { value: "ONHLD", label: "On Hold" },
    { value: "COMPD", label: "Completed" },
  ];

  const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm<Task>({
    defaultValues: formInit,
    mode: "onBlur",
    resolver: async (data) => {
      try {
        return { values: data, errors: {} }
      } catch (e) {
        // if (e instanceof z.ZodError) {
        //   return { values: {}, errors: e.errors };
        // } 
      }
    }
  })

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log('change-event: ', e.target, e.currentTarget, e)
  //   const { name, value } = e.target || { name: '', value: e };
  //   setFormData(prevData => ({ ...prevData, [name]: value }))
  // }

  // Subscribe to state changes
  const unsubscribe = store.subscribe(() => {
    const _task: Task = store.getState().tasks.task;
    console.log('State changed:', formMode, _task?.title, `${_task.title}`, _task);
    if (_task && _task.title) {
      setFormData({ ..._task });
      setFormMode('edit')
      // console.log('set-form:', _task);
    }
  });

  // const [createPost] = useAddNewTaskMutation();  
  const [addNewPost, { isLoading }] = useAddNewTaskMutation()
  const [updateTask] = useUpdateTaskMutation()

  const onSubmit = async (data: Task) => {
    await addNewPost(data).unwrap();
    onReset();
    console.log('submit-data:', data);
  }

  const onEdit = async (data: Task) => {
    await updateTask(data).unwrap();
    setFormMode('new');
    console.log('edit-data:', data);
  }
  const onCancel = (event) => {
    event.preventDefault();
    setFormMode('new');
    onReset();
    console.log('cancel-form:', formData)
  }

  const onReset = () => {
    openTask({...formInit});
    setFormData({ ...formInit });
    reset();
  }

  useEffect(() => {
    console.log('formMode-curr:', formMode)
    if (formMode == 'new') {
      onReset();
    }
  }, [formMode])

  return (
    <section className="text-left">
      <Card
        shadow={false}
        className="md:px-8 md:py-14 py-5 border border-gray-300"
      >
        <form
          className="relative"
          onSubmit={handleSubmit(onSubmit)}
          ref={formRef}
        >
          <CardHeader shadow={false} floated={false} className="text-center">
            <Typography
              variant="h1"
              color="blue-gray"
              className="mb-4 !text-3xl lg:text-4xl"
            >
              Task Form 
              {formMode == 'edit' && 'Edit'}
            </Typography>
          </CardHeader>
          <div className="">
            <div>
              <Typography
                variant="small"
                className="mb-2 text-left font-medium !text-gray-900"
              >
                Task ID
              </Typography>
              <Input
                {...register("taskID")}
                type="text"
                color="gray"
                size="lg"
                placeholder="Task ID"
                name="taskID"
                value={formData?.taskID}
                className="focus:border-t-gray-900"
                disabled
                // containerProps={{
                //   className: "min-w-full",
                // }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            <div>
              <Typography
                variant="small"
                className="mb-2 text-left font-medium !text-gray-900"
              >
                User ID
              </Typography>
              <Input
                {...register("userID")}
                type="text"
                color="gray"
                size="lg"
                placeholder="User ID"
                name="userID"
                value={formData?.userID}
                className="focus:border-t-gray-900"
                // containerProps={{
                //   className: "min-w-full",
                // }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            <div>
              <Typography
                variant="small"
                className="mb-2 text-left font-medium !text-gray-900"
              >
                Title
              </Typography>
              <Input
                {...register("title")}
                type="text"
                color="gray"
                size="lg"
                placeholder="Title"
                name="title"
                value={formData?.title}
                className="focus:border-t-gray-900"
                // containerProps={{
                //   className: "!min-w-full",
                // }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            <div>
              <Typography
                variant="small"
                className="mb-2 text-left font-medium !text-gray-900"
              >
                Description
              </Typography>
              <Textarea
                {...register("description")}
                rows={6}
                color="gray"
                placeholder="description"
                name="description"
                value={formData?.description}
                className="focus:border-t-gray-900"
                // containerProps={{
                //   className: "!min-w-full",
                // }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            <div>
              <Typography
                variant="small"
                className="mb-2 text-left font-medium !text-gray-900"
              >
                Status
              </Typography>
              <Controller
                name="status"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    variant="outlined"
                    name="data"
                    label="Select value"
                    value={formData?.status || ''}
                    onChange={onChange}>
                    {optionsList.map((it) =>
                      <SelectOption key={it.value} value={it.value}>
                        {it.label}
                      </SelectOption>
                    )}
                  </Select>
                )} />
            </div>
          </div>
          <div>
            <br />
            <div style={{ display: formMode == 'new' ? 'block' : 'none' }}>
              <Button type="submit" className="flex h-12 border-blue-gray-200 items-center justify-center gap-2" color="blue" disabled={isLoading}>
                Submit
              </Button>
              <Button type="button" onClick={onReset} className="flex h-12 border-blue-gray-200 items-center justify-center gap-2" color="gray" disabled={isLoading}>
                reset
              </Button>
            </div>
            <div style={{ display: formMode != 'new' ? 'block' : 'none' }}>
              <Button type="button" onClick={onEdit} className="flex h-12 border-blue-gray-200 items-center justify-center gap-2" color="green" >
                Update
              </Button>
              <Button type="button" onClick={onCancel} className="flex h-12 border-blue-gray-200 items-center justify-center gap-2" color="red">
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </section>
  );
}

export default TaskForm;