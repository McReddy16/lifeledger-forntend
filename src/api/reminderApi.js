// =====================================================
// REMINDER SYSTEM – API CALLS
// =====================================================

const BASE_URL = "http://localhost:8080/api/reminders";

// =====================================================
// SHARED RESPONSE HANDLER
// =====================================================
async function handleResponse(res) {
  if (res.status === 204) return null; // DELETE case

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

// =====================================================
// 🔐 AUTH HEADER HELPER
// =====================================================
function getAuthHeaders() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No auth token found. User not logged in.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// =====================================================
// CREATE A NEW REMINDER
// =====================================================
export async function createReminder(payload) {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// =====================================================
// 📥 FETCH ALL REMINDERS
// =====================================================
export async function getReminders() {
  const res = await fetch(`${BASE_URL}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// =====================================================
// ✅ TOGGLE REMINDER COMPLETED STATUS
// =====================================================
export async function updateReminder(id) {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// =====================================================
// 🗑️ SOFT DELETE A REMINDER
// =====================================================
export async function deleteReminder(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  

  return handleResponse(res);
}

// =====================================================
// ✏️ EDIT REMINDER TASK TEXT
// =====================================================
export async function editReminder(id, taskText) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      description: taskText,
    }),
  });

  return handleResponse(res);
}
