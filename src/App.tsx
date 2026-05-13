import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    AlertTriangle,
    CheckCircle2,
    Info,
    LoaderCircle,
    Plus,
    XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { useDebounceValue } from "usehooks-ts";
import { Filters } from "./components/filters";
import { Table } from "./components/table";
import { TopRated } from "./components/top-rated";
import { Context } from "./context/context";
import { useProducts } from "./hooks/useProducts";

function AppContent() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { setSearch } = useProducts();

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch] = useDebounceValue(searchQuery, 300);

    useEffect(() => {
        setSearch(debouncedSearch);
    }, [debouncedSearch, setSearch]);

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
                <main className="flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                            <Input
                                placeholder="Search products..."
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="text-lg border-border flex-1 h-[54px]"
                            />
                            <Button
                                onClick={() => setIsCreateOpen(true)}
                                size={"lg"}
                                className="flex items-center justify-center gap-4 w-full md:w-auto text-base rounded-md shrink-0"
                            >
                                <Plus className="size-5" /> Add Product
                            </Button>
                        </div>

                        <Filters />
                    </div>

                    <Table
                        isCreateOpen={isCreateOpen}
                        setIsCreateOpen={setIsCreateOpen}
                    />

                    <Separator />

                    <TopRated />
                </main>
            </div>

            <Toaster
                icons={{
                    success: <CheckCircle2 />,
                    info: <Info />,
                    warning: <AlertTriangle />,
                    error: <XCircle />,
                    loading: <LoaderCircle className="animate-spin" />,
                }}
                visibleToasts={3}
                position="bottom-left"
            />
        </div>
    );
}

function App() {
    return (
        <Context>
            <AppContent />
        </Context>
    );
}

export default App;
