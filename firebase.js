import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3KHZKOhadTLlo0_4bWo-f5DDI1owoVbk",
  authDomain: "arbitraj-e8464.firebaseapp.com",
  projectId: "arbitraj-e8464",
  storageBucket: "arbitraj-e8464.appspot.com",
  messagingSenderId: "394887415683",
  appId: "1:394887415683:web:86adc1516523a31a37d8b6",
  measurementId: "G-3DNY0SBPXP"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export { auth };
