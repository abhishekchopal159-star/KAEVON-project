"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { subscribeToAdminStatus } from "@/services/admin.service";
import {
  subscribeToUserProfile,
  type AccountProfile,
} from "@/services/user.service";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  adminStatusLoading: boolean;
  profile: AccountProfile | null;
  profileLoading: boolean;
  logout: () => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

const AUTH_LOADING_TIMEOUT = 2000;

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [adminStatusLoading, setAdminStatusLoading] =
    useState(false);

  const [profile, setProfile] =
    useState<AccountProfile | null>(null);

  const [profileLoading, setProfileLoading] =
    useState(false);

  useEffect(() => {
    let componentIsActive = true;
    let unsubscribeFromAdminStatus:
      | (() => void)
      | undefined;
    let unsubscribeFromProfile:
      | (() => void)
      | undefined;

    const fallbackTimer =
      window.setTimeout(() => {
        if (componentIsActive) {
          setLoading(false);
        }
      }, AUTH_LOADING_TIMEOUT);

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          if (!componentIsActive) {
            return;
          }

          unsubscribeFromAdminStatus?.();
          unsubscribeFromAdminStatus =
            undefined;
          unsubscribeFromProfile?.();
          unsubscribeFromProfile =
            undefined;

          window.clearTimeout(
            fallbackTimer
          );

          setUser(currentUser);
          setLoading(false);

          if (!currentUser) {
            setIsAdmin(false);
            setAdminStatusLoading(false);
            setProfile(null);
            setProfileLoading(false);
            return;
          }

          setIsAdmin(false);
          setAdminStatusLoading(true);
          setProfile(null);
          setProfileLoading(true);

          unsubscribeFromProfile =
            subscribeToUserProfile(
              currentUser.uid,
              (nextProfile) => {
                if (!componentIsActive) {
                  return;
                }

                setProfile(nextProfile);
                setProfileLoading(false);
              },
              (error) => {
                console.warn(
                  "Unable to load the account profile:",
                  error
                );

                if (!componentIsActive) {
                  return;
                }

                setProfile(null);
                setProfileLoading(false);
              }
            );

          unsubscribeFromAdminStatus =
            subscribeToAdminStatus(
              currentUser.uid,
              (hasAdminRole) => {
                if (!componentIsActive) {
                  return;
                }

                setIsAdmin(hasAdminRole);
                setAdminStatusLoading(false);
              },
              (error) => {
                console.warn(
                  "Unable to verify the administrator role:",
                  error
                );

                if (!componentIsActive) {
                  return;
                }

                setIsAdmin(false);
                setAdminStatusLoading(false);
              }
            );
        },
        (error) => {
          console.warn(
            "Firebase auth state error:",
            error
          );

          if (!componentIsActive) {
            return;
          }

          window.clearTimeout(
            fallbackTimer
          );

          setUser(null);
          setLoading(false);
          setIsAdmin(false);
          setAdminStatusLoading(false);
          setProfile(null);
          setProfileLoading(false);
        }
      );

    return () => {
      componentIsActive = false;

      window.clearTimeout(
        fallbackTimer
      );

      unsubscribe();
      unsubscribeFromAdminStatus?.();
      unsubscribeFromProfile?.();
    };
  }, []);

  async function logout() {
    await signOut(auth);
  }

  const contextValue =
    useMemo<AuthContextType>(
      () => ({
        user,
        loading,
        isAdmin,
        adminStatusLoading,
        profile,
        profileLoading,
        logout,
      }),
      [
        user,
        loading,
        isAdmin,
        adminStatusLoading,
        profile,
        profileLoading,
      ]
    );

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
}
