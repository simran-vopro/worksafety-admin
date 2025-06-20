import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

type Method = "get" | "post" | "put" | "delete";

interface UseAxiosOptions {
    method?: Method;
    url: string;
    body?: any;
    config?: any;
    manual?: boolean;
}

interface MetaData {
    limit: number;
    page: number;
    total: number;
}

export const useAxios = <T = any>({
    method = "get",
    url,
    body = null,
    config = {},
    manual = false,
}: UseAxiosOptions) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(!manual);
    const [anotherdata, setAnotherData] = useState<MetaData | null>(null);
    const { adminToken } = useAuth();


    


    const fetchData = async () => {
        setLoading(true);
        try {
            const finalConfig = {
                ...config,
                headers: {
                    ...(config?.headers || {}),
                    Authorization: adminToken ? `Bearer ${adminToken}` : "",
                },
            };
            
            console.log("Final Config Headers:", finalConfig.headers, method, body);

            let response;
            if (method === "get") {
                response = await api.get(url, finalConfig); // only config
            } else if(method === "delete"){
                 response = await api.delete(url, finalConfig); 
            } else {
                response = await api[method](url, body, finalConfig); // for POST, PUT, DELETE
            }

            console.log("response ==> ", response);

            setData(response.data?.data);
            setAnotherData({ limit: response.data?.limit, total: response.data?.total, page: response.data?.page })
            setError(null);

            // ✅ Show toast only for POST/PUT/DELETE success
            if (method !== "get") {
                toast.success(response.data?.message || "Operation successful");
            }
        } catch (err: any) {
            const errMsg = err.response?.data?.message || "Something went wrong";
            setError(err.response?.data || err.message);
            // ❌ Show error toast
            toast.dismiss();
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!manual) {
            fetchData();
        }
    }, [url, JSON.stringify(body)]);

    return { data, error, loading, refetch: fetchData, metaData: anotherdata, };
};
