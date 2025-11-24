import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDWoFHHXKxEMBk-ZhZgYstPV6fylL8SLiE",
  authDomain: "parkifycapstone.firebaseapp.com",
  projectId: "parkifycapstone",
  storageBucket: "parkifycapstone.firebasestorage.app",
  messagingSenderId: "578453779700",
  appId: "1:578453779700:web:c34c4202c53b2152bc1aa1",
  measurementId: "G-5NCE2MM3PM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.getElementById("userForm");

  if (!userForm) {
    console.error("userForm not found in the DOM");
    return;
  }

  userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const carModel = document.getElementById("carModel").value.trim();
    const plateNumber = document.getElementById("plateNumber").value.trim();

    if (!fullName || !carModel || !plateNumber) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Save user data
      const userRef = await addDoc(collection(db, "users"), {
        fullName,
        carModel,
        plateNumber,
        lastReservation: serverTimestamp()
      });

      console.log("User saved with ID:", userRef.id);

      // Save log (optional at this stage)
      await addDoc(collection(db, "logs"), {
        action: "entered",
        details: `${fullName} entered the system`,
        timestamp: serverTimestamp(),
        userID: userRef.id
      });

      // Store userID locally to use in floor/slot reservation
      localStorage.setItem("userID", userRef.id);
      localStorage.setItem("userName", fullName);

      // Redirect to chooseFloor.html
      window.location.href = "../html/chooseFloor.html";

    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save your information. Please try again.");
    }
  });
});
