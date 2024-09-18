import { URL } from "../Endpoint";

// Registers a user
export const URL_registerUser = URL + "/register";

// Login
export const URL_loginUser = URL + "/login";

// Converts an oauth to a login
export const URL_oauth2SocialLogin = URL + "/login/oauth2";

// Logout
export const URL_logout = URL + "/logout/redirect";

// Update password
export const URL_updatePassword = URL + "/update/password";

// Validate token
export const URL_validateJwt = URL + "/validate";