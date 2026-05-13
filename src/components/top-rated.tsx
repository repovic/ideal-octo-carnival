import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { memo } from "react";
import { useProducts } from "../hooks/useProducts";
import { formatCurrency } from "../lib/utils";

export const TopRated = memo(() => {
    const { topRatedProducts, loading } = useProducts();

    if (loading || topRatedProducts.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Top Rated Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topRatedProducts.map((product) => (
                    <Card
                        key={product.id}
                        className="overflow-hidden py-0 transition-all"
                    >
                        <div className="aspect-square w-full overflow-hidden">
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                            />
                        </div>
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-start gap-2">
                                <CardTitle className="text-lg">
                                    {product.title}
                                </CardTitle>
                                <Badge
                                    variant="secondary"
                                    className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none"
                                >
                                    ★ {product.rating.toFixed(1)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-xl font-bold text-foreground">
                                {formatCurrency(product.price)}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                {product.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
});
