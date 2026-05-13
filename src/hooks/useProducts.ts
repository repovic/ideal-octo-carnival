import { useProductContext } from "../context/context";

export const useProducts = () => {
    const context = useProductContext();

    return {
        ...context,
    };
};
