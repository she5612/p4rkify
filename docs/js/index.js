import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get, set, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ---------------- FIREBASE CONFIG ----------------
const firebaseConfig = {
  apiKey: "AIzaSyDWoFHHXKxEMBk-ZhZgYstPV6fylL8SLiE",
  authDomain: "parkifycapstone.firebaseapp.com",
  databaseURL: "https://parkifycapstone-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "parkifycapstone",
  storageBucket: "parkifycapstone.firebasestorage.app",
  messagingSenderId: "578453779700",
  appId: "1:578453779700:web:c34c4202c53b2152bc1aa1",
  measurementId: "G-5NCE2MM3PM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ---------------- FORM HANDLER ----------------
document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.getElementById("userForm");
  if (!userForm) return console.error("Form not found!");

  // Clear previous session for new user
  localStorage.removeItem("userID");
  localStorage.removeItem("userName");
  localStorage.removeItem("selectedFloor");
  localStorage.removeItem("selectedSlot");

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
      const usersRef = ref(db, "users/users");
      const snapshot = await get(usersRef);

      // Auto-increment ID
      let newID = 1;
      if (snapshot.exists()) {
        const keys = Object.keys(snapshot.val());
        keys.sort((a, b) => parseInt(a.replace("user", "")) - parseInt(b.replace("user", "")));
        const lastKey = keys[keys.length - 1];
        newID = Number(lastKey.replace("user", "")) + 1;
      }

      const userID = "user" + newID;

      // Save user to Realtime Database
      await set(ref(db, `users/users/${userID}`), {
        fullName,
        carModel,
        plateNumber,
        selectedFloor: "", // no floor yet
        selectedSlot: "",  // no slot yet
        lastReservation: Date.now()
      });

      // Save locally
      localStorage.setItem("userID", userID);
      localStorage.setItem("userName", fullName);

      console.log(`User ${userID} saved successfully.`);

      // ---------------- LOG ENTRY ----------------
      const logsRef = ref(db, "logs/logs");
      const newLogRef = push(logsRef);
      await set(newLogRef, {
        action: "entered",
        details: `${fullName} entered the system`,
        timestamp: serverTimestamp(),
        userID: userID
      });
      console.log("Log saved for user entry.");

      // Redirect to chooseFloor page
      window.location.href = "../html/chooseFloor.html";

    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save user. Check console for details.");
    }
  });
});
