import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import "../styles/tasks.css";

// 🔗 API functions (BACKEND CONNECTED)
import {
  createAccountability,
  getAccountabilityTasks,
  updateAccountability,
  deleteAccountability,
} from "../api/accountabilityApi";
const AccountabilityTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // LOAD ACCOUNTABILITY TASKS FROM BACKEND
  useEffect(() => {
    const loadAccountabilityTasks = async () => {
      try {
        const data = await getAccountabilityTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load accountability tasks", err);
      }
    };

    loadAccountabilityTasks();
  }, []);

  // CREATE ACCOUNTABILITY 
  const addTask = async () => {
    if (!input.trim()) return;

    try {
      const saved = await createAccountability({ taskText: input });
      setTasks((prev) => [...prev, saved]);
      setInput("");
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  // TOGGLE COMPLETED
  const toggleTask = async (id) => {
    try {
      const updated = await updateAccountability(id);
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
      await deleteAccountability(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="task-card">
      <h3>Accountability System</h3>

      <div className="task-input">
        <input
          value={input}
          placeholder="Add a Accountability Task"
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

export default AccountabilityTasks;
