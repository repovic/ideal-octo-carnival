import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "sonner";
import type { Product, ProductInput } from "../types/product";

interface ContextType {
    products: Product[];
    filteredProducts: Product[];
    categories: string[];
    loading: boolean;
    search: string;
    setSearch: (s: string) => void;
    categoryFilter: string;
    setCategoryFilter: (c: string) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    ratingRange: [number, number];
    setRatingRange: (range: [number, number]) => void;
    createProduct: (product: ProductInput) => Promise<void>;
    updateProduct: (
        id: number,
        product: Partial<ProductInput>,
    ) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    topRatedProducts: Product[];
}

const ProductContext = createContext<ContextType | undefined>(undefined);

export const Context: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [ratingRange, setRatingRange] = useState<[number, number]>([0, 5]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                fetch("https://dummyjson.com/products?limit=0"),
                fetch("https://dummyjson.com/products/category-list"),
            ]);

            const productsData = await productsRes.json();
            const categoriesData = await categoriesRes.json();

            setProducts(productsData.products);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to load products.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            fetchData();
        };
        init();
    }, [fetchData]);

    const createProduct = useCallback(async (input: ProductInput) => {
        try {
            const res = await fetch("https://dummyjson.com/products/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });
            const newProduct = await res.json();
            const productWithId = { ...newProduct, id: Date.now() };
            setProducts((prev) => [productWithId, ...prev]);
            toast.success("Product added successfully.");
        } catch {
            toast.error("Failed to add product.");
        }
    }, []);

    const updateProduct = useCallback(
        async (id: number, input: Partial<ProductInput>) => {
            try {
                const res = await fetch(
                    `https://dummyjson.com/products/${id}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(input),
                    },
                );
                const updatedData = await res.json();
                setProducts((prev) =>
                    prev.map((p) =>
                        p.id === id ? { ...p, ...updatedData } : p,
                    ),
                );
                toast.success("Product updated successfully.");
            } catch {
                toast.error("Failed to update product.");
            }
        },
        [],
    );

    const deleteProduct = useCallback(async (id: number) => {
        try {
            await fetch(`https://dummyjson.com/products/${id}`, {
                method: "DELETE",
            });
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success("Product deleted successfully.");
        } catch {
            toast.error("Failed to delete product.");
        }
    }, []);

    const filteredProducts = useMemo(() => {
        const searchLower = search.toLowerCase().trim();
        if (
            !searchLower &&
            categoryFilter === "All" &&
            priceRange[0] === 0 &&
            priceRange[1] === 10000 &&
            ratingRange[0] === 0 &&
            ratingRange[1] === 5
        ) {
            return [...products].sort((a, b) => a.title.localeCompare(b.title));
        }

        return products
            .filter((p) => {
                const matchesSearch =
                    !searchLower || p.title.toLowerCase().includes(searchLower);
                const matchesCategory =
                    categoryFilter === "All" || p.category === categoryFilter;
                const matchesPrice =
                    p.price >= priceRange[0] && p.price <= priceRange[1];
                const matchesRating =
                    p.rating >= ratingRange[0] && p.rating <= ratingRange[1];
                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesPrice &&
                    matchesRating
                );
            })
            .sort((a, b) => a.title.localeCompare(b.title));
    }, [products, search, categoryFilter, priceRange, ratingRange]);

    const topRatedProducts = useMemo(() => {
        return [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
    }, [products]);

    const value = useMemo(
        () => ({
            products,
            filteredProducts,
            categories,
            loading,
            search,
            setSearch,
            categoryFilter,
            setCategoryFilter,
            priceRange,
            setPriceRange,
            ratingRange,
            setRatingRange,
            createProduct,
            updateProduct,
            deleteProduct,
            topRatedProducts,
        }),
        [
            products,
            filteredProducts,
            categories,
            loading,
            search,
            setSearch,
            categoryFilter,
            setCategoryFilter,
            priceRange,
            setPriceRange,
            ratingRange,
            setRatingRange,
            createProduct,
            updateProduct,
            deleteProduct,
            topRatedProducts,
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
