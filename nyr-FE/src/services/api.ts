
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
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE_URL}/resolution?page=${page}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        if (!response.ok) {
            throw new Error("Failed to fetch resolutions");
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const postResolutions = async (resolution: object) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE_URL}/resolution`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(resolution)
        });
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
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE_URL}/resolution/${r_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
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
    const token = localStorage.getItem("token");
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
                Authorization: `Bearer ${token}`,
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

export const updateProfile = async (name: string) => {
    const token = localStorage.getItem("token");
    const reqData = {
        name
    };
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(reqData)
        });
        if (!response.ok) {
            throw new Error("Failed to update profile");
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const likeResolution = async (r_id: string) => {
    const token = localStorage.getItem("token");
    const reqData = {
        r_id
    };
    try {
        const response = await fetch(`${API_BASE_URL}/resolution/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(reqData)
        });
        if (!response.ok) {
            throw new Error("Failed to like resolution");
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};