// Firebase project settings for the Weblume live chat.
// Paste the values from Firebase console → Project settings → Your apps → Web app.
export const firebaseConfig = {
  apiKey: "AIzaSyArDAcCrzEUj3LsgVmjw0T74aznE-SBwg4",
  authDomain: "weblume-40434.firebaseapp.com",
  projectId: "weblume-40434",
  storageBucket: "weblume-40434.firebasestorage.app",
  messagingSenderId: "920034184444",
  appId: "1:920034184444:web:40aba797f796b0998f9b79",
  measurementId: "G-RSJ2HFL43G"
};

// UID of the admin user (Firebase console → Authentication → Users).
export const ADMIN_UID = "76mVaxZZ1UhRYB66NZTHCq8jLsC2";

export const FIREBASE_SDK = "https://www.gstatic.com/firebasejs/10.12.2";
export const isConfigured = () => Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
