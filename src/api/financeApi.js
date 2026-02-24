// Base URLs
const JOURNAL_BASE_URL = "http://localhost:8080/api/finance/journal";
const REPORT_BASE_URL = "http://localhost:8080/api/finance/report";

// ============================
// Common Response Handler
// ============================
async function handleResponse(res) {
  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} : ${data?.message || "Request failed"}`);
  }

  return data;
}

// ============================
// Auth Headers
// ============================
function getAuthHeaders() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("JWT missing in localStorage (authToken)");
  }

  return {
    "Content-Type": "application/json",
    Accept: "*/*",
    Authorization: `Bearer ${token}`,
  };
}

// ============================
// 🔹 META (Categories, MoneyFlow, PaymentTypes)
// GET /journal/meta
// ============================
export async function getJournalMeta() {
  const res = await fetch(`${JOURNAL_BASE_URL}/meta`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// ============================
// 🔹 CREATE
// POST /journal
// ============================
export async function addJournalEntry(payload) {
  const res = await fetch(`${JOURNAL_BASE_URL}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// ============================
// 🔹 UPDATE
// PUT /journal/{id}
// ============================
export async function updateJournalEntry(id, payload) {
  const res = await fetch(`${JOURNAL_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// ============================
// 🔹 DELETE
// DELETE /journal/{id}
// ============================
export async function deleteJournalEntry(id) {
  const res = await fetch(`${JOURNAL_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// ============================
// 🔹 SEARCH + PAGINATION
// POST /journal/search
// ============================
export async function searchJournalEntries(
  filters,
  page = 0,
  size = 10,
  sortBy = "entryDate",
  direction = "desc"
) {
  const url =
    `${JOURNAL_BASE_URL}/search` +
    `?page=${page}` +
    `&size=${size}` +
    `&sortBy=${sortBy}` +
    `&direction=${direction}`;

  const res = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(filters),
  });

  return handleResponse(res);
}

// ============================
// 🔹 REPORTS
// ============================

// Daily Report
export async function getDailyReport(date) {
  const res = await fetch(`${REPORT_BASE_URL}/daily?date=${date}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// Summary Report
export async function getSummaryReport(startDate, endDate) {
  let url = `${REPORT_BASE_URL}/summary`;

  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}
