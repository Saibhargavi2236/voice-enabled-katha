import api from "./api";

export const createVoiceDraft = async (data) => {

    const response = await api.post(
        "/voice/draft",
        data
    );

    return response.data;

};

export const confirmVoiceTransaction = async (data) => {

    const response = await api.post(
        "/voice/confirm",
        data
    );

    return response.data;

};