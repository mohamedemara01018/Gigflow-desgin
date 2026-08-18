import { userService } from "@/services/user.service";
import {
    IToastificationType,
    toastify,
} from "@/store/slices/toastificationSlice";
import { AppDispatch } from "@/store/store";
import { DURATION } from "@/utils/constant.utils";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface Passwords {
    current: string;
    newPass: string;
    confirm: string;
}

export function ChangePasswordSection() {
    const [passwords, setPasswords] = useState<Passwords>({
        current: "",
        newPass: "",
        confirm: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch<AppDispatch>();

    const handleAddToastification = (
        message: string,
        type: IToastificationType,
        duration?: number
    ) => {
        dispatch(
            toastify({
                message,
                type,
                duration,
            })
        );
    };

    const handleChange = (
        field: keyof Passwords,
        value: string
    ) => {
        setPasswords((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (passwords.newPass !== passwords.confirm) {
            handleAddToastification(
                "New password and confirmation password do not match",
                "error",
                DURATION
            );
            return;
        }


        try {
            setIsLoading(true);

            await userService.changePassword({
                currentPassword: passwords.current,
                newPassword: passwords.newPass,
            });

            handleAddToastification(
                "Password changed successfully",
                "success",
                DURATION
            );

            setPasswords({
                current: "",
                newPass: "",
                confirm: "",
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Something went wrong";

            handleAddToastification(
                message,
                "error",
                DURATION
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="card">
            <h2 className="text-headline-md text-on-surface">
                Change Password
            </h2>

            <p className="text-body-sm text-on-surface-variant mt-1">
                Ensure your account is using a long, random password to stay
                secure.
            </p>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 mt-5"
            >
                <input
                    type="password"
                    placeholder="Current Password"
                    value={passwords.current}
                    onChange={(e) =>
                        handleChange("current", e.target.value)
                    }
                    className="bg-surface-container-low rounded-md px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30"
                />

                <input
                    type="password"
                    placeholder="New Password"
                    value={passwords.newPass}
                    onChange={(e) =>
                        handleChange("newPass", e.target.value)
                    }
                    className="bg-surface-container-low rounded-md px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30"
                />

                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwords.confirm}
                    onChange={(e) =>
                        handleChange("confirm", e.target.value)
                    }
                    className="bg-surface-container-low rounded-md px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/30"
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="self-start bg-primary text-on-primary text-label-md rounded-md px-5 py-2.5 mt-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </section>
    );
}