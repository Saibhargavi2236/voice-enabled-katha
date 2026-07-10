import api from "./api";

export const getDailyReport = async () => {

    const response = await api.get("/reports/daily");

    return response.data;

};

export const getWeeklyReport = async () => {

    const response = await api.get("/reports/weekly");

    return response.data;

};

export const getMonthlyReport = async () => {

    const response = await api.get("/reports/monthly");

    return response.data;

};

export const getPaymentReport = async () => {

    const response = await api.get("/reports/payment");

    return response.data;

};

export const getTopDueCustomers = async () => {

    const response =
        await api.get("/reports/top-due-customers");

    return response.data;

};

export const getTopSellingItems = async () => {

    const response =
        await api.get("/reports/top-selling-items");

    return response.data;

};