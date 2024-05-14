export const SET_USER_EMAIL = 'SET_USER_EMAIL';

export const setUserEmail = (email) => {
  return {
    type: SET_USER_EMAIL,
    payload: email,
  };
};
export const setUserPassword = (password) => {
  return {
    type: 'SET_USER_PASSWORD',
    payload: password,
  };
};
