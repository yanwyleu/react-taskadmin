import React, { Children, useState } from "react";
import axios from 'axios'
// import CustomTextField from "../form/textField";
import { Button, Card, CardHeader, Input, List, ListItem, Select, Textarea, Typography } from "@material-tailwind/react";

// import CustomDropDown from "./CustomDropDown";
import { Controller, useForm } from "react-hook-form";
import SelectOption from "@material-tailwind/react/components/Select/SelectOption";

type SubmitFormInput = {
  title: string;
  description: string;
  status: string;
  userID: string;
  taskID: string;
}

const ages = [
  { value: "20-40", label: "From 20 to 40" },
  { value: "40-50", label: "From 40 to 50" },
]

const TaskForm = () => {

  const [formData, setFormData] = useState<SubmitFormInput>({
    title: '',
    description: '',
    status: '',
    userID: '',
    taskID: '',
  })

  const optionsList = [
    { value: "PENDG", label: "Pending" },
    { value: "INPRG", label: "In Progress" },
    { value: "ONHLD", label: "On Hold" },
    { value: "COMPD", label: "Completed" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('change-event: ', e.target, e.currentTarget, e)
    const { name, value } = e.target || { name: '', value: e };
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const onSubmit = (data) => {
    console.log('submit-data:', data);
  }
    
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<SubmitFormInput>({
    mode: "onBlur",
    resolver: async (data) => {
      try {
        // await schema.validate(data);
        return { values: data, errors: {} }
      } catch (e) {
        // if (e instanceof z.ZodError) {
        //   return { values: {}, errors: e.errors };
        // } 
      }
    }
  })

  console.log('watch: ', watch('taskID'), watch('title'))


  const formSubmit = async (e) => {
    e.preventDefault();
    console.log('submit-data:', formData)
    try {
      // const response = await axios.post('http://localhost:4040/tasks', formData, {
      //   headers: {
      //     // Overwrite Axios's automatically set Content-Type
      //     'Content-Type': 'application/json'
      //   }
      // });
      // console.log(response); //Will result in an error because the above endpoint doesn't exist yet
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  // const SelectOption = ({ key, value }) => {
  //   // "image" will DOM image element or undefined
  //   return new Option('Pending', 'PEND');
  // };


  return (
    <section className="text-left">
      <Card
        shadow={false}
        className="md:px-24 md:py-14 py-8 border border-gray-300"
      >
        <form
          className="relative"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CardHeader shadow={false} floated={false} className="text-center">
            <Typography
              variant="h1"
              color="blue-gray"
              className="mb-4 !text-3xl lg:text-4xl"
            >
              Task Entry Form
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
              {/* <Select variant="outlined" label="Select Version" children={['PENDG', 'INPRG']} placeholder={'Select Version'} onChange={handleChange}>
                {/* <Option value='PENDG'>Pending</Option>
                <Option value='INPRG'>In Progress</Option>
                <Option value='ONHLD'>On Hold</Option>
                <Option value='COMPD'>Completed</Option> 
              </Select> */}
              <Controller
                name="status"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    variant="outlined"
                    name="data"
                    label="Select value"
                    value={formData.status}
                    onChange={onChange}>
                    {optionsList.map((it) =>
                      <SelectOption key={it.value} value={it.value}>
                        {it.label}
                      </SelectOption>
                    )}
                  </Select>
                )} />              
              {/* <Select
                {...register("status")}
                onChange={(value) => { setValue('selection', value); trigger('selection'); }} 
                value={formData.status}
                name="status"
                >
                {optionsList.map((it) =>
                  <SelectOption key={it.value} value={it.value}>
                    {it.label}
                  </SelectOption>
                )}
              </Select> */}
            </div>
          </div>
          <div>
            <br />
            <Button type="submit" className="flex h-12 border-blue-gray-200 items-center justify-center gap-2" color="gray">
              Send message
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}

export default TaskForm;