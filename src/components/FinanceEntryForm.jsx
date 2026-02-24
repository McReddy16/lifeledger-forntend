import { useEffect, useState } from "react";
import { getJournalMeta, addJournalEntry } from "../api/financeApi"; 
// ✅ FIXED: use addJournalEntry (not createJournalEntry)

import "../styles/finance.css";

/* ===============================
   INITIAL EMPTY FORM STATE
================================= */
const EMPTY_FORM = {
  entryDate: "",      // yyyy-mm-dd (browser format)
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

  /* ===============================
     LOAD META DATA (dropdown values)
     GET /journal/meta
  ================================= */
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

  /* ===============================
     HANDLE TRANSACTION TYPE CHANGE
  ================================= */
  function handleTypeChange(e) {
    const type = e.target.value;

    setSelectedType(type);
    setSelectedGroup("");
    setCategories([]);

    // reset dependent fields
    setForm((p) => ({
      ...p,
      category: "",
      moneyFlow: "",
    }));

    if (!meta) return;

    if (type === "INCOME") {
      setCategories(meta.incomeCategories || []);
      setForm((p) => ({ ...p, moneyFlow: "IN" })); // auto +
    }

    if (type === "EXPENSE") {
      setForm((p) => ({ ...p, moneyFlow: "OUT" })); // auto -
    }

    if (type === "INVESTMENT") {
      setCategories(meta.investmentCategories || []);
    }

    if (type === "OTHER") {
      setCategories(["OTHER"]);
    }
  }

  /* ===============================
     HANDLE EXPENSE GROUP
  ================================= */
  function handleGroupChange(e) {
    const group = e.target.value;

    setSelectedGroup(group);

    if (meta?.expenseCategories) {
      setCategories(meta.expenseCategories[group] || []);
    }

    setForm((p) => ({ ...p, category: "" }));
  }

  /* ===============================
     HANDLE INPUT CHANGE
  ================================= */
  function handleChange(e) {
    const { name, value } = e.target;

    // Limit description to 30 words
    if (name === "description") {
      const words = value.trim().split(/\s+/);
      const limited =
        words.length <= 30 ? value : words.slice(0, 30).join(" ");
      setForm((p) => ({ ...p, description: limited }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  }

  /* ===============================
     SUBMIT FORM
  ================================= */
  async function handleSubmit() {
    if (!form.entryDate) return alert("Date required");
    if (!selectedType) return alert("Transaction type required");
    if (!form.category) return alert("Category required");
    if (!form.amount || Number(form.amount) <= 0)
      return alert("Amount must be > 0");
    if (!form.moneyFlow) return alert("Select + or -");
    if (!form.paymentType) return alert("Payment type required");

    const payload = {
      entryDate: form.entryDate, // yyyy-mm-dd (Spring Boot friendly)
      transactionType: selectedType,
      category: form.category,
      description: form.description,
      amount: Number(form.amount),
      moneyFlow: form.moneyFlow,
      paymentType: form.paymentType,
    };

    try {
      setSubmitting(true);

      await addJournalEntry(payload); // ✅ FIXED FUNCTION

      // Reset everything after success
      setForm(EMPTY_FORM);
      setSelectedType("");
      setSelectedGroup("");
      setCategories([]);

      if (onEntryAdded) onEntryAdded(); // refresh table

    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="finance-entry-card">
      <h2 className="finance-title">FINANCE ENTRY</h2>

      <div className="finance-form">

        {/* ================= DATE ================= */}
        <input
          type="date"
          name="entryDate"
          value={form.entryDate}
          onChange={handleChange}
        />

        {/* ================= TYPE ================= */}
        <select value={selectedType} onChange={handleTypeChange}>
          <option value="">Select Type</option>
          {meta?.transactionTypes?.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* ================= EXPENSE GROUP ================= */}
        {selectedType === "EXPENSE" && (
          <select value={selectedGroup} onChange={handleGroupChange}>
            <option value="">Select Group</option>
            {meta?.expenseGroups?.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        )}

        {/* ================= CATEGORY ================= */}
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

        {/* ================= DESCRIPTION ================= */}
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        {/* ================= AMOUNT ================= */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />

        {/* ================= MONEY FLOW ================= */}
        {selectedType === "INCOME" && (
          <input type="text" value="+" readOnly />
        )}

        {selectedType === "EXPENSE" && (
          <input type="text" value="-" readOnly />
        )}

        {(selectedType === "INVESTMENT" || selectedType === "OTHER") && (
          <select
            name="moneyFlow"
            value={form.moneyFlow}
            onChange={handleChange}
          >
            <option value="">Select Flow</option>
            <option value="IN">+</option>
            <option value="OUT">-</option>
          </select>
        )}

        {/* ================= PAYMENT TYPE ================= */}
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

        {/* ================= SUBMIT ================= */}
        <button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Adding..." : "+ Add"}
        </button>

      </div>
    </div>
  );
}
