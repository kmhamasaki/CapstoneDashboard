import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBXNXxXXzGTQCX1Y3RD60pZ0xpjZlK-97U",
  authDomain: "capstone-e11d2.firebaseapp.com",
  databaseURL: "https://capstone-e11d2.firebaseio.com",
  projectId: "capstone-e11d2",
  storageBucket: "capstone-e11d2.appspot.com",
  messagingSenderId: "275917336291",
  appId: "1:275917336291:web:305e1c106326a95ad51fd6",
  measurementId: "G-NFV7D1W1XR"
};

export const fire = firebase.initializeApp(firebaseConfig);
export default fire;

export const loggedIn = 'KEY_FOR_LOCAL_STORAGE';

export const isAuthenticated = () => {
  var mybool = !!fire.auth.currentUser || localStorage.getItem(loggedIn);
 // alert(mybool);
  return mybool;
}
