import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import "../styles/tasks.css";

// 🔗 BACKEND API
import {
  createTimeBlocking,
  getTimeBlockingItems,
  updateTimeBlocking,
  deleteTimeBlocking,
} from "../api/timeBlockingApi";

const TimeBlockingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // LOAD TIME BLOCKS FROM BACKEND
  useEffect(() => {
    const loadTimeBlocks = async () => {
      try {
        const data = await getTimeBlockingItems();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load time blocks", err);
      }
    };

    loadTimeBlocks();
  }, []);

  // CREATE TIME BLOCK
  const addTask = async () => {
    if (!input.trim()) return;

    try {
      const saved = await createTimeBlocking({
        taskText: input,
      });

      setTasks((prev) => [...prev, saved]);
      setInput("");
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  // TOGGLE COMPLETED
  const toggleTask = async (id) => {
    try {
      const updated = await updateTimeBlocking(id);

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  // DELETE TIME BLOCK
  const removeTask = async (id) => {
    try {
      await deleteTimeBlocking(id);

      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="task-card">
      <h3>Time Blocking System</h3>

      {/* INPUT */}
      <div className="task-input">
        <input
          value={input}
          placeholder="Add a Time Blocking Task"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* TASK LIST */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={task.completed ? "completed" : ""}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />

            <span>{task.taskText}</span>

            <button
              className="delete-btn"
              onClick={() => removeTask(task.id)}
            >
              <FaTrash size={13} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeBlockingTasks;
