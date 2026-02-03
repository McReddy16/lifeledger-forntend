// Handles authentication-related API calls (login & signup)
const BASE_URL = "http://localhost:8080/auth";

// Shared response handler for all auth API requests
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// Login user with credentials and return backend response
export async function loginUser(payload) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// Register a new user and return backend response
export async function signupUser(payload) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
