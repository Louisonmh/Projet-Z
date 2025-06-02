<!-- Firebase -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

  const firebaseConfig = {
  apiKey: "AIzaSyDed2-9Ehd456Tp0bxR9DqHInD7JfGsZis",
  authDomain: "projet-z-66d5b.firebaseapp.com",
  projectId: "projet-z-66d5b",
  storageBucket: "projet-z-66d5b.firebasestorage.app",
  messagingSenderId: "997922014696",
  appId: "1:997922014696:web:53a2b551fc88b6651ed05d",
  measurementId: "G-XPQQH7W14W"
};
  const app = initializeApp(firebaseConfig);
  window.db = getFirestore(app);
</script>
