import "../styles/tasks.css";

import ReminderTasks from "../components/ReminderTasks";
import AccountabilityTasks from "../components/AccountabilityTasks";
import TrackingTasks from "../components/TrackingTasks";
import TimeBlockingTasks from "../components/TimeBlockingTasks";

const Tasks = () => {
  return (
    <div className="tasks-page">
      <AccountabilityTasks />
      <ReminderTasks />
      <TrackingTasks />
      <TimeBlockingTasks />
    </div>
  );
};

export default Tasks;
