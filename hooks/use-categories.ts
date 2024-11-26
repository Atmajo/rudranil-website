"use client";

import { Category } from "@prisma/client";
import { useState, useEffect } from "react";

interface CategoryResponse {
  categories: Category[];
}

interface UseCategories {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createCategory: (data: {
    name: string;
    url: string;
    key: string;
    link: string;
  }) => Promise<void>;
  updateCategory: (
    categoryId: string,
    data: CategoryUpdateData
  ) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
}

interface CategoryUpdateData {
  name?: string;
  url: string;
  key: string;
  link?: string;
}

export const useCategories = (): UseCategories => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/categories`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CategoryResponse = await response.json();
      setCategories(data.categories);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch categories")
      );
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (data: {
    name: string;
    url: string;
    key: string;
    link: string;
  }) => {
    try {
      setError(null);
      const response = await fetch(`/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }

      // Refetch categories after successful creation
      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to create category")
      );
      console.error("Error creating category:", err);
      throw err;
    }
  };

  const updateCategory = async (
    categoryId: string,
    data: CategoryUpdateData
  ) => {
    try {
      setIsUpdating(true);
      setError(null);

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update category");
      }

      const { category } = await response.json();

      // Update the local state with the updated category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId ? { ...cat, ...category } : cat
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update category")
      );
      console.error("Error updating category:", err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      // Update the local state by removing the deleted category
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete category")
      );
      console.error("Error deleting category:", err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    isUpdating,
    isDeleting,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
