// =====================================================
// REMINDER SYSTEM – API CALLS
// =====================================================

const BASE_URL = "http://localhost:8080/api/tracking";

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
// CREATE A NEW TRACKING ITEM
// =====================================================
export async function createTracking(payload) {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

// =====================================================
// 📥 FETCH ALL TRACKING ITEMS
// =====================================================
export async function getTrackingTasks() {
  const res = await fetch(`${BASE_URL}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// =====================================================
// ✅ TOGGLE TRACKING ITEM COMPLETED STATUS
// =====================================================
export async function updateTracking(id) {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// =====================================================
// 🗑️ SOFT DELETE A TRACKING ITEM
// =====================================================
export async function deleteTracking(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}
