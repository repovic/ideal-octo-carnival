import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    Table as TablePrimitive,
    TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import { memo, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { formatCategory, formatCurrency } from "../lib/utils";
import type { Product } from "../types/product";
import { ProductDialog } from "./dialog";

const TableSkeleton = () => (
    <TablePrimitive containerClassName="w-full rounded-lg border border-border overflow-hidden bg-white">
        <TableHeader>
            <TableRow className="bg-foreground hover:bg-foreground border-none">
                <TableHead className="px-4 text-white h-12">Name</TableHead>
                <TableHead className="px-4 text-white h-12">Category</TableHead>
                <TableHead className="px-4 text-white h-12">Price</TableHead>
                <TableHead className="px-4 text-white h-12">Rating</TableHead>
                <TableHead className="px-4 text-white h-12 text-right">
                    Actions
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell className="px-4 py-4">
                        <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell className="px-4 py-4">
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell className="px-4 py-4">
                        <Skeleton className="h-4 w-[60px]" />
                    </TableCell>
                    <TableCell className="px-4 py-4">
                        <Skeleton className="h-4 w-[40px]" />
                    </TableCell>
                    <TableCell className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                            <Skeleton className="h-10 w-10 rounded-md" />
                            <Skeleton className="h-10 w-10 rounded-md" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </TablePrimitive>
);

export const Table = memo(
    ({
        isCreateOpen,
        setIsCreateOpen,
    }: {
        isCreateOpen: boolean;
        setIsCreateOpen: (v: boolean) => void;
    }) => {
        const { filteredProducts, deleteProduct, loading } = useProducts();
        const [editingProduct, setEditingProduct] = useState<Product | null>(
            null,
        );
        const [deletingId, setDeletingId] = useState<number | null>(null);
        const [isExpanded, setIsExpanded] = useState(false);

        if (loading) return <TableSkeleton />;

        const displayedProducts = isExpanded
            ? filteredProducts
            : filteredProducts.slice(0, 10);
        const hasMore = filteredProducts.length > 10;

        return (
            <div className="flex flex-col gap-4">
                <div className="relative w-full rounded-lg border border-border bg-white overflow-hidden">
                    <TablePrimitive>
                        <TableHeader>
                            <TableRow className="bg-foreground hover:bg-foreground border-none">
                                <TableHead className="px-4 font-bold text-white h-12 md:min-w-0 min-w-[180px]">
                                    Name
                                </TableHead>
                                <TableHead className="px-4 font-bold text-white h-12 md:min-w-0 min-w-[140px]">
                                    Category
                                </TableHead>
                                <TableHead className="px-4 font-bold text-white h-12 md:min-w-0 min-w-[100px]">
                                    Price
                                </TableHead>
                                <TableHead className="px-4 font-bold text-white h-12 md:min-w-0 min-w-[100px]">
                                    Rating
                                </TableHead>
                                <TableHead className="md:relative sticky right-0 px-4 font-bold text-white h-12 text-right bg-foreground z-20 md:min-w-0 min-w-[110px]">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-10 text-muted-foreground"
                                    >
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayedProducts.map((product) => (
                                    <TableRow
                                        key={product.id}
                                        className="hover:bg-muted/30 group"
                                    >
                                        <TableCell className="font-medium px-4">
                                            {product.title}
                                        </TableCell>
                                        <TableCell className="px-4">
                                            {formatCategory(product.category)}
                                        </TableCell>
                                        <TableCell className="px-4">
                                            {formatCurrency(product.price)}
                                        </TableCell>
                                        <TableCell className="px-4">
                                            <Badge
                                                variant="secondary"
                                                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none"
                                            >
                                                ★ {product.rating.toFixed(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="md:relative sticky right-0 px-4 text-right bg-white z-10 md:min-w-0 min-w-[110px] group-hover:bg-gray-50/80 transition-colors md:border-none border-l border-gray-100">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        setEditingProduct(
                                                            product,
                                                        )
                                                    }
                                                >
                                                    <Edit2 className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                                    onClick={() =>
                                                        setDeletingId(
                                                            product.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </TablePrimitive>

                    {}
                    {!isExpanded && hasMore && filteredProducts.length > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    )}
                </div>

                {hasMore && !isExpanded && (
                    <div className="flex justify-center -mt-8 relative z-10">
                        <Button
                            variant="outline"
                            onClick={() => setIsExpanded(true)}
                            className="bg-white border-border hover:bg-gray-50 px-8"
                        >
                            Show All Products ({filteredProducts.length})
                        </Button>
                    </div>
                )}

                {isExpanded && hasMore && (
                    <div className="flex justify-center mt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsExpanded(false)}
                            className="text-muted-foreground"
                        >
                            Show Less
                        </Button>
                    </div>
                )}

                <ProductDialog
                    product={null}
                    isDialogOpen={isCreateOpen}
                    setIsDialogOpen={setIsCreateOpen}
                />

                <ProductDialog
                    product={editingProduct}
                    isDialogOpen={!!editingProduct}
                    setIsDialogOpen={(open) => !open && setEditingProduct(null)}
                />

                <Dialog
                    open={!!deletingId}
                    onOpenChange={(open) => !open && setDeletingId(null)}
                >
                    <DialogContent className="flex flex-col p-0">
                        <DialogHeader className="border-b p-4">
                            <DialogTitle>Delete Product</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this product?
                                This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-col-reverse gap-2 border-t p-4 lg:flex-row">
                            <DialogClose asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setDeletingId(null)}
                                    className="rounded-sm"
                                >
                                    <span className="text-base">Cancel</span>
                                </Button>
                            </DialogClose>
                            <Button
                                size="sm"
                                variant="destructive"
                                className="rounded-sm"
                                onClick={async () => {
                                    if (deletingId) {
                                        await deleteProduct(deletingId);
                                        setDeletingId(null);
                                    }
                                }}
                            >
                                <span className="text-base">
                                    Delete Product
                                </span>
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    },
);
