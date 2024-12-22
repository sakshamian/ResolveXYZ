const API_BASE_URL = "http://localhost:8080";

export interface ResolutionData {
    id: number;
    title: string;
    content: string;
}

export const login = async (): Promise<{ token: string; user: any }> => {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to login");
    return response.json();
};

export const verifyToken = async (token: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/verify-token`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Invalid token");
    return response.json();
};
// export const getResolutions = async (page: number, limit: number) => {
//     try {
//         const response = await axios.get(API_URL, {
//             params: {
//                 page: page,
//                 limit: limit,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching resolutions:', error);
//         throw error;
//     }
// };

export const fetchResolutions = async (page: number, limit: number = 10) => {
    try {
        const response = await fetch(`${API_BASE_URL}/resolution?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error("Failed to fetch resolutions");
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};