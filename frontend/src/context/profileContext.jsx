import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import axios from "axios";
import { baseUrl } from "../../apiConfig";  // Import baseUrl
import Cookies from "js-cookie";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = Cookies.get("authToken");  // Get token from cookies
      if (!token) {
        console.log("No auth token found. Skipping API call.");
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Attach token in header
          },
        });

        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details in profile", error);
      }
    };

    if (isAuthenticated) {
      fetchUserDetails();
    }
  }, [isAuthenticated]);

  return (
    <ProfileContext.Provider value={{ isAuthenticated, userDetails }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  return useContext(ProfileContext);
};
