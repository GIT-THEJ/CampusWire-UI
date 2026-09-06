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

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    const text = await response.text();

    console.error("Login returned non-JSON response:", text);

    throw new Error(
      `Server returned ${response.status} instead of JSON.`
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

export async function registerAdmin(data: {
  full_name: string;
  email: string;
  password: string;
  college_id: number;
  designation: string;
}) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      role: "admin",
      college_id: data.college_id,
      designation: data.designation,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Admin registration failed");
  }

  return result;
}

// ============================================================
// CURRENT USER
// ============================================================

export async function getCurrentUser() {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch account details");
  }

  return data.user;
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
export async function getEvents(params?: {
  college_id?: number;
  category?: string;
  search?: string;
  lat?: number;
  lng?: number;
}) {
  const query = new URLSearchParams();

  if (params?.college_id !== undefined) {
    query.set("college_id", String(params.college_id));
  }

  if (params?.category) {
    query.set("category", params.category);
  }

  if (params?.search) {
    query.set("search", params.search);
  }

  if (params?.lat !== undefined) {
    query.set("lat", String(params.lat));
  }

  if (params?.lng !== undefined) {
    query.set("lng", String(params.lng));
  }

  const queryString = query.toString();

  const response = await fetch(
    `${BASE_URL}/events${queryString ? `?${queryString}` : ""}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch events");
  }

  return Array.isArray(data) ? data : data.events || [];
}





// ============================================================
// NOTIFICATIONS
// ============================================================

function getAuthHeaders() {
  const token =
    localStorage.getItem("campuswire-token") ||
    sessionStorage.getItem("campuswire-token");

  if (!token) {
    throw new Error("You are not logged in.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}


// Get all notifications
export async function getNotifications() {
  const response = await fetch(`${BASE_URL}/notifications`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch notifications");
  }

  return data;
}


// Get unread notification count
export async function getUnreadNotificationCount() {
  const response = await fetch(`${BASE_URL}/notifications/unread`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch unread notifications");
  }

  return data;
}


// Mark one notification as read
export async function markNotificationAsRead(id: number) {
  const response = await fetch(
    `${BASE_URL}/notifications/${id}/read`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to mark notification as read");
  }

  return data;
}


// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  const response = await fetch(
    `${BASE_URL}/notifications/read-all`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to mark notifications as read");
  }

  return data;
}
// ============================================================
// BOOKMARKS
// ============================================================

// Get all bookmarks for the logged-in user
export async function getBookmarks() {
  const response = await fetch(`${BASE_URL}/bookmarks`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch bookmarks");
  }

  return data;
}


// Add an event to bookmarks
export async function addBookmark(eventId: number) {
  const response = await fetch(`${BASE_URL}/bookmarks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      event_id: eventId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to bookmark event");
  }

  return data;
}


// Remove an event from bookmarks
export async function removeBookmark(eventId: number) {
  const response = await fetch(`${BASE_URL}/bookmarks/${eventId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to remove bookmark");
  }

  return data;
}