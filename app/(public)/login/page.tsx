"use client";

import LoginForm from "@/components/features/login/LoginForm";
import Link from "next/link";

// Inline SVGs for icons


export default function LoginPage() {


  return (
    <div className="bg-background font-sans text-on-surface selection:bg-primary-fixed-dim selection:text-on-primary-fixed min-h-screen flex flex-col justify-center items-center py-8 px-6">
      <main className="w-full max-w-110 flex flex-col gap-8">


        {/* Login Card */}
        <div
          className="border border-outline-variant rounded-3xl p-8 md:p-10 flex flex-col gap-8"
          style={{ boxShadow: "var(--shadow-level-2)" }}
        >

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-on-surface">Welcome Back</h2>
            <p className="text-sm text-on-surface-variant">Enter your credentials to access your workspace.</p>
          </div>

          <LoginForm />

          

          {/* Footer Link */}
          <Link href={'/role'} className="text-center text-sm text-on-surface-variant">
            Don&apos;t have an account?
            <a className="text-primary text-sm font-medium hover:underline decoration-2 underline-offset-4 ml-1" href="#">
              Create an account
            </a>
          </Link>
        </div>


      </main>

      {/* Support Links */}
      <footer className="mt-8 flex gap-8">
        <a className="text-xs font-medium text-outline hover:text-on-surface transition-colors" href="#">Privacy Policy</a>
        <a className="text-xs font-medium text-outline hover:text-on-surface transition-colors" href="#">Terms of Service</a>
        <a className="text-xs font-medium text-outline hover:text-on-surface transition-colors" href="#">Contact Support</a>
      </footer>
    </div>
  );
}