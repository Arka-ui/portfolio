"use client";

import BlueprintAnnotation from "./BlueprintAnnotation";

interface BlueprintWrapperProps {
    children: React.ReactNode;
    label: string;
    description?: string;
    direction?: "top" | "bottom" | "left" | "right";
    className?: string;
}

export default function BlueprintWrapper({
    children,
    label,
    description,
    direction,
    className
}: BlueprintWrapperProps) {
    return (
        <BlueprintAnnotation
            label={label}
            description={description}
            direction={direction}
            className={className}
        >
            {children}
        </BlueprintAnnotation>
    );
}
