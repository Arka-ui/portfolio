"use client";

import BlueprintAnnotation from "./BlueprintAnnotation";

interface BlueprintWrapperProps {
    children: React.ReactNode;
    label: string;
    description?: string;
    techSpecs?: Record<string, string>;
    direction?: "top" | "bottom" | "left" | "right";
    className?: string;
    offset?: number;
}

export default function BlueprintWrapper({
    children,
    label,
    description,
    techSpecs,
    direction,
    className,
    offset
}: BlueprintWrapperProps) {
    return (
        <BlueprintAnnotation
            label={label}
            description={description}
            techSpecs={techSpecs}
            direction={direction}
            className={className}
            offset={offset}
        >
            {children}
        </BlueprintAnnotation>
    );
}
