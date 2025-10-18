const BASE_URL = "http://localhost:8000/api/users";

// Get all users
export const getAllUsers = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

// Register a new user
export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

// Login user
export const loginUser = async (loginData) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  });

  // backend might return plain text or JSON
  const text = await res.text();
  return text;
};

// Get user details by username
export const getUserByUsername = async (username) => {
  const res = await fetch(`${BASE_URL}/${username}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
};

// ✨ Update user details (PUT)
export const updateUser = async (username, updatedUser) => {
  const res = await fetch(`${BASE_URL}/${username}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || "Failed to update user");
  return text; // e.g. "User 'john' updated successfully!"
};
