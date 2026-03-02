const TASK_BASE_URL = "http://localhost:8080/api/dashboard/tasks";

// Common response handler
async function handleResponse(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || "Task API Error");
  }

  return data;
}

// GET tasks with filters
export async function getDashboardTasks(params = {}) {
  const token = localStorage.getItem("authToken");

  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${TASK_BASE_URL}?${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "*/*",
    },
  });

  return handleResponse(res);
}