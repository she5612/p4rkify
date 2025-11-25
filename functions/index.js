import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { firebaseConfig } from "../js/index.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const userForm = document.getElementById("userForm");

userForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const carModel = document.getElementById("carModel").value.trim();
  const plateNumber = document.getElementById("plateNumber").value.trim();

  // Example: selected floor and slot saved from localStorage
  const selectedFloor = localStorage.getItem("selectedFloor") || "Floor1";
  const selectedSlot = localStorage.getItem("selectedSlot") || "A1";

  try {
    // Push a new user reservation
    const userRef = push(ref(db, "users"));
    await set(userRef, {
      fullName,
      carModel,
      plateNumber,
      selectedFloor,
      selectedSlot,
      lastReservation: serverTimestamp(),
    });

    alert("Reservation submitted!");
    userForm.reset();
  } catch (error) {
    console.error("Error saving reservation:", error);
    alert("Failed to submit reservation.");
  }
});
