import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileSettings = ({ userName, userBio, onNameUpdate, onBioUpdate, onPictureUpdate }) => {
    const [nameData, setNameData] = useState({ name: userName });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [bioData, setBioData] = useState({ bio: userBio || '' });

    const handleNameChange = (e) => setNameData({ ...nameData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    const handleBioChange = (e) => setBioData({ ...bioData, [e.target.name]: e.target.value });
    
    const handlePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file);

        const token = localStorage.getItem('token');
        try {
            const res = await axios.post('http://localhost:5000/api/profile/picture', formData, {
                headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
            });
            toast.success(res.data.msg);
            onPictureUpdate(res.data.profilePicture);
        } catch (err) {
            toast.error('Failed to upload picture.');
        }
    };

    const updateBio = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put('http://localhost:5000/api/profile/bio', bioData, { headers: { 'x-auth-token': token } });
            toast.success(res.data.msg);
            onBioUpdate(res.data.bio);
        } catch (err) {
            toast.error('Failed to update bio.');
        }
    };
    
    const updateName = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put('http://localhost:5000/api/profile/update-name', nameData, { headers: { 'x-auth-token': token } });
            toast.success(res.data.msg);
            onNameUpdate(res.data.user.name);
        } catch (err) {
            toast.error(err.response.data.msg);
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put('http://localhost:5000/api/profile/update-password', passwordData, { headers: { 'x-auth-token': token } });
            toast.success(res.data.msg);
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (err) {
            toast.error(err.response.data.msg);
        }
    };

    return (
        <div>
            {/* Public Profile Section */}
            <div className="bg-dark p-4 rounded-3 text-light mb-4">
                <h4>Public Profile</h4>
                <div className="mb-3">
                    <label htmlFor="pictureUpload" className="form-label">Profile Picture</label>
                    <input className="form-control bg-secondary text-white border-0" type="file" id="pictureUpload" onChange={handlePictureChange} />
                </div>
                <form onSubmit={updateBio}>
                    <div className="mb-3">
                        <label htmlFor="bio" className="form-label">Short Bio</label>
                        <textarea className="form-control bg-secondary text-white border-0" id="bio" name="bio" rows="3" value={bioData.bio} onChange={handleBioChange}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Save Bio</button>
                </form>
            </div>

            {/* Account Management Section */}
            <div className="row g-4">
                {/* Change Name Form */}
                <div className="col-lg-6">
                    <div className="bg-dark p-4 rounded-3 text-light">
                        <h4>Change Name</h4>
                        <form onSubmit={updateName}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">New Name</label>
                                <input type="text" className="form-control bg-secondary text-white border-0" id="name" name="name" value={nameData.name} onChange={handleNameChange} required />
                            </div>
                            <button type="submit" className="btn btn-primary">Save Name</button>
                        </form>
                    </div>
                </div>
                {/* Change Password Form */}
                <div className="col-lg-6">
                    <div className="bg-dark p-4 rounded-3 text-light">
                        <h4>Change Password</h4>
                        <form onSubmit={updatePassword}>
                            <div className="mb-3">
                                <label htmlFor="currentPassword"  className="form-label">Current Password</label>
                                <input type="password"  className="form-control bg-secondary text-white border-0" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="newPassword"  className="form-label">New Password</label>
                                <input type="password"  className="form-control bg-secondary text-white border-0" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                            </div>
                            <button type="submit" className="btn btn-primary">Save Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;