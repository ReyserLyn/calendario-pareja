"use client";

import { logout, validateAuth } from "@/lib/pocketbase";
import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const valid = await validateAuth();
        setIsAuthenticated(valid);
      } catch (error) {
        console.error("Error al validar la autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
  };

  return {
    isAuthenticated,
    isLoading,
    handleLogout,
    handleLogin,
    handleRegister,
  };
}
