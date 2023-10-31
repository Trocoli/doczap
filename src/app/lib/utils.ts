import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { // Function that merges classnames together, packages: clsx & tailwind-merge
    return twMerge(clsx(inputs))
}