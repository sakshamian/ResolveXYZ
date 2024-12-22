
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

export const fetchResolutionById = async (r_id: string) => {

    try {
        const response = await fetch(`${API_BASE_URL}/resolution/${r_id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch resolution data");
        }
        return await response.json(); // Returning the entire resolution data, including comments
    } catch (error) {
        console.error("API Error:", error);
        throw error; // Re-throw the error for proper error handling in the calling function
    }
};

export const addComment = async (r_id: string, user_id: string, comment: string) => {
    const commentData = {
        r_id,          
        comment: comment,  
        user_id,       
    };
   console.log(commentData)
    try {
        const response = await fetch(`${API_BASE_URL}/resolution/comments`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify(commentData)
        });
        if (!response.ok) {
            throw new Error("Failed to fetch resolution data");
        }
        return await response.json(); 
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
