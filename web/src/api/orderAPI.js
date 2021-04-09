import axiosClient from './axiosClient';

const getListOrders = async () => {
    return axiosClient.get("/order");
};

const getDetailOrder = async (id: string) => {
    return axiosClient.get(`/order/${id}`);
};

const createOrder = async (data: Object): Promise<> => {
    return axiosClient.post('/order', data);
};

const fetchListOrder = async (data: Object): Promise<> => {
    return await axiosClient.get('/order/fetch-order', {params: data});
};

const orderAPI = {
    getListOrders,
    createOrder,
    fetchListOrder,
    getDetailOrder,
};

export default orderAPI;