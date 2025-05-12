import TaskForm from "../components/dashboard/taskForm";
import { TaskList } from "../components/dashboard/taskList";

export default function TaskAdminHome() {
  
  return (
    <>
      <div className="grid grid-cols-12 gap-3 w-full h-full">
        <div className="col-span-3 space-y-6 ">
          <TaskForm/>
        </div>

        <div className="col-span-8">
          <TaskList />
        </div>
      </div>
    </>
  );
}
