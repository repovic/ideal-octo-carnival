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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useProducts } from "../hooks/use-products";
import { formatCategory } from "../lib/utils";
import type { Product, ProductInput } from "../types/product";

interface ProductDialogProps {
    product: Product | null;
    isDialogOpen: boolean;
    setIsDialogOpen: (value: boolean) => void;
    onComplete?: () => void;
}

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    description: z
        .string()
        .min(5, "Description must be at least 5 characters."),
    price: z.number().positive("Price must be a positive number."),
    category: z.string().min(1, "Please select a category."),
    rating: z.number().min(0).max(5, "Rating must be between 0 and 5."),
    thumbnail: z.string().url().optional().or(z.literal("")),
});

const defaultFormValues = {
    title: "",
    description: "",
    price: 0,
    category: "",
    rating: 0,
    thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
};

export function ProductDialog({
    product,
    isDialogOpen,
    setIsDialogOpen,
    onComplete,
}: ProductDialogProps) {
    const { categories, create, update } = useProducts();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultFormValues,
        shouldUnregister: false,
    });

    useEffect(() => {
        if (isDialogOpen) {
            form.reset(
                product
                    ? {
                          ...product,
                          rating: Number(product.rating),
                      }
                    : defaultFormValues,
            );
        }
    }, [isDialogOpen, product, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const productData: ProductInput = {
                ...values,
                thumbnail:
                    values.thumbnail ||
                    "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
                images: [],
            };

            if (product) {
                await update(product.id, productData);
            } else {
                await create(productData);
            }

            if (onComplete) {
                onComplete();
            }

            setIsDialogOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="flex flex-col p-0">
                <DialogHeader className="border-b p-4">
                    <DialogTitle>
                        {product ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                    <DialogDescription>
                        {product
                            ? "Update the details of the product below."
                            : "Fill in the details for the new product below."}
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[384px] overflow-y-auto">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex w-full flex-col items-center justify-center gap-4 p-4"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Product name"
                                                className="text-lg h-[54px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-sm" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Product description"
                                                className="min-h-[100px] text-lg"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-sm" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid w-full grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    disabled={isSubmitting}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Price ($)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    className="text-lg h-[54px]"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target
                                                                .valueAsNumber ||
                                                                0,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage className="text-sm" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="rating"
                                    disabled={isSubmitting}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Rating (0-5)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    className="text-lg h-[54px]"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target
                                                                .valueAsNumber ||
                                                                0,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage className="text-sm" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="category"
                                disabled={isSubmitting}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-[54px] text-lg">
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {categories.map((cat) => (
                                                        <SelectItem
                                                            className="text-lg"
                                                            key={cat}
                                                            value={cat}
                                                        >
                                                            {formatCategory(
                                                                cat,
                                                            )}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-sm" />
                                    </FormItem>
                                )}
                            />

                            <button
                                type="submit"
                                className="hidden"
                                disabled={isSubmitting}
                            />
                        </form>
                    </Form>
                </div>

                <DialogFooter className="flex flex-col-reverse gap-2 border-t p-4 lg:flex-row">
                    <DialogClose asChild>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={isSubmitting}
                            className="rounded-sm"
                        >
                            <span className="text-base">Cancel</span>
                        </Button>
                    </DialogClose>
                    <Button
                        size="sm"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="rounded-sm"
                    >
                        {isSubmitting ? (
                            <LoaderCircle size={22} className="animate-spin" />
                        ) : product ? (
                            <Save size={22} />
                        ) : (
                            <Plus size={22} />
                        )}

                        <span className="text-base">
                            {isSubmitting
                                ? product
                                    ? "Updating..."
                                    : "Creating..."
                                : product
                                  ? "Update Product"
                                  : "Create Product"}
                        </span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
