import api from "./api";

export const getNotifications = async () => {

    const response = await api.get("/notifications");

    return response.data;

};

export const generateNotifications = async () => {

    const response = await api.post("/notifications/generate");

    return response.data;

};