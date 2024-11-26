"use client";

import { useEffect, useState } from "react";
import { fetchUser } from "@/actions/user";
import { User } from "@prisma/client";
import { useUser } from "@clerk/nextjs";

export function useFetchUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [userData, setUserData] = useState<null | User>(null);

  const { user } = useUser();

  async function fetchUserHandler(clerkId: string) {
    setLoading(true);
    setError(null);

    try {
      const fetchedUser = await fetchUser(clerkId);
      setUserData(fetchedUser);
      return fetchedUser;
    } catch (err: any) {
      console.error("Error in fetchUserHandler:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserHandler(user.id);
    }
  }, [user]);

  return { loading, error, user: userData };
}
