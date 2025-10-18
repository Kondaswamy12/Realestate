// src/context/DataContext.js
import React, { createContext, useState, useEffect } from "react";
import { getAllUsers } from "../api/userService";
import { getAllGuides } from "../api/guideService";
import { getAllBuildings } from "../api/buildingService";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [guides, setGuides] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🧩 Load all data (users, guides, buildings)
  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await getAllUsers();
        const guidesData = await getAllGuides();
        const buildingsData = await getAllBuildings();

        setUsers(usersData);
        setGuides(guidesData);
        setBuildings(buildingsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 🧩 Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
    } else {
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  // 🧩 Keep localStorage in sync when user logs in/out
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("currentUser");
      setIsLoggedIn(false);
    }
  }, [currentUser]);

  // 🧩 Logout handler
  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <DataContext.Provider
      value={{
        users,
        guides,
        buildings,
        currentUser,
        setCurrentUser,
        isLoggedIn,
        setIsLoggedIn,
        logout,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
