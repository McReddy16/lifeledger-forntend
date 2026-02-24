import { useEffect, useState } from "react";
import { FaTrash, FaRegEdit } from "react-icons/fa";
import "../styles/tasks.css";

// 🔗 API functions (TRACKING)
import {
  createTracking,
  getTrackingTasks,
  updateTracking,
  deleteTracking,
  editTracking,
} from "../api/trackingApi";

const TrackingTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // LOAD TRACKING TASKS
  useEffect(() => {
    const loadTrackingTasks = async () => {
      try {
        const data = await getTrackingTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tracking tasks", err);
      }
    };

    loadTrackingTasks();
  }, []);

  // CREATE TRACKING TASK
  const addTask = async () => {
    if (!input.trim()) return;

    try {
      const saved = await createTracking({ taskText: input });
      setTasks((prev) => [...prev, saved]);
      setInput("");
    } catch (err) {
      console.error("Create tracking failed", err);
    }
  };

  // TOGGLE COMPLETED
  const toggleTask = async (id) => {
    try {
      const updated = await updateTracking(id);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  // DELETE TRACKING TASK
  const removeTask = async (id) => {
    try {
      await deleteTracking(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // SAVE EDIT
  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const updated = await editTracking(id, editText);

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
      <h3>Tracking Tasks</h3>

      <div className="task-input">
        <input
          value={input}
          placeholder="Add a Tracking Task"
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

export default TrackingTasks;
