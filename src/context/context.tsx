import axios from "axios";
import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "sonner";
import api from "../lib/api";
import type { Product, ProductInput } from "../types/product";

export interface Filters {
    searchQuery: string;
    category: string;
    priceRange: [number, number];
    ratingRange: [number, number];
}

interface ContextType {
    values: Product[];
    filteredValues: Product[];
    categories: string[];
    isLoading: boolean;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    create: (product: ProductInput) => Promise<void>;
    update: (
        id: number,
        product: Partial<ProductInput>,
    ) => Promise<void>;
    delete: (id: number) => Promise<void>;
    topRatedValues: Product[];
}

const ProductContext = createContext<ContextType | undefined>(undefined);

export const Context: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [values, setValues] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [filters, setFilters] = useState<Filters>({
        searchQuery: "",
        category: "All",
        priceRange: [0, 10000],
        ratingRange: [0, 5],
    });

    const initialize = useCallback(async (signal?: AbortSignal) => {
        try {
            setIsLoading(true);
            const [productsResponse, categoriesResponse] = await Promise.all([
                api.get("/products?limit=0", { signal: signal }),
                api.get("/products/category-list", { signal: signal }),
            ]);

            setValues(productsResponse.data.products);
            setCategories(categoriesResponse.data);
        } catch (error) {
            if (axios.isCancel(error)) return;
            console.error("Failed to fetch data:", error);
            toast.error("Failed to load products.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        initialize(controller.signal);
        return () => controller.abort();
    }, [initialize]);

    const create = useCallback(async (input: ProductInput) => {
        try {
            const response = await api.post("/products/add", input);
            const productWithId = { ...response.data, id: Date.now() };
            setValues((prev) => [productWithId, ...prev]);
            toast.success("Product added successfully.");
        } catch {
            toast.error("Failed to add product.");
        }
    }, []);

    const update = useCallback(
        async (id: number, input: Partial<ProductInput>) => {
            try {
                const response = await api.put(`/products/${id}`, input);
                setValues((prev) =>
                    prev.map((p) =>
                        p.id === id ? { ...p, ...response.data } : p,
                    ),
                );
                toast.success("Product updated successfully.");
            } catch {
                toast.error("Failed to update product.");
            }
        },
        [],
    );

    const deleteFn = useCallback(async (id: number) => {
        try {
            await api.delete(`/products/${id}`);
            setValues((prev) => prev.filter((p) => p.id !== id));
            toast.success("Product deleted successfully.");
        } catch {
            toast.error("Failed to delete product.");
        }
    }, []);

    const filteredValues = useMemo(() => {
        const searchLower = filters.searchQuery.toLowerCase().trim();
        if (
            !searchLower &&
            filters.category === "All" &&
            filters.priceRange[0] === 0 &&
            filters.priceRange[1] === 10000 &&
            filters.ratingRange[0] === 0 &&
            filters.ratingRange[1] === 5
        ) {
            return [...values].sort((a, b) => a.title.localeCompare(b.title));
        }

        return values
            .filter((p) => {
                const matchesSearch =
                    !searchLower || p.title.toLowerCase().includes(searchLower);
                const matchesCategory =
                    filters.category === "All" || p.category === filters.category;
                const matchesPrice =
                    p.price >= filters.priceRange[0] &&
                    p.price <= filters.priceRange[1];
                const matchesRating =
                    p.rating >= filters.ratingRange[0] &&
                    p.rating <= filters.ratingRange[1];
                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesPrice &&
                    matchesRating
                );
            })
            .sort((a, b) => a.title.localeCompare(b.title));
    }, [values, filters]);

    const topRatedValues = useMemo(() => {
        return [...values].sort((a, b) => b.rating - a.rating).slice(0, 3);
    }, [values]);

    const value = useMemo(
        () => ({
            values,
            filteredValues,
            categories,
            isLoading,
            filters,
            setFilters,
            create,
            update,
            delete: deleteFn,
            topRatedValues,
        }),
        [
            values,
            filteredValues,
            categories,
            isLoading,
            filters,
            create,
            update,
            deleteFn,
            topRatedValues,
        ],
    );

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    const context = React.useContext(ProductContext);
    if (!context) {
        throw new Error("useContext must be used within a Context provider");
    }
    return context;
};
