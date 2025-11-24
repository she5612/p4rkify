import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWoFHHXKxEMBk-ZhZgYstPV6fylL8SLiE",
  authDomain: "parkifycapstone.firebaseapp.com",
  projectId: "parkifycapstone",
  storageBucket: "parkifycapstone.firebasestorage.app",
  messagingSenderId: "578453779700",
  appId: "1:578453779700:web:c34c4202c53b2152bc1aa1",
  measurementId: "G-5NCE2MM3PM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userForm = document.getElementById("userForm");

userForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const carModel = document.getElementById("carModel").value;
  const plateNumber = document.getElementById("plateNumber").value;

  try {
    await addDoc(collection(db, "users"), {
      fullName: fullName,
      carModel: carModel,
      plateNumber: plateNumber,
      lastReservation: serverTimestamp()
    });

    // Redirect to choose floor
    window.location.href = "chooseFloor.html";

  } catch (error) {
    console.error("Error saving user:", error);
    alert("Failed to save your information. Please try again.");
  }
});
