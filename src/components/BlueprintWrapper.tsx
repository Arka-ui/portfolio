"use client";

interface BlueprintWrapperProps {
    children: React.ReactNode;
    label?: string;
    description?: string;
    techSpecs?: Record<string, string>;
    direction?: "top" | "bottom" | "left" | "right";
    className?: string;
    offset?: number;
}

// Passthrough — blueprint annotations removed in this redesign.
export default function BlueprintWrapper({ children, className }: BlueprintWrapperProps) {
    return <div className={className}>{children}</div>;
}
