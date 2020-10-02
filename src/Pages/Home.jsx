import React from "react";
import "./Home.css";
// import ChatRoom from "./ChatRoom";
// import SignIn from "./SignIn";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState } from "react";

//firebase cofig
firebase.initializeApp({
  apiKey: "AIzaSyBBbA5OECjkHSfE0jkmNNuxzn77HDKzxVw",
  authDomain: "superchat-01.firebaseapp.com",
  databaseURL: "https://superchat-01.firebaseio.com",
  projectId: "superchat-01",
  storageBucket: "superchat-01.appspot.com",
  messagingSenderId: "765245377586",
  appId: "1:765245377586:web:79c0ee41ff7b4f6aa4802b",
  measurementId: "G-03BC3FB1CL"
});

const auth = firebase.auth();

const firestore = firebase.firestore();

function Home() {
  const [user] = useAuthState(auth);
  console.log(user, "user logedin");
  return <>{user ? <ChatRoom /> : <SignIn />}</>;
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return (
    <>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  const messageRef = firestore.collection("messages");
  console.log(messageRef, "reference");
  const query = messageRef.limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });
  console.log(messages, "message received");
  const [formValue, setFormValue] = useState("");
  const sendMessage = async e => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue("");
  };
  return (
    <>
      <div>
        {messages &&
          messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={e => setFormValue(e.target.value)} />
        <button type="submit">Add</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  );
}

export default Home;
