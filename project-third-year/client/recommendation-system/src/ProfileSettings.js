// import React, { useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const ProfileSettings = ({ userName, onNameUpdate }) => {
//     const [nameData, setNameData] = useState({ name: userName });
//     const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

//     const handleNameChange = (e) => setNameData({ ...nameData, [e.target.name]: e.target.value });
//     const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

//     const updateName = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem('token');
//         try {
//             const res = await axios.put('http://localhost:5000/api/profile/update-name', nameData, { headers: { 'x-auth-token': token } });
//             toast.success(res.data.msg);
//             onNameUpdate(res.data.user.name);
//         } catch (err) {
//             toast.error(err.response.data.msg);
//         }
//     };

//     const updatePassword = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem('token');
//         try {
//             const res = await axios.put('http://localhost:5000/api/profile/update-password', passwordData, { headers: { 'x-auth-token': token } });
//             toast.success(res.data.msg);
//             setPasswordData({ currentPassword: '', newPassword: '' });
//         } catch (err) {
//             toast.error(err.response.data.msg);
//         }
//     };

//     return (
//         <div className="row g-4">
//             <div className="col-lg-6">
//                 <div className="bg-dark p-4 rounded-3 text-light">
//                     <h4>Change Name</h4>
//                     <form onSubmit={updateName}>
//                         <div className="mb-3">
//                             <label htmlFor="name" className="form-label">New Name</label>
//                             <input type="text" className="form-control bg-secondary text-white border-0" id="name" name="name" value={nameData.name} onChange={handleNameChange} required />
//                         </div>
//                         <button type="submit" className="btn btn-primary">Save Name</button>
//                     </form>
//                 </div>
//             </div>
//             <div className="col-lg-6">
//                 <div className="bg-dark p-4 rounded-3 text-light">
//                     <h4>Change Password</h4>
//                     <form onSubmit={updatePassword}>
//                         <div className="mb-3">
//                             <label htmlFor="currentPassword"  className="form-label">Current Password</label>
//                             <input type="password"  className="form-control bg-secondary text-white border-0" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="newPassword"  className="form-label">New Password</label>
//                             <input type="password"  className="form-control bg-secondary text-white border-0" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
//                         </div>
//                         <button type="submit" className="btn btn-primary">Save Password</button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProfileSettings;