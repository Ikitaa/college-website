import axios from "axios";

// Development ma Vite le :5173 ma chalcha, hamro Express backend le :5000
// ma chalcha. VITE_API_URL .env file bata aaucha — so deploy garda
// real domain (jasto https://api.pkmc.edu.np) ma change garna code
// touch garna pardaina, .env file matra change garне.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // login garda backend le pathauने cookie sath ma pathauने
  headers: {
    "Content-Type": "application/json",
  },
});

// Yedi kunai request 401 (unauthorized) firta aayo ra user dashboard ma
// xa bhane, login page ma automatically pathauने.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith("/dashboard")) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Backend ले error huँda { message: "..." } format ma response pathauxa.
// Yo function le tyo message matra nikaल्छ, clean text ko रूपमा.
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
};