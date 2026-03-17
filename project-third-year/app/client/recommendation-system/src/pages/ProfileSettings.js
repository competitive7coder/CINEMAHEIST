import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Form, Button, Spinner } from "react-bootstrap";

const ProfileSettings = ({
  userName,
  userBio,
  userProfilePicture,
  onNameUpdate,
  onBioUpdate,
  onPictureUpdate,
  triggerDelete,
  activeSubTab = "profile",
}) => {

  const [nameData, setNameData] = useState({ name: userName || "" });

  const [bioData, setBioData] = useState({ bio: userBio || "" });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [deletePassword, setDeletePassword] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);
  const [localAvatar, setLocalAvatar] = useState(null);
  const [showMeme, setShowMeme] = useState(false);

  useEffect(() => {
    setNameData({ name: userName || "" });
  }, [userName]);

  useEffect(() => {
    setBioData({ bio: userBio || "" });
  }, [userBio]);

  useEffect(() => { if (triggerDelete) setDeleteStep(1); }, [triggerDelete]);

  const handleNameChange = (e) =>
    setNameData({ ...nameData, [e.target.name]: e.target.value });

  const handleBioChange = (e) =>
    setBioData({ ...bioData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  /* ---------------- PROFILE PICTURE ---------------- */

  const handlePictureChange = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLocalAvatar(previewUrl);

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {

      setIsUploading(true);

      const res = await api.put("/profile/update-avatar", formData);

      toast.success("Profile picture updated");
      setLocalAvatar(null);

      if (onPictureUpdate) {
        onPictureUpdate(res.data.profile_picture);
      }

    } catch (err) {

      console.error(err);
      setLocalAvatar(null);

      toast.error(
        err.response?.data?.detail || "Failed to upload image"
      );

    } finally {

      setIsUploading(false);
      e.target.value = null;

    }
  };

  /* ---------------- UPDATE NAME ---------------- */

  const updateName = async (e) => {

    e.preventDefault();

    if (!nameData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("name", nameData.name.trim());

    try {

      const res = await api.put("/profile/update-name", formData);

      toast.success("Name updated");

      if (onNameUpdate) {
        onNameUpdate(res.data.username);
      }

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.detail || "Failed to update name"
      );

    }
  };

  /* ---------------- UPDATE BIO ---------------- */

  const updateBio = async (e) => {

    e.preventDefault();

    const formData = new FormData();
    formData.append("bio", bioData.bio);

    try {

      const res = await api.put("/profile/bio", formData);

      toast.success("Bio updated");

      if (onBioUpdate) {
        onBioUpdate(res.data.bio);
      }

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.detail || "Failed to update bio"
      );

    }
  };

  /* ---------------- UPDATE PASSWORD ---------------- */

  const updatePassword = async (e) => {

    e.preventDefault();

    const formData = new FormData();
    formData.append("current_password", passwordData.currentPassword);
    formData.append("new_password", passwordData.newPassword);

    try {

      const res = await api.put("/profile/update-password", formData);

      toast.success(res.data.msg);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.detail || "Password update failed"
      );

    }
  };

  /* ---------------- DELETE ACCOUNT ---------------- */

  const deleteAccount = async () => {

    if (!deletePassword) {
      toast.error("Enter password to delete account");
      return;
    }

    try {

      setIsDeleting(true);

      // 1️⃣ Verify password FIRST — before meme plays
      await api.post(
        "/profile/verify-password",
        new URLSearchParams({ password: deletePassword }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      // 2️⃣ Password correct — close modal, show meme animation
      setDeleteStep(0);
      setShowMeme(true);

      // 3️⃣ Wait 5s while meme plays
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // 4️⃣ Actually delete
      await api.delete("/profile/delete-account", {
        data: new URLSearchParams({ password: deletePassword }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      toast.success("Account deleted. Goodbye forever 💀");
      localStorage.removeItem("token");
      window.location.href = "/";

    } catch (err) {

      // Wrong password or delete failed — hide meme, back to password step
      setShowMeme(false);
      setDeleteStep(2);
      toast.error(err.response?.data?.detail || "Wrong password. Nice try 😏");

    } finally {

      setIsDeleting(false);
      setDeletePassword("");

    }
  };

  const card = {
    background: "#1e1e1e",
    borderRadius: "16px",
    padding: "2rem",
    marginBottom: "2rem",
    color: "#fff",
  };

  const input = {
    backgroundColor: "#121212",
    border: "1px solid #333",
    color: "#fff",
  };

  return (
    <div>

      {/* PROFILE — only show on Account Details tab */}

      {activeSubTab === "profile" && <div style={card}>

        <h4>Public Profile</h4>

        <img
          src={localAvatar || userProfilePicture || "https://placehold.co/100"}
          alt="profile"
          className="rounded-circle mb-3"
          style={{ width: 100, height: 100, objectFit: "cover", opacity: isUploading ? 0.6 : 1 }}
        />

        <Form.Control
          type="file"
          accept="image/*"
          onChange={handlePictureChange}
          style={input}
        />

        {isUploading && <Spinner size="sm" className="mt-2" />}

        <Form onSubmit={updateName} className="mt-4">

          <Form.Label>Name</Form.Label>

          <Form.Control
            name="name"
            value={nameData.name}
            onChange={handleNameChange}
            style={input}
          />

          <Button type="submit" className="mt-3">
            Update Name
          </Button>

        </Form>

        <Form onSubmit={updateBio} className="mt-4">

          <Form.Label>Bio</Form.Label>

          <Form.Control
            as="textarea"
            rows={3}
            name="bio"
            value={bioData.bio}
            onChange={handleBioChange}
            style={input}
          />

          <Button type="submit" className="mt-3">
            Update Bio
          </Button>

        </Form>

      </div>}

      {/* PASSWORD — only show on Security tab */}

      {activeSubTab === "security" && <div style={card}>

        <h4>Password</h4>

        <Form onSubmit={updatePassword}>

          <Form.Label>Current Password</Form.Label>

          <Form.Control
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            style={input}
          />

          <Form.Label className="mt-3">New Password</Form.Label>

          <Form.Control
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            style={input}
          />

          <Button type="submit" className="mt-3">
            Update Password
          </Button>

        </Form>

      </div>}

      {/* DELETE STEP 1 — confirmation */}

      {deleteStep === 1 && (

        <div style={modalOverlay}>

          <div style={modalBox}>

            <h4>Delete Account</h4>

            <p style={{ color: "#aaa", marginBottom: "1.5rem" }}>
              Once deleted, all your data is lost forever.
            </p>

            <div className="d-flex gap-2 justify-content-center">

              <Button variant="secondary" onClick={() => setDeleteStep(0)}>
                Cancel
              </Button>

              <Button variant="danger" onClick={() => setDeleteStep(2)}>
                Yes, continue
              </Button>

            </div>

          </div>

        </div>

      )}

      {/* DELETE STEP 2 — password */}

      {deleteStep === 2 && (

        <div style={modalOverlay}>

          <div style={modalBox}>

            <h4>Confirm Password</h4>

            <p style={{ color: "#aaa", marginBottom: "0.25rem" }}>
              Enter your password to permanently delete your account.
            </p>

            <p style={{ color: "#ef4444", fontWeight: 600, marginBottom: "1rem", fontSize: "0.9rem" }}>
              Bro really thought we'd miss him 💀
            </p>

            <Form.Control
              type="password"
              placeholder="Enter password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="mb-3"
            />

            <div className="d-flex gap-2 justify-content-center">

              <Button
                variant="secondary"
                onClick={() => { setDeleteStep(0); setDeletePassword(""); }}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={deleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Forever"}
              </Button>

            </div>

          </div>

        </div>

      )}

      {/* MEME OVERLAY */}

      {showMeme && (
        <div style={memeOverlay}>
          <div style={memeBox}>
            <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>💀</div>
            <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", margin: 0 }}>
              Bro really thought we'd miss him
            </p>
            <p style={{ fontSize: "2.5rem", margin: "0.5rem 0 0" }}>💀</p>
            <div style={memeBar}>
              <div style={memeBarFill} />
            </div>
            <p style={{ fontSize: "0.75rem", color: "#555", marginTop: "0.75rem" }}>
              deleting in 5 seconds...
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  background: "#1e1e1e",
  padding: "30px",
  borderRadius: "12px",
  width: "350px",
  textAlign: "center",
  color: "#fff",
};

const memeOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.92)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 99999,
  animation: "fadeIn 0.3s ease",
  pointerEvents: "none",
};

const memeBox = {
  textAlign: "center",
  padding: "2rem",
  animation: "popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
};

const memeBar = {
  width: "260px",
  height: "6px",
  background: "#222",
  borderRadius: "10px",
  margin: "1.25rem auto 0",
  overflow: "hidden",
};

const memeBarFill = {
  height: "100%",
  width: "100%",
  background: "linear-gradient(90deg, #ef4444, #f97316)",
  borderRadius: "10px",
  animation: "drain 5s linear forwards",
};

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("meme-keyframes")) {
  const style = document.createElement("style");
  style.id = "meme-keyframes";
  style.textContent = `
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @keyframes popIn  { from { transform: scale(0.5); opacity: 0 } to { transform: scale(1); opacity: 1 } }
    @keyframes drain  { from { width: 100% } to { width: 0% } }
  `;
  document.head.appendChild(style);
}

export default ProfileSettings;