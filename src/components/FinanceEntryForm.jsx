import { useEffect, useState } from "react";
import { getJournalMeta, addJournalEntry } from "../api/financeApi";
import "../styles/finance.css";

const EMPTY_FORM = {
  entryDate: "",
  category: "",
  description: "",
  amount: "",
  moneyFlow: "",
  paymentType: "",
};

export default function FinanceEntryForm({ onEntryAdded }) {
  const [meta, setMeta] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      try {
        const data = await getJournalMeta();
        setMeta(data);
      } catch (err) {
        console.error("Meta load failed:", err);
      }
    }
    loadMeta();
  }, []);

  function handleTypeChange(e) {
    const type = e.target.value;

    setSelectedType(type);
    setSelectedGroup("");
    setCategories([]);

    setForm((p) => ({
      ...p,
      category: "",
      moneyFlow: "",
    }));

    if (!meta) return;

    if (type === "INCOME") {
      setCategories(meta.incomeCategories || []);
      setForm((p) => ({ ...p, moneyFlow: "IN" }));
    }

    if (type === "EXPENSE") {
      setForm((p) => ({ ...p, moneyFlow: "OUT" }));
    }

    if (type === "INVESTMENT") {
      setCategories(meta.investmentCategories || []);
    }

    if (type === "OTHER") {
      setCategories(["OTHER"]);
    }
  }

  function handleGroupChange(e) {
    const group = e.target.value;
    setSelectedGroup(group);

    if (meta?.expenseCategories) {
      setCategories(meta.expenseCategories[group] || []);
    }

    setForm((p) => ({ ...p, category: "" }));
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "description") {
      const words = value.trim().split(/\s+/);
      const limited =
        words.length <= 30 ? value : words.slice(0, 30).join(" ");
      setForm((p) => ({ ...p, description: limited }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit() {
    if (!form.entryDate) return alert("Date required");
    if (!selectedType) return alert("Transaction type required");
    if (!form.category) return alert("Category required");
    if (!form.amount || Number(form.amount) <= 0)
      return alert("Amount must be > 0");
    if (!form.moneyFlow) return alert("Select + or -");
    if (!form.paymentType) return alert("Payment type required");

    const payload = {
      entryDate: form.entryDate,
      transactionType: selectedType,
      category: form.category,
      description: form.description,
      amount: Number(form.amount),
      moneyFlow: form.moneyFlow,
      paymentType: form.paymentType,
    };

    try {
      setSubmitting(true);
      await addJournalEntry(payload);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
        setForm(EMPTY_FORM);
        setSelectedType("");
        setSelectedGroup("");
        setCategories([]);
      }, 1500);

      if (onEntryAdded) onEntryAdded();

    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Only Button Visible */}
   <div className="financeForm-wrapper">
       <button className="primary-add-btn" onClick={() => setOpen(true)}>
      ADD ENTRY
      </button>

   </div>
      {/* Modal */}
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Add Finance Entry</h2>
              <button className="close-btn" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            {success ? (
              <div className="success-message">
                Entry Added Successfully
              </div>
            ) : (
              <div className="modal-form">
                <input
                  type="date"
                  name="entryDate"
                  value={form.entryDate}
                  onChange={handleChange}
                />

                <select value={selectedType} onChange={handleTypeChange}>
                  <option value="">Select Type</option>
                  {meta?.transactionTypes?.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                {selectedType === "EXPENSE" && (
                  <select value={selectedGroup} onChange={handleGroupChange}>
                    <option value="">Select Group</option>
                    {meta?.expenseGroups?.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                )}

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  disabled={!categories.length}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={handleChange}
                />

                {(selectedType === "INVESTMENT" || selectedType === "OTHER") && (
                  <select
                    name="moneyFlow"
                    value={form.moneyFlow}
                    onChange={handleChange}
                  >
                    <option value="">Select Flow</option>
                    <option value="IN" style={{color:"green"}}>+/IN</option>
                    <option value="OUT" style={{color:"red"}}>-/OUT</option>
                  </select>
                )}

                <select
                  name="paymentType"
                  value={form.paymentType}
                  onChange={handleChange}
                >
                  <option value="">Payment</option>
                  {meta?.paymentTypes?.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                <button
                  className="modal-submit-btn"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Adding..." : "Submit"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}