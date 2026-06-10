import { cn } from "@/lib/utils";
interface ButtonProps
    extends Omit<React.ComponentPropsWithoutRef<"button">, "className"> {
    className?: string;
}
const Button = ({ className, ...props }: ButtonProps) => {
    const baseStyle = cn("rounded-sm bg-black text-white p-2");

    return (
        <button className={cn(baseStyle, className)}
            {...props}
        />
    );
}

export default Button;
