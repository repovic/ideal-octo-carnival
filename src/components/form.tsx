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
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useProducts } from "../hooks/useProducts";
import type { ProductInput } from "../types/product";

interface FormProps {
    initialData?: z.infer<typeof formSchema> & { id: number };
    onSuccess: () => void;
    formId?: string;
    onSubmittingChange?: (isSubmitting: boolean) => void;
}

export const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    description: z
        .string()
        .min(5, "Description must be at least 5 characters."),
    price: z.number().positive("Price must be a positive number."),
    category: z.string().min(1, "Please select a category."),
    rating: z.number().min(0).max(5, "Rating must be between 0 and 5."),
    thumbnail: z.string().url().optional().or(z.literal("")),
});

export const ProductForm: React.FC<FormProps> = ({
    initialData,
    onSuccess,
    formId,
    onSubmittingChange,
}) => {
    const { categories, createProduct, updateProduct } = useProducts();
    const isEditing = !!initialData;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                  ...initialData,
                  rating: Number(initialData.rating),
              }
            : {
                  title: "",
                  description: "",
                  price: 0,
                  category: "",
                  rating: 0,
                  thumbnail:
                      "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
              },
    });

    useEffect(() => {
        if (onSubmittingChange) {
            onSubmittingChange(form.formState.isSubmitting);
        }
    }, [form.formState.isSubmitting, onSubmittingChange]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const productData: ProductInput = {
            ...data,
            thumbnail:
                data.thumbnail ||
                "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
            images: [],
        };

        if (isEditing) {
            await updateProduct(initialData.id, productData);
        } else {
            await createProduct(productData);
        }
        onSuccess();
    };

    return (
        <Form {...form}>
            <form
                id={formId}
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-4 p-4"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-2">
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Product name"
                                    className="text-lg"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-sm font-medium text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Product description"
                                    className="min-h-[100px] text-lg"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-sm font-medium text-red-500" />
                        </FormItem>
                    )}
                />

                <div className="grid w-full grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col gap-2">
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        className="text-lg"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.valueAsNumber || 0,
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage className="text-sm font-medium text-red-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col gap-2">
                                <FormLabel>Rating (0-5)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        className="text-lg"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.valueAsNumber || 0,
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage className="text-sm font-medium text-red-500" />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-2">
                            <FormLabel>Category</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="text-lg">
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
                                                {cat.charAt(0).toUpperCase() +
                                                    cat.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-sm font-medium text-red-500" />
                        </FormItem>
                    )}
                />

                <button
                    type="submit"
                    className="hidden"
                    disabled={form.formState.isSubmitting}
                />
            </form>
        </Form>
    );
};

export { ProductForm as Form };
