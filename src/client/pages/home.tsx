import TaskForm from "../components/dashboard/taskForm";
import { TaskList } from "../components/dashboard/taskList";

export default function TaskAdminHome() {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-6 space-y-6 xl:col-span-5">
          <TaskForm/>
        </div>

        <div className="col-span-6 xl:col-span-7">
          <TaskList/>
        </div>
      </div>
    </>
  );
}
