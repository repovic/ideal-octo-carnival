"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff, Search } from "lucide-react";
import * as React from "react";
import { Button } from "./button";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

        if (type === "password") {
            return (
                <div className="relative">
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        className={cn(
                            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-4 py-3 pr-16 text-base file:border-0 file:bg-transparent file:text-base file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            className,
                        )}
                        ref={ref}
                        {...props}
                    />
                    <div className="absolute right-0 top-0 flex h-full w-16 cursor-pointer items-center justify-center">
                        <Button
                            type="button"
                            onClick={() => {
                                setIsPasswordVisible((prev) => !prev);
                            }}
                            className="select-none rounded-full"
                            variant="ghost"
                            size="icon"
                        >
                            {isPasswordVisible ? (
                                <EyeOff size={28} />
                            ) : (
                                <Eye size={28} />
                            )}
                        </Button>
                    </div>
                </div>
            );
        }

        if (type === "search") {
            return (
                <div className="relative w-full">
                    <div className="absolute left-0 top-0 flex h-full w-12 cursor-pointer items-center justify-center">
                        <Button
                            type="button"
                            className="select-none rounded-full"
                            variant="ghost"
                            size="icon"
                        >
                            <Search size={22} />
                        </Button>
                    </div>
                    <input
                        className={cn(
                            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-4 py-3 pl-12 text-base file:border-0 file:bg-transparent file:text-base file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            className,
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
            );
        }

        return (
            <input
                type={type}
                className={cn(
                    "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-4 py-3 text-base file:border-0 file:bg-transparent file:text-base file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Input.displayName = "Input";

export { Input };
