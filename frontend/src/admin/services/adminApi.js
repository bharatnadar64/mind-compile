// @ts-nocheck
// admin/services/adminApi.js

export const getLeaderboard = async (api) => {
    const res = await api.get("/api/admin/leaderboard");
    return res.data;
};

export const getSubmissions = async (api) => {
    const res = await api.get("/api/admin/submissions");
    return res.data;
};

export const giveBonus = async (api, submissionId, points) => {
    const res = await api.put(`/api/admin/bonus/${submissionId}`, { points });
    return res.data;
};

// 👤 USERS
export const getUsers = async (api) => {
    const res = await api.get("/api/admin/users");
    return res.data;
};

export const updateUser = async (api, userId, data) => {
    const res = await api.put(`/api/admin/users/${userId}`, data);
    return res.data;
};

export const deleteUser = async (api, userId) => {
    const res = await api.delete(`/api/admin/users/${userId}`);
    return res.data;
};