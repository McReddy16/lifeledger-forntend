import { useEffect, useState } from "react";
import {
  getCategories,
  getMoneyFlows,
  getPaymentTypes,
  addJournalEntry,
} from "../api/financeApi";
import "../styles/finance.css";

/**
 * Empty form template
 */
const EMPTY_FORM = {
  entryDate: "",
  category: "",
  description: "",
  amount: "",
  moneyFlow: "",
  paymentType: "",
};

export default function FinanceEntryForm({ onEntryAdded }) {
  const [categories, setCategories] = useState([]);
  const [moneyFlows, setMoneyFlows] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);

  /**
   * Load dropdown values on component load
   */
  useEffect(() => {
    async function loadDropdowns() {
      try {
        setCategories((await getCategories()) ?? []);
        setMoneyFlows((await getMoneyFlows()) ?? []);
        setPaymentTypes((await getPaymentTypes()) ?? []);
      } catch (err) {
        console.error("Dropdown API error:", err);
      }
    }
    loadDropdowns();
  }, []);

  /**
   * Limit description to 30 words
   */
  function limitTo30Words(text) {
    const words = text.trim().split(/\s+/);
    return words.length <= 30 ? text : words.slice(0, 30).join(" ");
  }

  /**
   * Handle input changes
   */
  function handleChange(e) {
    const { name, value } = e.target;

    if (!(name in form)) {
      console.error("Invalid form field:", name);
      return;
    }

    // Apply word limit only for description
    if (name === "description") {
      setForm((prev) => ({
        ...prev,
        description: limitTo30Words(value),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /**
   * Submit form data
   */
  async function handleSubmit() {
    if (
      !form.entryDate ||
      !form.category ||
      !form.amount ||
      !form.moneyFlow ||
      !form.paymentType
    ) {
      alert("Fill all required fields");
      return;
    }

    const payload = {
      entryDate: form.entryDate,
      category: form.category,
      description: form.description,
      amount: Number(form.amount),
      moneyFlow: form.moneyFlow,
      paymentType: form.paymentType,
    };

    await addJournalEntry(payload);

    setForm(EMPTY_FORM);
    onEntryAdded && onEntryAdded();
  }

  return (
    <div className="finance-entry-card">
      <h2 className="finance-title">FINANCE ENTRY</h2>

      <div className="finance-form">
        <input
          type="date"
          name="entryDate"
          value={form.entryDate}
          onChange={handleChange}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="">Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="description"
          placeholder="Description (max 30 words)"
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

        <select
          name="moneyFlow"
          value={form.moneyFlow}
          onChange={handleChange}
        >
          <option value="">IN / OUT</option>
          {moneyFlows.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          name="paymentType"
          value={form.paymentType}
          onChange={handleChange}
        >
          <option value="">Payment</option>
          {paymentTypes.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <button className="add-btn" onClick={handleSubmit}>
          + Add
        </button>
      </div>
    </div>
  );
}
