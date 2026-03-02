import "../styles/performance.css";

// Motivation logic
const getMotivation = (completed, total) => {
  if (total === 0) return "No tasks yet. Start execution.";
  if (completed === total) return "🔥 All tasks completed. Elite discipline.";
  if (completed === 0) return "No progress. Discipline > Motivation.";
  return "⚡ Progress made. Finish strong.";
};

// Format backend enum to readable text
const formatLabel = (type) => {
  return type
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function TaskPerformanceCards({ tasks = [] }) {

  const categories = [
    "REMINDER",
    "ACCOUNTABILITY",
    "TRACKING",
    "TIME_BLOCKING"
  ];

  return (
    <>
      {categories.map((type) => {

        const categoryTasks = tasks.filter(
          t => t.taskType === type
        );

        const total = categoryTasks.length;
        const completed = categoryTasks.filter(t => t.completed).length;
        const pending = total - completed;

        const motivation = getMotivation(completed, total);

        return (
          <div key={type} className="task-card1">
            <h3>{formatLabel(type)}</h3>

            <p>Total: {total}</p>
            <p>Completed: {completed}</p>
            <p>Pending: {pending}</p>

            <hr />

            <p className="motivation">{motivation}</p>
          </div>
        );
      })}
    </>
  );
}