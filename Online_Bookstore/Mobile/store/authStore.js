import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Replace with your actual API URL

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    console.log(username,email,password)

    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });

      console.log(username,email,password)

      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      await AsyncStorage.setItem("token", JSON.stringify(response.data.token));

      set({
        token: response.data.token,
        user: response.data.user,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      set({isLoading:false})
      return {success:false,error:error.message}
    }
  },
}));
