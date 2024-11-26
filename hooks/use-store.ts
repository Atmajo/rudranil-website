import { useState, useEffect } from "react";
import { getStores } from "@/actions/store";
import { Store } from "@prisma/client";
import { useUser } from "@clerk/nextjs";

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { user, isLoaded: isUserLoaded } = useUser();

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const fetchedStores = await getStores();
      if (user?.id) {
        setStores(fetchedStores.filter((store) => store.userId === user.id));
      }
      setIsLoading(false);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isUserLoaded) {
      fetchStores();
    }
  }, [isUserLoaded, user?.id]);

  return {
    stores,
    isLoading: isLoading || !isUserLoaded,
    isError,
    error,
    refetch: fetchStores,
  };
};