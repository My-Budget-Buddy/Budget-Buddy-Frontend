import { URL } from "../Endpoint";

const authUrl = URL + "/auth";

// Registers a user
export const URL_registerUser = authUrl + "/register";

// Login
export const URL_loginUser = authUrl + "/login";

// Converts an oauth to a login
export const URL_oauth2SocialLogin = authUrl + "/login/oauth2";

// Logout
export const URL_logout = authUrl + "/logout/redirect";

// Update password
export const URL_updatePassword = authUrl + "/update/password";

// Validate token
export const URL_validateJwt = authUrl + "/validate";