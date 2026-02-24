import { useEffect, useState } from "react";
import { FaTrash, FaRegEdit } from "react-icons/fa";
import "../styles/tasks.css";

// 🔗 API functions (ACCOUNTABILITY)
import {
  createAccountability,
  getAccountabilityTasks,
  updateAccountability,
  deleteAccountability,
  editAccountability,
} from "../api/accountabilityApi";

const AccountabilityTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // LOAD ACCOUNTABILITY TASKS
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await getAccountabilityTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load accountability tasks", err);
      }
    };

    loadTasks();
  }, []);

  // CREATE ACCOUNTABILITY TASK
  const addTask = async () => {
    if (!input.trim()) return;

    try {
      const saved = await createAccountability({ taskText: input });
      setTasks((prev) => [...prev, saved]);
      setInput("");
    } catch (err) {
      console.error("Create accountability failed", err);
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

  // DELETE ACCOUNTABILITY TASK
  const removeTask = async (id) => {
    try {
      await deleteAccountability(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // SAVE EDIT
  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const updated = await editAccountability(id, editText);

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );

      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  return (
    <div className="task-card">
      <h3>Accountability Tasks</h3>

      <div className="task-input">
        <input
          value={input}
          placeholder="Add an Accountability Task"
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

            {editingId === task.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && saveEdit(task.id)
                }
                autoFocus
              />
            ) : (
              <span>{task.taskText}</span>
            )}

            {/* ACTION ICONS */}
            <div className="task-actions">
              <button
                className={`edit-btn ${
                  editingId === task.id ? "active" : ""
                }`}
                onClick={() => {
                  setEditingId(task.id);
                  setEditText(task.taskText);
                }}
              >
                <FaRegEdit size={14} />
              </button>

              <button
                className="delete-btn"
                onClick={() => removeTask(task.id)}
              >
                <FaTrash size={13} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountabilityTasks;
