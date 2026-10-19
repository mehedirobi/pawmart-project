
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";

import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase/firebase.config";

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

const DEFAULT_PHOTO_URL = "https://i.ibb.co/0fJqL5r/default.png";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create a new account with email and password.
  const createUser = useCallback(
    async (email, password, name, photoURL = "") => {
      const normalizedEmail = email.trim();
      const normalizedName = name.trim();
      const normalizedPhotoURL = photoURL.trim() || DEFAULT_PHOTO_URL;

      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          password
        );

        await updateProfile(result.user, {
          displayName: normalizedName,
          photoURL: normalizedPhotoURL,
        });

        await result.user.reload();

        setUser(auth.currentUser);

        return result;
      } catch (error) {
        // The account may already exist even if profile updating fails.
        setUser(auth.currentUser);
        throw error;
      }
    },
    []
  );

  // Sign in with email and password.
  const loginUser = useCallback(async (email, password) => {
    const result = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    setUser(result.user);

    return result;
  }, []);

  // Sign in with Google.
  const signInWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);

    setUser(result.user);

    return result;
  }, []);

  // Sign out the current user.
  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  // Reload the latest Firebase profile and synchronize React state.
  const refreshUser = useCallback(async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setUser(null);
      return null;
    }

    await currentUser.reload();

    const updatedUser = auth.currentUser;
    setUser(updatedUser);

    return updatedUser;
  }, []);

  // Keep authentication state synchronized with Firebase.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error("Firebase auth state error:", error);
        setUser(null);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Keep the context value stable when its dependencies do not change.
  const authInfo = useMemo(
    () => ({
      user,
      loading,
      createUser,
      loginUser,
      signInWithGoogle,
      logout,
      refreshUser,
    }),
    [
      user,
      loading,
      createUser,
      loginUser,
      signInWithGoogle,
      logout,
      refreshUser,
    ]
  );

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
