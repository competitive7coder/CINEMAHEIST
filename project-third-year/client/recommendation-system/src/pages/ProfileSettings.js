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
}) => {
  const [nameData, setNameData] = useState({ name: userName || "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [bioData, setBioData] = useState({ bio: userBio || "" });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setNameData({ name: userName || "" });
  }, [userName]);

  useEffect(() => {
    setBioData({ bio: userBio || "" });
  }, [userBio]);

  const handleNameChange = (e) =>
    setNameData({ ...nameData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  const handleBioChange = (e) =>
    setBioData({ ...bioData, [e.target.name]: e.target.value });

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (jpg, png, gif).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Please select an image under 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    setIsUploading(true);
    try {
      const res = await api.post("/profile/picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.msg);
      onPictureUpdate(res.data.profilePicture);
    } catch (err) {
      console.error("Picture upload error:", err);
      toast.error(err.response?.data?.msg || "Failed to upload picture.");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const updateBio = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/profile/bio", bioData);
      toast.success(res.data.msg);
      onBioUpdate(res.data.bio);
    } catch (err) {
      console.error("Bio update error:", err);
      toast.error(err.response?.data?.msg || "Failed to update bio.");
    }
  };

  const updateName = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/profile/update-name", nameData);
      toast.success(res.data.msg);
      onNameUpdate(res.data.user.name);
    } catch (err) {
      console.error("Name update error:", err);
      toast.error(err.response?.data?.msg || "Failed to update name.");
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/profile/update-password", passwordData);
      toast.success(res.data.msg);
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Password update error:", err);
      toast.error(err.response?.data?.msg || "Failed to update password.");
    }
  };

  // --- Enhanced Styling ---
  const card = {
    background:
      "linear-gradient(145deg, rgba(25,25,25,0.95), rgba(45,45,45,0.85))",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 4px 25px rgba(0,0,0,0.4)",
    color: "#fff",
    marginBottom: "2rem",
    backdropFilter: "blur(10px)",
  };

  const sectionHeader = {
    fontWeight: "700",
    fontSize: "1.5rem",
    color: "#f8f9fa",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: "0.5rem",
    marginBottom: "1.5rem",
  };

  const label = {
    fontSize: "0.8rem",
    letterSpacing: "0.8px",
    color: "#bdbdbd",
    textTransform: "uppercase",
    marginBottom: "0.25rem",
  };

  const input = {
    backgroundColor: "#1e1e1e",
    border: "1px solid #333",
    color: "#fff",
    borderRadius: "10px",
  };

  const button = {
    background:
      "linear-gradient(90deg, rgba(0,123,255,0.9), rgba(0,180,255,0.9))",
    border: "none",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    fontWeight: "600",
  };

  const buttonHover = {
    background:
      "linear-gradient(90deg, rgba(0,150,255,1), rgba(0,210,255,1))",
    transform: "scale(1.03)",
  };

  return (
    <div>
      {/* === PUBLIC PROFILE CARD === */}
      <div style={card}>
        <h4 style={sectionHeader}>Public Profile</h4>

        <div className="d-flex align-items-center mb-4">
          <img
            src={
              userProfilePicture ||
              "https://placehold.co/100x100/212529/dee2e6?text=User"
            }
            alt="Current profile"
            className="rounded-circle me-3"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              border: "2px solid #444",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/100x100/212529/dee2e6?text=Err";
            }}
          />
          <div>
            <Form.Label htmlFor="pictureUpload" style={label}>
              Update Picture
            </Form.Label>
            <Form.Control
              type="file"
              id="pictureUpload"
              accept="image/png, image/jpeg, image/gif"
              style={input}
              className="form-control-sm"
              onChange={handlePictureChange}
              disabled={isUploading}
            />
            {isUploading && (
              <Spinner
                animation="border"
                variant="primary"
                size="sm"
                className="mt-2"
              />
            )}
            <Form.Text
              className="text-muted d-block mt-1"
              style={{ fontSize: "0.8rem" }}
            >
              Max 5MB. (JPG, PNG, GIF)
            </Form.Text>
          </div>
        </div>

        {/* --- Name --- */}
        <Form onSubmit={updateName} className="mb-4">
          <Form.Group>
            <Form.Label htmlFor="nameInput" style={label}>
              Name
            </Form.Label>
            <Form.Control
              type="text"
              id="nameInput"
              name="name"
              style={input}
              value={nameData.name}
              onChange={handleNameChange}
              required
            />
          </Form.Group>
          <Button
            type="submit"
            className="mt-3 px-4"
            style={button}
            onMouseOver={(e) => Object.assign(e.target.style, buttonHover)}
            onMouseOut={(e) => Object.assign(e.target.style, button)}
          >
            Update Name
          </Button>
        </Form>

        {/* --- Bio --- */}
        <Form onSubmit={updateBio}>
          <Form.Group>
            <Form.Label htmlFor="bioInput" style={label}>
              Bio
            </Form.Label>
            <Form.Control
              as="textarea"
              id="bioInput"
              name="bio"
              rows={3}
              style={input}
              value={bioData.bio}
              onChange={handleBioChange}
              placeholder="Tell everyone a little about yourself..."
            />
          </Form.Group>
          <Button
            type="submit"
            className="mt-3 px-4"
            style={button}
            onMouseOver={(e) => Object.assign(e.target.style, buttonHover)}
            onMouseOut={(e) => Object.assign(e.target.style, button)}
          >
            Update Bio
          </Button>
        </Form>
      </div>

      {/* === PASSWORD CARD === */}
      <div style={card}>
        <h4 style={sectionHeader}>Password</h4>
        <Form onSubmit={updatePassword}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="currentPass" style={label}>
              Current Password
            </Form.Label>
            <Form.Control
              type="password"
              id="currentPass"
              name="currentPassword"
              style={input}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="newPass" style={label}>
              New Password
            </Form.Label>
            <Form.Control
              type="password"
              id="newPass"
              name="newPassword"
              style={input}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
            />
            <Form.Text
              className="text-muted"
              style={{ fontSize: "0.8rem" }}
            >
              Must be at least 6 characters long.
            </Form.Text>
          </Form.Group>

          <Button
            type="submit"
            className="mt-3 px-4"
            style={button}
            onMouseOver={(e) => Object.assign(e.target.style, buttonHover)}
            onMouseOut={(e) => Object.assign(e.target.style, button)}
          >
            Update Password
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ProfileSettings;
