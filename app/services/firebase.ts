import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8AvmEcRWc0UGAM_CSERXucoX9u7O5Yvs",
  authDomain: "local-storage-40bcb.firebaseapp.com",
  projectId: "local-storage-40bcb",
  storageBucket: "local-storage-40bcb.firebasestorage.app",
  messagingSenderId: "181224548628",
  appId: "1:181224548628:web:f847e6db20d44edb64ba01",
  measurementId: "G-PYQ6YS9PWN",
};

const app = initializeApp(firebaseConfig);
const authInstance = getAuth(app);

export const auth = authInstance;
export const db = getFirestore(app);

export const registerWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error: any) {
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const { saveLogin } = await import("./mmkv");
    saveLogin(userCredential.user.uid, email);
    return userCredential;
  } catch (error: any) {
    throw error;
  }
};

export const fetchAllMahasiswa = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "mahasiswa"));
    const data = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data as any[];
  } catch (error) {
    console.error("Error fetching mahasiswa:", error);
    throw error;
  }
};
