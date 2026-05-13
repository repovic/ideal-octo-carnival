import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { memo } from "react";
import { useProducts } from "../hooks/useProducts";
import { formatCategory } from "../lib/utils";

export const Filters = memo(() => {
    const {
        categoryFilter,
        setCategoryFilter,
        priceRange,
        setPriceRange,
        ratingRange,
        setRatingRange,
        categories,
    } = useProducts();

    const handlePriceChange = (value: string) => {
        if (value === "all") setPriceRange([0, 10000]);
        else if (value === "0-50") setPriceRange([0, 50]);
        else if (value === "50-200") setPriceRange([50, 200]);
        else if (value === "200-1000") setPriceRange([200, 1000]);
        else if (value === "1000+") setPriceRange([1000, 10000]);
    };

    const handleRatingChange = (value: string) => {
        if (value === "all") setRatingRange([0, 5]);
        else if (value === "4+") setRatingRange([4, 5]);
        else if (value === "3+") setRatingRange([3, 5]);
        else if (value === "2+") setRatingRange([2, 5]);
    };

    const getPriceValue = () => {
        if (priceRange[0] === 0 && priceRange[1] === 50) return "0-50";
        if (priceRange[0] === 50 && priceRange[1] === 200) return "50-200";
        if (priceRange[0] === 200 && priceRange[1] === 1000) return "200-1000";
        if (priceRange[0] === 1000 && priceRange[1] === 10000) return "1000+";
        return "all";
    };

    const getRatingValue = () => {
        if (ratingRange[0] === 4 && ratingRange[1] === 5) return "4+";
        if (ratingRange[0] === 3 && ratingRange[1] === 5) return "3+";
        if (ratingRange[0] === 2 && ratingRange[1] === 5) return "2+";
        return "all";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <Select
                value={categoryFilter}
                onValueChange={(val) => setCategoryFilter(val)}
            >
                <SelectTrigger className="h-[54px] px-4 text-lg bg-white border-border">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem className="text-lg" value="All">
                        All Categories
                    </SelectItem>
                    {categories.map((cat) => (
                        <SelectItem className="text-lg" key={cat} value={cat}>
                            {formatCategory(cat)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={getPriceValue()} onValueChange={handlePriceChange}>
                <SelectTrigger className="h-[54px] px-4 text-lg bg-white border-border">
                    <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem className="text-lg" value="all">
                        Any Price
                    </SelectItem>
                    <SelectItem className="text-lg" value="0-50">
                        Under $50
                    </SelectItem>
                    <SelectItem className="text-lg" value="50-200">
                        $50 - $200
                    </SelectItem>
                    <SelectItem className="text-lg" value="200-1000">
                        $200 - $1000
                    </SelectItem>
                    <SelectItem className="text-lg" value="1000+">
                        Over $1000
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select value={getRatingValue()} onValueChange={handleRatingChange}>
                <SelectTrigger className="h-[54px] px-4 text-lg bg-white border-border">
                    <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem className="text-lg" value="all">
                        Any Rating
                    </SelectItem>
                    <SelectItem className="text-lg" value="4+">
                        4.0 & Up
                    </SelectItem>
                    <SelectItem className="text-lg" value="3+">
                        3.0 & Up
                    </SelectItem>
                    <SelectItem className="text-lg" value="2+">
                        2.0 & Up
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
});
