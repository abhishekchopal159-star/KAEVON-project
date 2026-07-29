import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth, db } from "./firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export async function signupUser(
  name: string,
  email: string,
  password: string
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(userCredential.user, {
    displayName: name,
  });

  await setDoc(doc(db, "users", userCredential.user.uid), {
    uid: userCredential.user.uid,
    name,
    displayName: name,
    email,
    role: "customer",
    createdAt: serverTimestamp(),
  });

  return userCredential.user;
}

export async function loginUser(
  email: string,
  password: string
) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
}

export async function logoutUser() {
  await signOut(auth);
}
