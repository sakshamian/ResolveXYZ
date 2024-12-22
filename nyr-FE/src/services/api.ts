const API_BASE_URL = "http://localhost:8080";

export interface CardData {
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

export const fetchCards = async (page: number, limit: number = 10): Promise<CardData[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/cards?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error("Failed to fetch cards");
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};