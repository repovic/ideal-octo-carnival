export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    rating: number;
    thumbnail: string;
    images: string[];
}

export type ProductInput = Omit<Product, "id">;

export interface Category {
    slug: string;
    name: string;
    url: string;
}
