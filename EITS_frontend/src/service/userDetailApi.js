import { apiRequest } from "../utilities/apiRequest";

// Base URL
const BASE_USER_URL = "http://127.0.0.1:8000/auth/users/";



// Get User
export async function getUser(username) {
  const url = `${BASE_USER_URL}${username}/`;
  return await apiRequest(url, "GET");
}

// Fetch User (Optional username parameter)
export async function userFetch(username = undefined) {
  const url = username ? `${BASE_USER_URL}${username}/` : BASE_USER_URL;
  return await apiRequest(url, "GET");
}

// Suspend User
export async function suspendUser(username) {
  const url = `${BASE_USER_URL}${username}/suspend/`;
  return await apiRequest(url, "PATCH");
}

// Delete User
export async function deleteUser(username) {
  const url = `${BASE_USER_URL}${username}/`;
  return await apiRequest(url, "DELETE");
}

// Reset User Password
export async function resetPasswordUser(username) {
  const url = `${BASE_USER_URL}${username}/reset_password/`;
  return await apiRequest(url, "PATCH");
}

// Update User
export async function updateUser(data) {
  const url = `${BASE_USER_URL}${data.id}/`;
  return await apiRequest(url, "PUT", data);
}

// Create User
export async function createUser(data) {
  return await apiRequest(BASE_USER_URL, "POST", data);
}

//profile data
export async function profilefetch() {
  const url = `${BASE_USER_URL}me/`;
  return await apiRequest(url,'GET')
  }