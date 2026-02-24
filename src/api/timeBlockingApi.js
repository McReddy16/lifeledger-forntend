// =====================================================
// TIME BLOCKING SYSTEM – API CALLS
// =====================================================

const BASE_URL = "http://localhost:8080/api/timeBlocking";

// =====================================================
// SHARED RESPONSE HANDLER
// =====================================================
async function handleResponse(res) {
  if (res.status === 204) return null;

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
// ➕ CREATE TIME BLOCK
// =====================================================
export async function createTimeBlocking({
  description,
  taskDate,
  startTime,
  endTaskDate,
  endTime,
}) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      description,
      taskDate,
      startTime,
      endTaskDate,
      endTime,
    }),
  });

  return handleResponse(res);
}

// =====================================================
// 📥 FETCH ALL TIME BLOCKS
// =====================================================
export async function getTimeBlockingItems() {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// =====================================================
// ✅ TOGGLE COMPLETED
// =====================================================
export async function toggleTimeBlocking(id) {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// =====================================================
// 🗑️ DELETE TIME BLOCK
// =====================================================
export async function deleteTimeBlocking(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

// =====================================================
// ✏️ EDIT TIME BLOCK (FULL UPDATE REQUIRED)
// =====================================================
export async function editTimeBlocking(id, {
  description,
  taskDate,
  startTime,
  endTaskDate,
  endTime,
}) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      description,
      taskDate,
      startTime,
      endTaskDate,
      endTime,
    }),
  });

  return handleResponse(res);
}
