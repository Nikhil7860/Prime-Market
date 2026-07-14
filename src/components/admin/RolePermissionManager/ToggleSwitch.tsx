"use client";

interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    color?: "green" | "blue" | "red" | "purple";
}

export default function ToggleSwitch({ checked, onChange, disabled = false, color = "blue" }: ToggleSwitchProps) {
    const colors = {
        green: "bg-green-600",
        blue: "bg-blue-600",
        red: "bg-red-600",
        purple: "bg-purple-600",
    };

    return (
        <label
            className={`inline-flex items-center ${disabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
                }`}
        >
            <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} className="sr-only" />

            <div
                className={`
                    relative
                    h-6
                    w-11
                    rounded-full
                    transition-all
                    duration-300
                    ${checked ? colors[color] : "bg-slate-300"}`}
            >
                <span
                    className={`
                        absolute
                        top-0.5
                        left-0.5
                        h-5
                        w-5
                        rounded-full
                        bg-white
                        shadow
                        transition-transform
                        duration-300
                        ${checked ? "translate-x-5" : "translate-x-0"}`}
                />
            </div>
        </label>
    );
}