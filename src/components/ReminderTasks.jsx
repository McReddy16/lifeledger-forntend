import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import "../styles/tasks.css";

// 🔗 API functions (BACKEND CONNECTED)
import {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
} from "../api/reminderApi";

const ReminderTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // LOAD REMINDERS FROM BACKEND
  useEffect(() => {
    const loadReminders = async () => {
      try {
        const data = await getReminders();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load reminders", err);
      }
    };

    loadReminders();
  }, []);

  // CREATE REMINDER
  const addTask = async () => {
    if (!input.trim()) return;

    try {
      const saved = await createReminder({ taskText: input });
      setTasks((prev) => [...prev, saved]);
      setInput("");
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  // TOGGLE COMPLETED
  const toggleTask = async (id) => {
    try {
      const updated = await updateReminder(id);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  // DELETE REMINDER
  const removeTask = async (id) => {
    try {
      await deleteReminder(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="task-card">
      <h3>Reminder System</h3>

      <div className="task-input">
        <input
          value={input}
          placeholder="Add a Reminder Task"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>

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

export default ReminderTasks;
