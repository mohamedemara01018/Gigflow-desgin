/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService } from '@/services/auth.service';
import { IToastificationType, toastify } from '@/store/slices/toastificationSlice';
import { AppDispatch } from '@/store/store';
import { BASE_URL, DURATION } from '@/utils/constant.utils';
import { Sign } from '@/utils/enums.utils';
import { GoogleIcon } from '@/utils/icons.utils';
import { ArrowRight, EyeIcon, EyeOffIcon, Loader2, LockIcon, MailIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux';

function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false)
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const router = useRouter();

    const dispatch: AppDispatch = useDispatch();
    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }))
    }

    const validate = () => {
        if (!email.trim()) return "Email is required";
        if (!password.trim()) return "Password is required";
        return "";
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        const vaildateError = validate();
        if (vaildateError) {
            handleAddToastification(vaildateError, "warning", DURATION);
            return
        }
        setIsLoading(true);
        // Simulate login API call
        try {
            const res = await authService.login({
                "email": email,
                "password": password
            })
            handleAddToastification(String(res.message), "success", DURATION);

            router.replace('/')
            setEmail('');
            setPassword('');

        } catch (error: any) {
            handleAddToastification(error.message, "error", DURATION);
        } finally {
            setIsLoading(false)
        }
    };

    const handleGoogleLogin = () => {

        try {
            setGoogleLoading(true)
            window.location.href = BASE_URL + `/api/auth/google/login?sign=${Sign.LOGIN}`
        } catch (error: any) {
            handleAddToastification(error.message, "error", DURATION);
        }
    }
    return (
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="flex flex-col gap-1">
                <label className={`text-sm font-medium ml-1 transition-colors ${emailFocused ? 'text-primary' : 'text-on-surface-variant'}`} htmlFor="email">
                    Email Address
                </label>
                <div
                    className="relative group"
                    style={{ transform: emailFocused ? 'scale(1.01)' : 'scale(1)', transition: 'transform 200ms ease' }}
                >
                    <MailIcon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors w-5 h-5 ${emailFocused ? 'text-primary' : 'text-on-surface-variant'}`} />
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-outline text-on-surface"
                        placeholder="name@company.com"
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center px-1">
                    <label className={`text-sm font-medium transition-colors ${passwordFocused ? 'text-primary' : 'text-on-surface-variant'}`} htmlFor="password">
                        Password
                    </label>
                    <Link href="forgot-password" className="text-sm font-medium text-primary hover:underline transition-all" >
                        Forgot password?
                    </Link>
                </div>
                <div
                    className="relative group"
                    style={{ transform: passwordFocused ? 'scale(1.01)' : 'scale(1)', transition: 'transform 200ms ease' }}
                >
                    <LockIcon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors w-5 h-5 ${passwordFocused ? 'text-primary' : 'text-on-surface-variant'}`} />
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        className="w-full pl-12 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-outline text-on-surface"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                        disabled={isLoading}
                    >
                        {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 px-1 mt-1">
                <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0"
                    disabled={isLoading}
                />
                <label className="text-sm text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                    Remember this device
                </label>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl text-on-primary font-medium flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent)',
                    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                    if (!isLoading) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 20px color-mix(in srgb, var(--color-primary) 40%, transparent)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isLoading) {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent)';
                    }
                }}
                onMouseDown={(e) => {
                    if (!isLoading) {
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.filter = 'brightness(0.95)';
                    }
                }}
                onMouseUp={(e) => {
                    if (!isLoading) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.filter = 'none';
                    }
                }}
            >
                {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <>
                        <span>Sign In to GigFlow</span>
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-outline-variant"></span>
                </div>
                <span className="relative bg-background px-4 text-xs font-medium text-outline uppercase tracking-widest">
                    Or continue with
                </span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-1 gap-4">
                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-outline-variant rounded-xl hover:bg-surface-container hover:border-outline transition-all focus:ring-2 focus:ring-outline-variant/30 outline-none cursor-pointer">

                    <GoogleIcon className="w-5 h-5" />
                    <span className="text-sm font-medium text-on-surface">{googleLoading ? 'Redirecting...' : 'Google'} </span>
                </button>
            </div>
        </form>
    )
}

export default LoginForm