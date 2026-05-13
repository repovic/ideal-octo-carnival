import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { memo } from "react";
import { useProducts } from "../hooks/use-products";
import { formatCategory } from "../lib/utils";

export const Filters = memo(() => {
    const { filters, setFilters, categories } = useProducts();

    const handlePriceChange = (value: string) => {
        let range: [number, number] = [0, 10000];
        if (value === "0-50") range = [0, 50];
        else if (value === "50-200") range = [50, 200];
        else if (value === "200-1000") range = [200, 1000];
        else if (value === "1000+") range = [1000, 10000];

        setFilters((prev) => ({ ...prev, priceRange: range }));
    };

    const handleRatingChange = (value: string) => {
        let range: [number, number] = [0, 5];
        if (value === "exceptional") range = [4.5, 5];
        else if (value === "very-good") range = [4, 4.5];
        else if (value === "good") range = [3.5, 4];
        else if (value === "average") range = [2.5, 3.5];
        else if (value === "below-average") range = [1.5, 2.5];
        else if (value === "poor") range = [0, 1.5];

        setFilters((prev) => ({ ...prev, ratingRange: range }));
    };

    const getPriceValue = () => {
        const { priceRange } = filters;
        if (priceRange[0] === 0 && priceRange[1] === 50) return "0-50";
        if (priceRange[0] === 50 && priceRange[1] === 200) return "50-200";
        if (priceRange[0] === 200 && priceRange[1] === 1000) return "200-1000";
        if (priceRange[0] === 1000 && priceRange[1] === 10000) return "1000+";
        return "all";
    };

    const getRatingValue = () => {
        const { ratingRange } = filters;
        if (ratingRange[0] === 4.5 && ratingRange[1] === 5)
            return "exceptional";
        if (ratingRange[0] === 4 && ratingRange[1] === 4.5) return "very-good";
        if (ratingRange[0] === 3.5 && ratingRange[1] === 4) return "good";
        if (ratingRange[0] === 2.5 && ratingRange[1] === 3.5) return "average";
        if (ratingRange[0] === 1.5 && ratingRange[1] === 2.5)
            return "below-average";
        if (ratingRange[0] === 0 && ratingRange[1] === 1.5) return "poor";
        return "all";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <Select
                value={filters.category}
                onValueChange={(val) =>
                    setFilters((prev) => ({ ...prev, category: val }))
                }
            >
                <SelectTrigger className="h-[54px] px-4 text-lg bg-white border-border">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem className="text-lg" value="All">
                        Any Category
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
                    <SelectItem className="text-lg" value="exceptional">
                        Exceptional (4.5+)
                    </SelectItem>
                    <SelectItem className="text-lg" value="very-good">
                        Very Good (4.0 - 4.5)
                    </SelectItem>
                    <SelectItem className="text-lg" value="good">
                        Good (3.5 - 4.0)
                    </SelectItem>
                    <SelectItem className="text-lg" value="average">
                        Average (2.5 - 3.5)
                    </SelectItem>
                    <SelectItem className="text-lg" value="below-average">
                        Below Average (1.5 - 2.5)
                    </SelectItem>
                    <SelectItem className="text-lg" value="poor">
                        Poor (Under 1.5)
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
});
