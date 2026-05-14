import { useState, type ChangeEvent } from "react";
import Layout from "../components/layout/Layout.js";
import { useUpdateProfile } from "../hooks/useUpdateProfile.js";
import { validatePassword } from "../services/validatePassword.js";
import { useAuth } from "../context/AuthContext.js";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [username, setUsername] = useState(user ? user.username : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { mutate: updateProfile, isPending, isError } = useUpdateProfile();

  function handleSubmit(e: ChangeEvent) {
    e.preventDefault();
    setPasswordError("");

    const errorInPassword = validatePassword(password);

    if (password && errorInPassword) {
      setPasswordError(errorInPassword);
      return;
    }
    
    if (password && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const params = {
      ...(username && { username }),
      ...(email && { email }),
      ...(password && { password })
    };

    updateProfile(params, {
      onSuccess: () => {
        updateUser({
          ...(username && { username }),
          ...(email && { email })
        });
        setSuccessMessage("Profile updated successfully");
        setPassword("");
        setConfirmPassword("");
      }
    });
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-sm text-gray-700">
              New Username
            </label>
            <input 
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-gray-700">
              New Email
            </label>
            <input 
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm text-gray-700">
              New Password
            </label>
            <input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm text-gray-700">
              Confirm New Password
            </label>
            <input 
              id="confirmNewPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          {isError && (
            <p className="text-red-500 text-sm">Failed to update profile. Please try again.</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm">{successMessage}</p>
          )}
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </Layout>
  );
}