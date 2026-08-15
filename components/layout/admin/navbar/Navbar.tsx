import ToggleTheme from "@/components/ui/ToggleTheme";
import { ShieldCheck } from "lucide-react";

interface NavbarProps {
    HEADER_HIGH: number;
}

function Navbar({ HEADER_HIGH }: NavbarProps) {
    return (
        <header
            className="fixed top-0 right-0 left-0 z-50"
            style={{ height: `${HEADER_HIGH}px` }}
        >
            <div className="flex h-full items-center justify-between border-b border-outline-variant bg-surface-container px-6">

                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-tertiary text-on-tertiary">
                        <ShieldCheck size={18} />
                    </span>

                    <span className="text-[20px]! leading-7! text-tertiary">
                        Admin Panel
                    </span>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    <ToggleTheme />
                    <span className="flex items-center gap-2 rounded-full bg-surface-container-high px-3.5 py-1.5 text-body-sm text-on-surface">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        System Active
                    </span>

                    <button
                        type="button"
                        aria-label="Admin settings"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary text-on-tertiary transition-opacity hover:opacity-90"
                    >
                        <ShieldCheck size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;