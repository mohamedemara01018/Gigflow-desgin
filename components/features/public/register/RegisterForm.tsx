/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import {
    ArrowRight,
    Loader2,
    CheckCircle2,
} from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { InputField } from './InputFeild';
import { authService } from '@/services/auth.service';
import { useRouter, useSearchParams } from 'next/navigation';
import FormError from '@/components/ui/FormError';
import { GoogleIcon } from '@/utils/icons.utils';
import { DURATION } from '@/utils/constant.utils';
import { Sign, UserRole } from '@/utils/enums.utils';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { IToastificationType, toastify } from '@/store/slices/toastificationSlice';

function RegisterForm() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false); // حالة الـ Checkbox للشروط والأحكام
    const [googleLoading, setGoogleLoading] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const router = useRouter();
    const role = searchParams.get('role');

    const dispatch: AppDispatch = useDispatch();
    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setConfirmPassword(val);
        if (!formData.password) {
            setConfirmPasswordError('must provide your password then confirm it');
            return;
        }
        if (formData.password !== val) {
            setConfirmPasswordError('confirm password not match your password');
        } else {
            setConfirmPasswordError('');
        }
    };

    const validate = () => {
        if (!formData.firstName.trim()) return "First name is required";
        if (!formData.lastName.trim()) return "Last name is required";
        if (!formData.email.trim()) return "Email is required";
        if (!formData.password.trim()) return "Password is required";
        if (formData.password.length < 8) return "Password must be at least 8 characters";
        if (!confirmPassword.trim()) return "Confirm password is required";
        if (formData.password !== confirmPassword) return "Passwords do not match";
        if (!agreed) return "You must accept the terms and conditions";
        return "";
    };

    // التحقق من امتلاء جميع الحقول وتطابق كلمة المرور وتفعيل الـ Checkbox
    const isFormValid =
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.password.length >= 8 &&
        confirmPassword.trim() !== "" &&
        formData.password === confirmPassword &&
        agreed;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const vaildateError = validate();
        if (vaildateError) {
            handleAddToastification(String(vaildateError), "error", DURATION);
            return;
        }
        setStatus('loading');

        try {
            if (role === UserRole.ADMIN) {
                // منطق خاص بالـ Admin إذا لزم الأمر
            }

            const data = await authService.register({ ...formData, role });
            handleAddToastification(String(data.message), "success", DURATION);

            router.push('/verify-email');
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
            });
            setConfirmPassword('');
            setAgreed(false);
        } catch (error: any) {
            handleAddToastification(String(error.message), "error", DURATION);
        } finally {
            setStatus('idle');
        }
    };

    const handleGoogleRegister = () => {
        try {
            setGoogleLoading(true);
            window.location.href = `/api/auth/google/login?sign=${Sign.REGISTER}&role=${role}`;
        } catch (error: any) {
            handleAddToastification(String(error.message), "error", DURATION);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Names Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-start gap-1.5 w-full">
                    <label htmlFor="first_name" className="text-[14px] font-medium text-on-surface">First Name</label>
                    <InputField id="first_name" name='firstName' type="text" label="First Name" placeholder="e.g. John" required value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="flex flex-col items-start gap-1.5 w-full">
                    <label htmlFor="last_name" className="text-[14px] font-medium text-on-surface">Last Name</label>
                    <InputField id="last_name" name='lastName' type="text" label="Last Name" placeholder="e.g. Doe" required value={formData.lastName} onChange={handleChange} />
                </div>
            </div>

            {/* Identity Row */}
            <div className="flex flex-col items-start gap-1.5 w-full">
                <label htmlFor="email" className="text-[14px] font-medium text-on-surface">Email Address</label>
                <InputField id="email" name='email' type="email" label="Email Address" placeholder="alex@example.com" required value={formData.email} onChange={handleChange} />
            </div>

            <FormError error={confirmPasswordError} />

            {/* Passwords Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-start gap-1.5 w-full">
                    <label htmlFor="password" className="text-[14px] font-medium text-on-surface">Password</label>
                    <InputField id="password" name='password' isPassword label="Password" placeholder="Minimum 8 characters" required minLength={8} value={formData.password} onChange={handleChange} />
                </div>
                <div className="flex flex-col items-start gap-1.5 w-full">
                    <label htmlFor="confirm_password" className="text-[14px] font-medium text-on-surface">Confirm Password</label>
                    <InputField id="confirm_password" isPassword label="Confirm Password" placeholder="Repeat your password" required minLength={8} value={confirmPassword} onChange={handleChangeConfirmPassword} />
                </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 py-1">
                <div className="flex items-center h-5">
                    <input
                        id="terms"
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        required
                        className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary-fixed-dim"
                    />
                </div>
                <label htmlFor="terms" className="text-[14px] leading-5 text-on-surface-variant">
                    I accept the <a href="/terms-of-service" className="text-primary font-medium hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-primary font-medium hover:underline">Privacy Policy</a>.
                </label>
            </div>

            {/* Actions */}
            <button
                type="submit"
                disabled={status !== 'idle' || !isFormValid}
                className={`w-full text-on-primary text-[14px] leading-5 font-medium tracking-[0.01em] py-4 rounded-lg shadow-lg transition-all flex justify-center items-center gap-2
                    ${status !== 'idle' || !isFormValid ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:shadow-xl active:scale-[0.98] opacity-100'}
                `}
                style={{
                    background: status === 'success'
                        ? 'var(--color-primary)'
                        : 'linear-gradient(135deg, var(--color-primary-container) 0%, var(--color-inverse-primary) 100%)',
                }}
            >
                {status === 'idle' && (
                    <>
                        <span>Register</span>
                        <ArrowRight size={18} />
                    </>
                )}
                {status === 'loading' && <Loader2 size={18} className="animate-spin" />}
                {status === 'success' && (
                    <>
                        <CheckCircle2 size={18} />
                        <span>Account Created</span>
                    </>
                )}
            </button>

            <div className="relative flex items-center py-4">
                <div className="grow border-t border-outline-variant"></div>
                <span className="shrink mx-4 text-on-surface-variant text-[12px] leading-4 font-semibold">OR CONTINUE WITH</span>
                <div className="grow border-t border-outline-variant"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-1 gap-4">
                <button
                    type="button"
                    onClick={handleGoogleRegister}
                    className="flex items-center justify-center gap-2 px-4 py-3 border border-outline-variant rounded-xl hover:bg-surface-container hover:border-outline transition-all focus:ring-2 focus:ring-outline-variant/30 outline-none">
                    <GoogleIcon className="w-5 h-5" />
                    <span className="text-sm font-medium text-on-surface">{googleLoading ? 'Redirecting...' : 'Google'}</span>
                </button>
            </div>
        </form>
    );
}

export default RegisterForm;