import { useEffect, useState } from "react";
import { FaTrash, FaRegEdit } from "react-icons/fa";
import "../styles/tasks.css";

import {
  createTimeBlocking,
  getTimeBlockingItems,
  toggleTimeBlocking,
  deleteTimeBlocking,
  editTimeBlocking,
} from "../api/timeBlockingApi";

const TimeBlockingTasks = () => {
  const [tasks, setTasks] = useState([]);

  // FORM STATE
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  // EDIT STATE
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTimeBlockingItems();
      setTasks(data);
    } catch (err) {
      console.error("Load failed", err);
    }
  };

  // =========================
  // CREATE
  // =========================
  const addTask = async () => {
    if (!description.trim()) return;
    if (!startDateTime || !endDateTime) return;

    // Split datetime-local into date + time
    const [taskDate, startTime] = startDateTime.split("T");
    const [endTaskDate, endTime] = endDateTime.split("T");

    try {
      const saved = await createTimeBlocking({
        description,
        taskDate,
        startTime,
        endTaskDate,
        endTime,
      });

      setTasks((prev) => [...prev, saved]);

      setDescription("");
      setStartDateTime("");
      setEndDateTime("");
      setEditingId(null);
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  // =========================
  // TOGGLE
  // =========================
  const toggleTask = async (id) => {
    try {
      const updated = await toggleTimeBlocking(id);

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const removeTask = async (id) => {
    try {
      await deleteTimeBlocking(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // =========================
  // EDIT SAVE
  // =========================
  const saveEdit = async (task) => {
    if (!startDateTime || !endDateTime) return;

    const [taskDate, startTime] = startDateTime.split("T");
    const [endTaskDate, endTime] = endDateTime.split("T");

    try {
      const updated = await editTimeBlocking(task.id, {
        description,
        taskDate,
        startTime,
        endTaskDate,
        endTime,
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? updated : t))
      );

      setEditingId(null);
      setDescription("");
      setStartDateTime("");
      setEndDateTime("");
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  return (
    <div className="task-card">
      <h3>Time Blocking System</h3>

      {/* DESCRIPTION */}
      <div className="task-input">
        <input
          value={description}
          placeholder="Task description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* START & END */}
      <div className="datetime-section">
        <div className="datetime-block">
          <label>Start</label>
          <input
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            step="60"
          />
        </div>

        <div className="datetime-block">
          <label>End</label>
          <input
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            step="60"
          />
        </div>
      </div>

      {/* ADD / UPDATE BUTTON */}
      <div className="add-btn-wrapper">
        <button
          onClick={() =>
            editingId ? saveEdit({ id: editingId }) : addTask()
          }
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* TASK LIST */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />

            <div className="task-content">
              <span className="task-title">
                {task.taskText}
              </span>
              <small>
                {task.taskDate} {task.startTime} –{" "}
                {task.endTaskDate} {task.endTime}
              </small>
            </div>

            <div className="task-actions">
              <button
                className="edit-btn"
                onClick={() => {
                  setEditingId(task.id);
                  setDescription(task.taskText);

                  // Rebuild datetime-local value
                  setStartDateTime(
                    `${task.taskDate}T${task.startTime}`
                  );
                  setEndDateTime(
                    `${task.endTaskDate}T${task.endTime}`
                  );
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

export default TimeBlockingTasks;
