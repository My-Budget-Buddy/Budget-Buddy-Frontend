import { URL } from '../Endpoint';

const usersUrl = URL + "/users";

export const URL_findAllUsers = usersUrl;
export const URL_findUserById = usersUrl + "/user";
export const URL_createUser = usersUrl;
export const URL_updateUser = usersUrl;
export const URL_deleteUser = usersUrl;