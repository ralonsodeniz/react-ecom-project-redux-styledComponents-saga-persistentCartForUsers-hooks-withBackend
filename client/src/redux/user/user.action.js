import UserActionTypes from "./user.types";

// we dont use this action anymore, we now use googleSignInSuccess or emailSignInSuccess depending on the method
// export const setCurrentUser = user => ({
//   type: UserActionTypes.SET_CURRENT_USER, // this has to be the exact same string that we have in our reducer case that we want to trigger with this action
//   payload: user
// });

// we proceed to create our new user actions to change how we sign in now using the observable pattern and async functions into sagas
// the start action will just fire the action type to tell the saga that we are starting google sign in
export const googleSignInStart = () => ({
  type: UserActionTypes.GOOGLE_SIGN_IN_START
});

// fot the sign in with email we need the email and password when the action starts
export const emailSignInStart = emailAndPassword => ({
  type: UserActionTypes.EMAIL_SIGN_IN_START,
  payload: emailAndPassword
});

// for success we are going to need the actual current user at the end of it
export const signInSuccess = user => ({
  type: UserActionTypes.SIGN_IN_SUCCESS,
  payload: user
});

// for failure we need the errror message
export const signInFailure = error => ({
  type: UserActionTypes.SIGN_IN_FAILURE,
  payload: error
});

// this action will be triggered when the app mounts to check if the user is still logged in
// this will trigger a saga that will do this comprobation
export const checkUserSession = () => ({
  type: UserActionTypes.CHECK_USER_SESSION
});

// actions to incorporate sign out process to sagas
export const signOutStart = () => ({
  type: UserActionTypes.SIGN_OUT_START
});

export const signOutSuccess = () => ({
  type: UserActionTypes.SIGN_OUT_SUCCESS
});

export const signOutFailure = error => ({
  type: UserActionTypes.SIGN_OUT_FAILURE,
  payload: error
});

// actions to signup using sagas
export const signUnStart = userCredentials => ({
  type: UserActionTypes.SIGN_UP_START,
  payload: userCredentials
});

export const signUpSuccess = ({ user, additionalData }) => ({
  type: UserActionTypes.SIGN_UP_SUCCESS,
  payload: { user, additionalData }
});

export const signUpFailure = error => ({
  type: UserActionTypes.SIGN_UP_FAILURE,
  payload: error
});
