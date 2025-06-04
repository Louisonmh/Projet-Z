import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Inscription
async function inscription(email, password) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;
    // Initialisation Firestore
    await setDoc(doc(db, "users", uid), {
      pieces: 0,
      niveauxDébloqués: [1],
    });
    alert("Inscription réussie !");
  } catch (e) {
    console.error(e.message);
  }
}

// Connexion
async function connexion(email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;
    const docSnap = await getDoc(doc(db, "users", uid));
    const data = docSnap.data();
    console.log("Progression :", data);
    // Rediriger vers le jeu par exemple
    window.location.href = "jeu.html";
  } catch (e) {
    console.error(e.message);
  }
}
