const initialState = {
  userEmail: null,
  userPassword: null,
  userName: null,
  userSurname: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_EMAIL':
      return {
        ...state,
        userEmail: action.payload,
      };
    case 'SET_USER_PASSWORD':
      return {
        ...state,
        userPassword: action.payload,
      };
    case 'SET_USER_NAME':
      return {
        ...state,
        userName: action.payload,
      };
    case 'SET_USER_SURNAME':
      return {
        ...state,
        userSurname: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;