const API_BASE_URL = "http://localhost:8080";

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
