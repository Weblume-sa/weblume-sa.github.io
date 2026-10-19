// Firebase project settings for the Weblume live chat.
// Paste the values from Firebase console → Project settings → Your apps → Web app.
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// UID of the admin user (Firebase console → Authentication → Users).
export const ADMIN_UID = "";

export const FIREBASE_SDK = "https://www.gstatic.com/firebasejs/10.12.2";
export const isConfigured = () => Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
