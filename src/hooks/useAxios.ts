import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./useAuth";

type Method = "get" | "post" | "put" | "delete";

interface UseAxiosOptions {
    method?: Method;
    url: string;
    body?: any;
    config?: any;
    manual?: boolean;
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
    const { token } = useAuth();

    const fetchData = async () => {
        setLoading(true);
        try {
            const finalConfig = {
                ...config,
                headers: {
                    ...(config?.headers || {}),
                    Authorization: token ? `Bearer ${token}` : "",
                },
            };
            console.log("Final Config Headers:", finalConfig.headers);

            let response;
            if (method === "get") {
                response = await api.get(url, finalConfig); // only config
            } else {
                response = await api[method](url, body, finalConfig); // for POST, PUT, DELETE
            }
            console.log("response ==> ", response)
            setData(response.data?.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!manual) {
            fetchData();
        }
    }, [url, JSON.stringify(body)]);

    return { data, error, loading, refetch: fetchData };
};
