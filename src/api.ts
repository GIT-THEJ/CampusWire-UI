//const API_URL = "http://localhost:4000";
const BASE_URL = "https://circular-backend-t3mk.onrender.com";

export async function getColleges() {
  const response = await fetch(`${BASE_URL}/colleges`);

  if (!response.ok) {
    throw new Error("Failed to fetch colleges");
  }

  return response.json();
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}
export async function signupStudent(
  username: string,
  email: string,
  password: string
) {
  const response = await fetch(`${BASE_URL}/auth/signup/student`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: username,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Signup failed");
  }

  return data;
}