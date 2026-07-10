import api from "./api";

export const createTransaction = async (data) => {

    const response = await api.post(
        "/transactions/manual",
        data
    );

    return response.data;
};

export const getTransactions = async () => {

    const response = await api.get(
        "/transactions"
    );

    return response.data;
};

export const getTransaction = async (id) => {

    const response = await api.get(
        `/transactions/${id}`
    );

    return response.data;
};