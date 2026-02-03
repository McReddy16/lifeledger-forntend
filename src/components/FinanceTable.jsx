import { useState } from "react";
import {
  deleteJournalEntry,
  updateJournalEntry,
} from "../api/financeApi";

/**
 * Format date from YYYY-MM-DD → DD-MM-YY
 */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year.slice(2)}`;
}

export default function FinanceTable({ entries }) {
  // Track which row is being edited
  const [editingId, setEditingId] = useState(null);

  // Store editable description value
  const [editingDescription, setEditingDescription] = useState("");

  /**
   * Handle delete action (entire row)
   */
  async function handleDelete(id) {
    const ok = window.confirm("Delete this entry?");
    if (!ok) return;

    try {
      await deleteJournalEntry(id);
      window.location.reload(); // simple refresh for now
    } catch (err) {
      alert(err.message);
    }
  }

  /**
   * Enable inline edit for description
   */
  function handleEdit(entry) {
    setEditingId(entry.id);
    setEditingDescription(entry.description || "");
  }

  /**
   * Save updated description
   */
  async function handleSave(entry) {
    try {
      const payload = {
        ...entry,
        description: editingDescription,
      };

      await updateJournalEntry(entry.id, payload);

      setEditingId(null);
      setEditingDescription("");
      window.location.reload(); // replace with state update later
    } catch (err) {
      alert(err.message);
    }
  }

  /**
   * Cancel inline edit
   */
  function handleCancel() {
    setEditingId(null);
    setEditingDescription("");
  }

  return (
    <div className="entries-card">
      <h2 className="entries-title">Entries</h2>

      <div className="table-wrapper">
        <table className="entries-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>CATEGORY</th>
              <th>DESCRIPTION</th>
              <th>AMOUNT</th>
              <th>FLOW</th>
              <th>PAYMENT</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-entries">
                  No entries
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <tr key={e.id}>
                  {/* Date */}
                  <td>{formatDate(e.entryDate)}</td>

                  {/* Category */}
                  <td>{e.category}</td>

                  {/* Description with inline editor */}
                  <td>
                    {editingId === e.id ? (
                      <div className="inline-edit">
                        <input
                          type="text"
                          value={editingDescription}
                          onChange={(ev) =>
                            setEditingDescription(ev.target.value)
                          }
                          className="inline-input"
                        />

                        <span
                          className="inline-icon save-icon"
                          onClick={() => handleSave(e)}
                          title="Save"
                        >
                          ✔
                        </span>

                        <span
                          className="inline-icon cancel-icon"
                          onClick={handleCancel}
                          title="Cancel"
                        >
                          ✖
                        </span>
                      </div>
                    ) : (
                      <div className="desc-cell">{e.description}</div>
                    )}
                  </td>

                  {/* Amount */}
                  <td>{e.amount}</td>

                  {/* Flow badge */}
                  <td>
                    <span
                      className={`flow-badge ${
                        e.moneyFlow === "IN" ? "flow-in" : "flow-out"
                      }`}
                    >
                      {e.moneyFlow}
                    </span>
                  </td>

                  {/* Payment type */}
                  <td>{e.paymentType}</td>

                  {/* Hover actions */}
                  <td className="action-cell">
                    <span
                      className="action-icon edit-icon"
                      onClick={() => handleEdit(e)}
                      title="Edit description"
                    >
                      ✏️
                    </span>

                    <span
                      className="action-icon delete-icon"
                      onClick={() => handleDelete(e.id)}
                      title="Delete entry"
                    >
                      🗑
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
