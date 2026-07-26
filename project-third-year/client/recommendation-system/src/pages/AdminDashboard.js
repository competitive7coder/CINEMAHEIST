import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import io from "socket.io-client";
import { Table, Button, Form, Card, Row, Col, Badge, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { 
  BsShieldLock, BsPeople, BsTrash, BsShieldCheck, BsShieldSlash, 
  BsArrowLeftRight, BsListTask, BsCpu, BsSearch 
} from "react-icons/bs";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    watchlistCount: 0,
  });

  const socketRef = useRef(null);

  useEffect(() => {
    // 1. Authenticate admin access
    const checkAdmin = async () => {
      try {
        const res = await api.get("/users/me");
        if (!res.data.is_admin) {
          toast.error("Access denied. Admin privileges required.");
          navigate("/dashboard");
          return;
        }
        setCurrentUser(res.data);
      } catch (err) {
        toast.error("Please login to access the admin panel.");
        navigate("/login");
      }
    };
    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;

    // 2. Fetch admin data
    const fetchAdminData = async () => {
      try {
        const [usersRes, activityRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/activity")
        ]);

        setUsers(usersRes.data);
        setActivities(activityRes.data);

        // Calculate stats
        const total = usersRes.data.length;
        const admins = usersRes.data.filter(u => u.is_admin).length;
        const watchlists = usersRes.data.reduce((acc, curr) => acc + (curr.watchlist?.length || 0), 0);

        setStats({
          totalUsers: total,
          adminCount: admins,
          watchlistCount: watchlists,
        });

      } catch (err) {
        toast.error("Failed to load administration data.");
      } finally {
        setLoadingUsers(false);
        setLoadingActivity(false);
      }
    };

    fetchAdminData();

    // 3. Connect Socket for global activities
    const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const socket = io(socketUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_room", { userId: "admin" });
    });

    socket.on("admin_activity_update", (data) => {
      setActivities((prev) => [data, ...prev].slice(0, 100));
      // Update watchlist count dynamically if watchlist action
      if (data.action_type === "added_to_watchlist") {
        setStats(prev => ({ ...prev, watchlistCount: prev.watchlistCount + 1 }));
      } else if (data.action_type === "removed_from_watchlist") {
        setStats(prev => ({ ...prev, watchlistCount: Math.max(0, prev.watchlistCount - 1) }));
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };

  }, [currentUser]);

  const handleToggleAdmin = async (targetUser) => {
    if (targetUser.id === currentUser.id) {
      toast.error("You cannot demote yourself!");
      return;
    }

    try {
      const res = await api.put(`/admin/users/${targetUser.id}/toggle-admin`);
      toast.success(res.data.msg || "Admin status updated");
      
      setUsers(prev => prev.map(u => 
        u.id === targetUser.id ? { ...u, is_admin: res.data.is_admin } : u
      ));

      setStats(prev => ({
        ...prev,
        adminCount: res.data.is_admin ? prev.adminCount + 1 : prev.adminCount - 1
      }));

    } catch (err) {
      toast.error(err.response?.data?.detail || "Operation failed");
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.id === currentUser.id) {
      toast.error("You cannot delete your own admin account!");
      return;
    }

    if (!window.confirm(`Are you absolutely sure you want to delete user "${targetUser.username}"? This action is permanent.`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${targetUser.id}`);
      toast.success("User deleted successfully");
      
      setUsers(prev => prev.filter(u => u.id !== targetUser.id));
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers - 1,
        adminCount: targetUser.is_admin ? prev.adminCount - 1 : prev.adminCount
      }));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Delete operation failed");
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="admin-dashboard-container">
      <style>{`
        .admin-dashboard-container {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 50%, #0e111a 0%, #050609 100%);
          color: #e2e8f0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 100px 2rem 3rem;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 20px;
          padding: 1.75rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          height: 100%;
        }

        .stat-card {
          text-align: center;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(58,123,213,0.3);
          box-shadow: 0 15px 30px rgba(58,123,213,0.1);
        }
        .stat-icon-wrapper {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: rgba(58,123,213,0.1);
          color: #3a7bd5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.5rem;
          border: 1px solid rgba(58,123,213,0.25);
        }
        .stat-val {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 0.25rem;
          color: #fff;
        }
        .stat-lbl {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #64748b;
          font-weight: 700;
        }

        /* Users table styles */
        .custom-table {
          color: #e2e8f0 !important;
          border-collapse: separate;
          border-spacing: 0 8px;
        }
        .custom-table th {
          border: none;
          color: #64748b;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 12px 16px;
        }
        .custom-table tbody tr {
          background: rgba(255,255,255,0.01) !important;
          transition: all 0.2s ease;
        }
        .custom-table tbody tr:hover {
          background: rgba(255,255,255,0.03) !important;
        }
        .custom-table td {
          border: none;
          padding: 16px;
          vertical-align: middle;
          border-top: 1px solid rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .custom-table td:first-child {
          border-left: 1px solid rgba(255,255,255,0.03);
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
        .custom-table td:last-child {
          border-right: 1px solid rgba(255,255,255,0.03);
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        .user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(58,123,213,0.3);
        }

        /* Activity logger feed */
        .activity-feed-scroll {
          max-height: 480px;
          overflow-y: auto;
          padding-right: 8px;
        }
        .activity-feed-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .activity-feed-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
        }

        .activity-item {
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 8px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .act-icon {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .act-add { background: #10b981; box-shadow: 0 0 8px #10b981; }
        .act-rem { background: #ef4444; box-shadow: 0 0 8px #ef4444; }
        .act-watch { background: #3b82f6; box-shadow: 0 0 8px #3b82f6; }

        .search-wrapper {
          position: relative;
          width: 100%;
          max-width: 320px;
        }
        .search-wrapper input {
          background: rgba(255,255,255,0.03) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 30px !important;
          color: #fff !important;
          padding-left: 2.25rem !important;
          font-size: 0.85rem;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }
      `}</style>

      <div className="mx-auto" style={{ maxWidth: "1400px" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <span className="text-muted fw-bold text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "2.5px" }}>Control Center</span>
            <h1 className="fw-black text-white m-0" style={{ letterSpacing: "-1.5px", fontSize: "2.5rem" }}>System Dashboard</h1>
          </div>
          <Badge bg="danger" className="px-3 py-2 fw-bold text-uppercase" style={{ letterSpacing: "1px", borderRadius: "8px" }}>
            Admin Session
          </Badge>
        </div>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <div className="glass-card stat-card">
              <div className="stat-icon-wrapper">
                <BsPeople />
              </div>
              <div className="stat-val">{stats.totalUsers}</div>
              <div className="stat-lbl">Total Registered Users</div>
            </div>
          </Col>
          <Col md={4}>
            <div className="glass-card stat-card">
              <div className="stat-icon-wrapper" style={{ color: "#10b981", background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.25)" }}>
                <BsShieldCheck />
              </div>
              <div className="stat-val">{stats.adminCount}</div>
              <div className="stat-lbl">System Administrators</div>
            </div>
          </Col>
          <Col md={4}>
            <div className="glass-card stat-card">
              <div className="stat-icon-wrapper" style={{ color: "#f59e0b", background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.25)" }}>
                <BsListTask />
              </div>
              <div className="stat-val">{stats.watchlistCount}</div>
              <div className="stat-lbl">Total Movies Saved</div>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          {/* User Directory */}
          <Col lg={8}>
            <div className="glass-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0 text-white">User Management</h4>
                <div className="search-wrapper">
                  <input
                    type="text"
                    placeholder="Search username or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="form-control"
                  />
                  <BsSearch className="search-icon" />
                </div>
              </div>

              {loadingUsers ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="custom-table" variant="dark">
                    <thead>
                      <tr>
                        <th>Profile</th>
                        <th>Username</th>
                        <th>Email Address</th>
                        <th>Role</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <img
                              src={u.profile_picture || "https://placehold.co/40"}
                              alt={u.username}
                              className="user-avatar"
                            />
                          </td>
                          <td className="fw-semibold text-white">{u.username}</td>
                          <td>{u.email}</td>
                          <td>
                            {u.is_admin ? (
                              <Badge bg="danger" className="text-uppercase" style={{ fontSize: "0.65rem", padding: "5px 8px" }}>Admin</Badge>
                            ) : (
                              <Badge bg="secondary" className="text-uppercase" style={{ fontSize: "0.65rem", padding: "5px 8px" }}>User</Badge>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <Button
                                size="sm"
                                variant={u.is_admin ? "outline-warning" : "outline-success"}
                                onClick={() => handleToggleAdmin(u)}
                                disabled={u.id === currentUser?.id}
                                title={u.is_admin ? "Demote to User" : "Promote to Admin"}
                                style={{ borderRadius: "8px", display: "flex", alignItems: "center", gap: 5 }}
                              >
                                {u.is_admin ? <BsShieldSlash /> : <BsShieldCheck />}
                                <span>{u.is_admin ? "Demote" : "Promote"}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDeleteUser(u)}
                                disabled={u.id === currentUser?.id}
                                title="Delete Account"
                                style={{ borderRadius: "8px", display: "flex", alignItems: "center", gap: 5 }}
                              >
                                <BsTrash />
                                <span>Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </Col>

          {/* Real-time Activity feed */}
          <Col lg={4}>
            <div className="glass-card">
              <h4 className="fw-bold mb-4 text-white d-flex align-items-center gap-2">
                <BsCpu className="text-primary" />
                <span>Live Event Stream</span>
              </h4>

              {loadingActivity ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div className="activity-feed-scroll">
                  {activities.length > 0 ? (
                    activities.map((act) => {
                      let typeClass = "act-watch";
                      let actionDesc = "viewed movie";
                      
                      if (act.action_type === "added_to_watchlist") {
                        typeClass = "act-add";
                        actionDesc = "added to watchlist";
                      } else if (act.action_type === "removed_from_watchlist") {
                        typeClass = "act-rem";
                        actionDesc = "removed from watchlist";
                      } else if (act.action_type === "trailer_watch") {
                        typeClass = "act-watch";
                        actionDesc = "watched trailer of";
                      }

                      return (
                        <div key={act.id} className="activity-item">
                          <div className={`act-icon ${typeClass}`} />
                          <div className="flex-grow-1">
                            <span className="fw-bold text-white d-block" style={{ fontSize: "0.8rem" }}>
                              {act.username}
                            </span>
                            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                              {actionDesc} <span className="text-light fw-medium">"{act.movie_title}"</span>
                            </span>
                          </div>
                          <span className="text-muted" style={{ fontSize: "0.65rem", flexShrink: 0 }}>
                            {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-5 text-muted">No recent activities logged in system.</div>
                  )}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
