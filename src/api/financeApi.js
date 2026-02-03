// Base URLs for finance journal and reports
const JOURNAL_BASE_URL = "http://localhost:8080/api/finance/journal";
const REPORT_BASE_URL = "http://localhost:8080/api/finance/report";

// Handle API responses and errors
async function handleResponse(res) {
  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} : ${data?.message || "Request failed"}`);
  }

  return data;
}

// Build authorization headers
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

// Fetch finance categories
export async function getCategories() {
  const res = await fetch(`${JOURNAL_BASE_URL}/categories`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Fetch money flow types
export async function getMoneyFlows() {
  const res = await fetch(`${JOURNAL_BASE_URL}/money-flows`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Fetch payment types
export async function getPaymentTypes() {
  const res = await fetch(`${JOURNAL_BASE_URL}/payment-types`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Add a new journal entry
export async function addJournalEntry(payload) {
  const res = await fetch(`${JOURNAL_BASE_URL}/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// Update an existing journal entry
export async function updateJournalEntry(id, payload) {
  const res = await fetch(`${JOURNAL_BASE_URL}/update/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// Delete a journal entry by id
export async function deleteJournalEntry(id) {
  const res = await fetch(`${JOURNAL_BASE_URL}/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res); // returns null (204)
}

// Fetch journal entries by date range
export async function getJournalByRange(startDate, endDate) {
  const res = await fetch(
    `${JOURNAL_BASE_URL}/range?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return handleResponse(res);
}

// Fetch daily finance report
export async function getDailyReport(date) {
  const res = await fetch(`${REPORT_BASE_URL}/daily?date=${date}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// Fetch finance report by date range
export async function getRangeReport(startDate, endDate) {
  const res = await fetch(
    `${REPORT_BASE_URL}/range?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  return handleResponse(res);
}
