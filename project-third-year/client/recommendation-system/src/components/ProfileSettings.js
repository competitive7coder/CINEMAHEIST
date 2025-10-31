import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // --- 1. REMOVED
import api from '../api'; // --- 1. ADDED
import { toast } from 'react-toastify';
import { Form, Button, Spinner } from 'react-bootstrap'; // Added for styling

const ProfileSettings = ({ userName, userBio, userProfilePicture, onNameUpdate, onBioUpdate, onPictureUpdate }) => {
    const [nameData, setNameData] = useState({ name: userName || '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [bioData, setBioData] = useState({ bio: userBio || '' });
    const [isUploading, setIsUploading] = useState(false); // Added for upload spinner

    // This effect syncs the component's internal state if the props from Dashboard update
    useEffect(() => {
        setNameData({ name: userName || '' });
    }, [userName]);

    useEffect(() => {
        setBioData({ bio: userBio || '' });
    }, [userBio]);
    
    const handleNameChange = (e) => setNameData({ ...nameData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    const handleBioChange = (e) => setBioData({ ...bioData, [e.target.name]: e.target.value });
    
    const handlePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type and size (optional but recommended)
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file (jpg, png, gif).');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
             toast.error('File is too large. Please select an image under 5MB.');
             return;
        }

        const formData = new FormData();
        formData.append('profilePicture', file);

        // const token = localStorage.getItem('token'); // --- 3. REMOVED
        setIsUploading(true); // Start loading spinner
        try {
            // const res = await axios.post('http://localhost:5000/api/profile/picture', formData, { // --- 4. OLD
            //     headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
            // });
            
            // --- 4. FIXED ---
            // api.js adds the 'x-auth-token' header automatically.
            // We just need to add the 'Content-Type' header for file upload.
            const res = await api.post('/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success(res.data.msg);
            onPictureUpdate(res.data.profilePicture); // Update the dashboard
        } catch (err) {
            console.error("Picture upload error:", err); // Log the error
            toast.error(err.response?.data?.msg || 'Failed to upload picture.');
        } finally {
            setIsUploading(false); // Stop loading spinner
            e.target.value = null; // Reset file input
        }
    };

    const updateBio = async (e) => {
        e.preventDefault();
        // const token = localStorage.getItem('token'); // --- 3. REMOVED
        try {
            // const res = await axios.put('http://localhost:5000/api/profile/bio', bioData, { headers: { 'x-auth-token': token } }); // --- 5. OLD
            const res = await api.put('/profile/bio', bioData); // --- 5. FIXED
            toast.success(res.data.msg);
            onBioUpdate(res.data.bio); // Update the dashboard
        } catch (err) {
            console.error("Bio update error:", err); // Log the error
            toast.error(err.response?.data?.msg || 'Failed to update bio.');
        }
    };
    
    const updateName = async (e) => {
        e.preventDefault();
        // const token = localStorage.getItem('token'); // --- 3. REMOVED
        try {
            // const res = await axios.put('http://localhost:5000/api/profile/update-name', nameData, { headers: { 'x-auth-token': token } }); // --- 6. OLD
            const res = await api.put('/profile/update-name', nameData); // --- 6. FIXED
            toast.success(res.data.msg);
            onNameUpdate(res.data.user.name); // Update the dashboard
        } catch (err) {
            console.error("Name update error:", err); // Log the error
            toast.error(err.response?.data?.msg || 'Failed to update name.');
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        // const token = localStorage.getItem('token'); // --- 3. REMOVED
        try {
            // const res = await axios.put('http://localhost:5000/api/profile/update-password', passwordData, { headers: { 'x-auth-token': token } }); // --- 7. OLD
            const res = await api.put('/profile/update-password', passwordData); // --- 7. FIXED
            toast.success(res.data.msg);
            setPasswordData({ currentPassword: '', newPassword: '' }); // Clear fields
        } catch (err) {
            console.error("Password update error:", err); // Log the error
            toast.error(err.response?.data?.msg || 'Failed to update password.');
        }
    };
    
    // --- Styles ---
    const formSectionStyle = "bg-dark p-4 rounded-3 text-light mb-4 shadow-sm";
    const labelStyle = "form-label text-muted small text-uppercase";
    const inputStyle = "form-control bg-dark text-light border-secondary";
    const buttonStyle = "btn btn-primary mt-2";

    return (
        <div>
            {/* Public Profile Section */}
            <div className={formSectionStyle}>
                <h4 className="mb-4">Public Profile</h4>
                
                {/* --- 8. ADDED: Display Current Profile Picture --- */}
                <div className="d-flex align-items-center mb-3">
                    <img 
                        src={userProfilePicture || "https://placehold.co/100x100/212529/dee2e6?text=User"} 
                        alt="Current profile" 
                        className="rounded-circle me-3"
                        style={{ width: "100px", height: "100px", objectFit: "cover", border: "2px solid #444" }}
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/212529/dee2e6?text=Err"}}
                    />
                    <div>
                        <Form.Label htmlFor="pictureUpload" className={`${labelStyle} mb-1`}>Update Picture</Form.Label>
                        <Form.Control 
                            type="file" 
                            id="pictureUpload"
                            accept="image/png, image/jpeg, image/gif"
                            className={`${inputStyle} form-control-sm`}
                            onChange={handlePictureChange} 
                            disabled={isUploading}
                        />
                         {isUploading && <Spinner animation="border" variant="primary" size="sm" className="mt-2" />}
                         <Form.Text className="text-muted d-block mt-1" style={{fontSize: "0.8rem"}}>
                             Max 5MB. (JPG, PNG, GIF)
                         </Form.Text>
                    </div>
                </div>
                {/* --- End of Profile Picture --- */}

                <Form onSubmit={updateName} className="mb-3">
                    <Form.Group>
                        <Form.Label htmlFor="nameInput" className={labelStyle}>Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="nameInput"
                            name="name"
                            className={inputStyle}
                            value={nameData.name}
                            onChange={handleNameChange}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" className={buttonStyle} size="sm">Update Name</Button>
                </Form>

                <Form onSubmit={updateBio}>
                    <Form.Group>
                        <Form.Label htmlFor="bioInput" className={labelStyle}>Bio</Form.Label>
                        <Form.Control
                            as="textarea"
                            id="bioInput"
                            name="bio"
                            rows={3}
                            className={inputStyle}
                            value={bioData.bio}
                            onChange={handleBioChange}
                            placeholder="Tell everyone a little about yourself..."
                        />
                    </Form.Group>
                    <Button type="submit" className={buttonStyle} size="sm">Update Bio</Button>
                </Form>
            </div>

            {/* Password Section */}
            <div className={formSectionStyle}>
                <h4 className="mb-4">Password</h4>
                <Form onSubmit={updatePassword}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="currentPass" className={labelStyle}>Current Password</Form.Label>
                        <Form.Control
                            type="password"
                            id="currentPass"
                            name="currentPassword"
                            className={inputStyle}
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="newPass" className={labelStyle}>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            id="newPass"
                            name="newPassword"
                            className={inputStyle}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            minLength={6} // Good practice
                        />
                         <Form.Text className="text-muted" style={{fontSize: "0.8rem"}}>
                             Must be at least 6 characters long.
                         </Form.Text>
                    </Form.Group>
                    <Button type="submit" className={buttonStyle} size="sm">Update Password</Button>
                </Form>
            </div>
        </div>
    );
};

export default ProfileSettings;

