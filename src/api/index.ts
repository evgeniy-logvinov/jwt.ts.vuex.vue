import ApiClientService from '@/services/ApiClientService';

const apiCall = ({ requestApi: { method, url }, data, params, requestParams, options, ...args }: any) => {
    return new ApiClientService(options).client({
        method,
        url: url instanceof Function ? url({...requestParams}) : url,
        data,
        params,
    });
};

export default apiCall;
