const BASE_URL = "http://localhost:8080/auth";

/* ==========================================
   COMMON RESPONSE HANDLER
========================================== */
async function handleResponse(res) {

  const text = await res.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(data?.message || data || "Request failed");
  }

  return data;
}

/* ==========================================
   LOGIN
========================================== */
export async function loginUser(payload) {

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

/* ==========================================
   SIGNUP
========================================== */
export async function signupUser(payload) {

  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

/* ==========================================
   VERIFY OTP
========================================== */
export async function verifyOtp(payload) {

  const res = await fetch(`${BASE_URL}/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

/* ==========================================
   RESEND OTP
========================================== */
export async function resendOtp(email) {

  const res = await fetch(`${BASE_URL}/resend-otp?email=${email}`, {
    method: "POST",
  });

  return handleResponse(res);
}

/* ==========================================
   FORGOT PASSWORD
========================================== */
export async function forgotPassword(email) {

  const res = await fetch(`${BASE_URL}/forgot-password?email=${email}`, {
    method: "POST",
  });

  return handleResponse(res);
}

/* ==========================================
   RESET PASSWORD (OTP FLOW)
========================================== */
export async function resetPassword(payload) {

  const res = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

/* ==========================================
   CHANGE PASSWORD (PROFILE SECURITY)
========================================== */
export async function changePassword(payload) {

  const token = localStorage.getItem("authToken");

  const res = await fetch(`${BASE_URL}/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}