// @ts-nocheck
// admin/services/adminApi.js

export const getLeaderboard = async (api) => {
    const res = await api.get("/api/admin/leader-board");
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