import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useProducts } from "../hooks/use-products";

export function Search() {
    const { setFilters } = useProducts();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch] = useDebounceValue(searchQuery, 300);

    useEffect(() => {
        setFilters((prev) => ({ ...prev, searchQuery: debouncedSearch }));
    }, [debouncedSearch, setFilters]);

    return (
        <Input
            placeholder="Search products..."
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-lg border-border flex-1 h-[54px]"
        />
    );
}
