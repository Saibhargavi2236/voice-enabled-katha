import api from "./api";

export const collectPayment = async (data) => {

    const response = await api.post(
        "/payments/collect",
        data
    );

    return response.data;

};