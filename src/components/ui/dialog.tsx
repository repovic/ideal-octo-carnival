"use client";

import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
            className,
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
        overlayClassName?: string;
    }
>(({ className, overlayClassName, children, ...props }, ref) => {
    const clickedElementRef = React.useRef<HTMLElement | null>(null);
    const lastFocusedRef = React.useRef<HTMLElement | null>(null);
    const isTabNavigationRef = React.useRef(false);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Tab") {
                isTabNavigationRef.current = true;

                lastFocusedRef.current = document.activeElement as HTMLElement;
            } else {
                isTabNavigationRef.current = false;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Tab") {
                setTimeout(() => {
                    isTabNavigationRef.current = false;
                }, 50);
            }
        };

        document.addEventListener("keydown", handleKeyDown, true);
        document.addEventListener("keyup", handleKeyUp, true);

        return () => {
            document.removeEventListener("keydown", handleKeyDown, true);
            document.removeEventListener("keyup", handleKeyUp, true);
        };
    }, []);

    return (
        <DialogPortal>
            <DialogOverlay tabIndex={-1} className={overlayClassName} />
            <DialogPrimitive.Content
                ref={ref}
                tabIndex={0}
                onMouseDown={(e) => {
                    const target = e.target as HTMLElement;
                    const focusableSelectors =
                        "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]";
                    const clickedElement = target.closest(
                        focusableSelectors,
                    ) as HTMLElement;
                    if (clickedElement) {
                        clickedElementRef.current = clickedElement;
                        setTimeout(() => {
                            if (
                                clickedElementRef.current &&
                                document.contains(clickedElementRef.current)
                            ) {
                                clickedElementRef.current.focus();
                                clickedElementRef.current = null;
                            }
                        }, 0);
                    }
                }}
                onOpenAutoFocus={(e) => {
                    e.preventDefault();

                    const content = e.currentTarget as HTMLElement;
                    if (content) {
                        const focusableElements = content.querySelectorAll(
                            'button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), a[href]:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
                        );
                        const firstFocusable =
                            focusableElements[0] as HTMLElement;
                        if (firstFocusable) {
                            firstFocusable.focus();
                        }
                    }
                }}
                onFocus={(e) => {
                    if (e.target === e.currentTarget) {
                        const content = e.currentTarget as HTMLElement;
                        const focusableElements = content.querySelectorAll(
                            'button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), a[href]:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
                        );

                        const focusableArray = Array.from(
                            focusableElements,
                        ) as HTMLElement[];

                        const isFocusableElement = (
                            el: HTMLElement | null,
                        ): boolean => {
                            if (!el) return false;
                            const focusableSelectors =
                                'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
                            return el.matches(focusableSelectors);
                        };

                        if (
                            isTabNavigationRef.current &&
                            lastFocusedRef.current &&
                            content.contains(lastFocusedRef.current) &&
                            isFocusableElement(lastFocusedRef.current)
                        ) {
                            e.preventDefault();
                            const lastFocusedIndex = focusableArray.findIndex(
                                (el) => el === lastFocusedRef.current,
                            );

                            if (
                                lastFocusedIndex >= 0 &&
                                lastFocusedIndex < focusableArray.length - 1
                            ) {
                                for (
                                    let i = lastFocusedIndex + 1;
                                    i < focusableArray.length;
                                    i++
                                ) {
                                    const nextElement = focusableArray[i];

                                    if (nextElement?.offsetParent !== null) {
                                        nextElement?.focus();
                                        return;
                                    }
                                }
                            }

                            const firstFocusable =
                                focusableElements[0] as HTMLElement;
                            if (firstFocusable) {
                                firstFocusable.focus();
                            }
                        }
                    }
                }}
                className={cn(
                    "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 flex max-h-[80dvh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] flex-col gap-0 overflow-hidden outline-none duration-200 sm:rounded-lg",
                    className,
                )}
                {...props}
            >
                {children}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "bg-background sticky top-0 z-10 flex shrink-0 flex-col gap-2 border-b p-4 text-center",
            className,
        )}
        {...props}
    />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "bg-background sticky bottom-0 z-10 flex shrink-0 flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:justify-end",
            className,
        )}
        {...props}
    />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-xl font-semibold", className)}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-muted-foreground text-base", className)}
        {...props}
    />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
