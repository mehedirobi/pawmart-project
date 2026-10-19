
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import {
  MdArrowBack,
  MdCheckCircle,
  MdEdit,
  MdEmail,
  MdLock,
  MdPerson,
  MdPhotoCamera,
  MdSave,
} from "react-icons/md";
import { toast } from "react-toastify";

import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase/firebase.config";

const DEFAULT_AVATAR = "https://i.ibb.co/Fx2g3mD/user.png";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const MyProfile = () => {
  const { user, refreshUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setName(user?.displayName || user?.name || "");
    setPhotoURL(user?.photoURL || user?.photoUrl || "");
    setImageError(false);
  }, [user]);

  const avatar =
    !imageError && photoURL.trim() ? photoURL.trim() : DEFAULT_AVATAR;

  const handleSave = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedPhotoURL = photoURL.trim();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return;
    }

    if (trimmedName.length > 80) {
      toast.error("Name must be 80 characters or fewer.");
      return;
    }

    if (
      trimmedPhotoURL &&
      !/^https?:\/\/\S+$/i.test(trimmedPhotoURL)
    ) {
      toast.error("Please enter a valid image URL starting with http:// or https://.");
      return;
    }

    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast.error("Your session has expired. Please log in again.");
      return;
    }

    setSaving(true);

    try {
      await updateProfile(currentUser, {
        displayName: trimmedName,
        photoURL: trimmedPhotoURL || DEFAULT_AVATAR,
      });

      if (typeof refreshUser === "function") {
        await refreshUser();
      } else {
        await currentUser.reload();
      }

      setName(trimmedName);
      setPhotoURL(trimmedPhotoURL || DEFAULT_AVATAR);
      setImageError(false);
      setEditing(false);

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update failed:", error);

      const messages = {
        "auth/requires-recent-login":
          "Please log out and log in again before updating your profile.",
        "auth/network-request-failed":
          "Network error. Please check your internet connection.",
        "auth/unauthorized-domain":
          "This domain is not authorized in Firebase Authentication.",
      };

      toast.error(
        messages[error.code] ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">
          <MdPerson className="mx-auto text-5xl text-primary" />
          <h1 className="mt-4 text-xl font-bold text-base-content">
            Profile Unavailable
          </h1>
          <p className="mt-2 text-sm text-base-content/60">
            Please log in to view your profile.
          </p>
          <Link
            to="/login"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-content hover:bg-primary/90"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200/40 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Page header */}
        <div className="mb-8">
          <Link
            to="/my-dashboard"
            className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-base-content/60 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <MdArrowBack aria-hidden="true" />
            Back to Dashboard
          </Link>

          <div className="mt-5">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              Account Settings
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
              My Profile
            </h1>
            <p className="mt-2 text-sm leading-6 text-base-content/60 sm:text-base">
              Manage your personal information and profile appearance.
            </p>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Profile summary */}
          <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-500" />

            <div className="-mt-12 px-6 pb-6">
              <div className="relative inline-flex">
                <img
                  src={avatar}
                  alt={`${user.displayName || "User"} profile`}
                  onError={() => setImageError(true)}
                  className="h-24 w-24 rounded-2xl border-4 border-base-100 bg-base-200 object-cover shadow-sm"
                />

                <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-base-100 bg-success text-success-content">
                  <MdCheckCircle aria-hidden="true" />
                </span>
              </div>

              <h2 className="mt-5 break-words text-xl font-bold text-base-content">
                {user.displayName || user.name || "PawMart User"}
              </h2>

              <p className="mt-1 break-all text-sm text-base-content/60">
                {user.email}
              </p>

              <div className="mt-5 border-t border-base-200 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                  Account provider
                </p>
                <p className="mt-2 text-sm font-medium text-base-content">
                  {user.providerData?.some(
                    (provider) => provider.providerId === "google.com"
                  )
                    ? "Google"
                    : "Email and Password"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditing(true)}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-base-300 px-4 py-3 text-sm font-semibold text-base-content transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <MdEdit aria-hidden="true" />
                Edit Profile
              </button>
            </div>
          </section>

          {/* Profile form */}
          <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-base-200 pb-5">
              <div>
                <h2 className="text-xl font-bold text-base-content">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-base-content/60">
                  Update your name and profile photo.
                </p>
              </div>

              <span className="rounded-lg bg-primary/10 p-2.5 text-xl text-primary">
                <MdPerson aria-hidden="true" />
              </span>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-6">
              {/* Display name */}
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  Full Name
                </label>

                <div className="relative">
                  <MdPerson className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-base-content/40" />

                  <input
                    id="profile-name"
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={!editing || saving}
                    placeholder="Enter your full name"
                    className="min-h-12 w-full rounded-xl border border-base-300 bg-base-100 py-3 pl-12 pr-4 text-sm text-base-content outline-none transition-colors placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-base-200/60"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  Email Address
                </label>

                <div className="relative">
                  <MdEmail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-base-content/40" />

                  <input
                    id="profile-email"
                    type="email"
                    value={user.email || ""}
                    readOnly
                    className="min-h-12 w-full cursor-not-allowed rounded-xl border border-base-300 bg-base-200/60 py-3 pl-12 pr-4 text-sm text-base-content/70 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-base-content/50">
                  Your Firebase email address cannot be changed from this form.
                </p>
              </div>

              {/* Photo URL */}
              <div>
                <label
                  htmlFor="profile-photo"
                  className="mb-2 block text-sm font-semibold text-base-content"
                >
                  Profile Photo URL
                </label>

                <div className="relative">
                  <MdPhotoCamera className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-base-content/40" />

                  <input
                    id="profile-photo"
                    type="url"
                    autoComplete="url"
                    value={photoURL}
                    onChange={(event) => {
                      setPhotoURL(event.target.value);
                      setImageError(false);
                    }}
                    disabled={!editing || saving}
                    placeholder="https://example.com/photo.jpg"
                    className="min-h-12 w-full rounded-xl border border-base-300 bg-base-100 py-3 pl-12 pr-4 text-sm text-base-content outline-none transition-colors placeholder:text-base-content/40 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-base-200/60"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-base-content/50">
                  Use a publicly accessible image URL. Leave empty to use the default avatar.
                </p>

                {photoURL.trim() && !imageError && (
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-base-200 bg-base-200/40 p-3">
                    <img
                      src={photoURL}
                      alt="Profile preview"
                      onError={() => setImageError(true)}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-base-content">
                        Image preview
                      </p>
                      <p className="break-all text-xs text-base-content/50">
                        Preview of your profile photo
                      </p>
                    </div>
                  </div>
                )}

                {imageError && photoURL.trim() && (
                  <p className="mt-2 text-sm text-warning">
                    Image preview unavailable. Check the URL before saving.
                  </p>
                )}
              </div>

              {/* Account status */}
              <div className="flex items-start gap-3 rounded-xl border border-base-200 bg-base-200/40 p-4">
                <MdLock className="mt-0.5 shrink-0 text-xl text-primary" />
                <div>
                  <p className="text-sm font-semibold text-base-content">
                    Account security
                  </p>
                  <p className="mt-1 text-xs leading-5 text-base-content/60">
                    Your profile changes are saved to Firebase Authentication.
                    Your email and password are not modified here.
                  </p>
                </div>
              </div>

              {/* Actions */}
              {editing ? (
                <div className="flex flex-col-reverse gap-3 border-t border-base-200 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setName(user.displayName || user.name || "");
                      setPhotoURL(user.photoURL || user.photoUrl || "");
                      setImageError(false);
                      setEditing(false);
                    }}
                    disabled={saving}
                    className="min-h-11 rounded-xl border border-base-300 px-5 py-3 text-sm font-semibold text-base-content transition-colors hover:bg-base-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-content transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <MdSave className="text-lg" aria-hidden="true" />
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              ) : (
                <div className="flex justify-end border-t border-base-200 pt-5">
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-content transition-colors hover:bg-primary/90"
                  >
                    <MdEdit aria-hidden="true" />
                    Edit Information
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default MyProfile;
