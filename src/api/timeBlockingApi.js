// =====================================================
// REMINDER SYSTEM – API CALLS
// =====================================================

const BASE_URL = "http://localhost:8080/api/timeBlocking";

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
// CREATE A NEW TIME BLOCKING ITEM
// =====================================================
export async function createTimeBlocking(payload) {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// =====================================================
// 📥 FETCH ALL TIME BLOCKING ITEMS
// =====================================================
export async function getTimeBlockingItems() {
  const res = await fetch(`${BASE_URL}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// =====================================================
// ✅ TOGGLE TIME BLOCKING ITEM COMPLETED STATUS
// =====================================================
export async function updateTimeBlocking(id) {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// =====================================================
// 🗑️ SOFT DELETE A TIME BLOCKING ITEM
// =====================================================
export async function deleteTimeBlocking(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}
