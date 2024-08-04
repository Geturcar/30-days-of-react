import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import './styles/App.css';
import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; 

import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import { Type } from 'typescript';

firebase.initializeApp({
  apiKey: "AIzaSyBeORnAvxuW8lmXh53AFgWD4SlSlHj-Yr8",
  authDomain: "superchat-903fb.firebaseapp.com",
  projectId: "superchat-903fb",
  storageBucket: "superchat-903fb.appspot.com",
  messagingSenderId: "835046308252",
  appId: "1:835046308252:web:3f23ab7c245fd93ac5f059"
})

const auth:any = firebase.auth()
const firestore = firebase.firestore()

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return(
    <button onClick={signInWithGoogle}> Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut() }> Sign Out</button>
  )
}

function ChatRoom() {

  const dummy:any = useRef()
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)
  const [messages] = useCollectionData(query, {idField:'id'})
  const [formValue, setFormvalue] = useState("")

  const sendMessage = async(e:any) => {
    e.preventDefault()

    const {uid, photoURL} = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormvalue('')
    dummy.current.scrollIntoView({behaviour:'smooth'})
  }

  return(
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message= {msg} />)}
        <div ref={dummy}></div>
      </div>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e)=>setFormvalue(e.target.value)}/>
        
        <button type='submit'>🕊️</button>

      </form>
    </>
  )
}

function ChatMessage(props:any){
  const {text, uid} = props.message
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved'

  return(  
  <div className={`message ${messageClass}`}>
    <img src=" {photoURL}" />
    <p>{text}</p>
  </div>
  
  )
}

export default App;
