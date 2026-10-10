import {
  Zap,
  Wallet,
} from 'lucide-react';
import RegisterForm from '@/components/features/public/register/RegisterForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-6 font-sans text-base leading-6 text-on-surface selection:bg-primary-fixed-dim selection:text-on-primary-fixed">
      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center z-10">

        {/* Left Column: Branding & Atmosphere */}
        <section className="hidden lg:flex lg:col-span-5 flex-col justify-center gap-8 h-full pr-8">
          <div>
            <h1 className="text-2xl leading-8 font-semibold text-primary mb-2">GigFlow</h1>
            <h2 className="text-5xl leading-[1.15] font-bold tracking-tight text-on-surface">
              Scale your freelance career with <span className="text-primary-container">precision.</span>
            </h2>
            <p className="text-lg leading-7 text-on-surface-variant mt-4 max-w-md">
              Join the elite ecosystem where talent meets opportunity. Manage jobs, track growth, and get paid faster.
            </p>
          </div>

          {/* Bento-style feature highlights */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="backdrop-blur-md border border-outline-variant p-4 rounded-xl"
              style={{ boxShadow: 'var(--shadow-level-2)' }}
            >
              <div className="text-primary mb-2"><Zap size={24} /></div>
              <h3 className="text-sm leading-5 font-medium tracking-wide text-on-surface">Instant Matching</h3>
              <p className="text-sm leading-5 text-on-surface-variant">AI-driven job curation based on your stack.</p>
            </div>
            <div
              className="backdrop-blur-md border border-outline-variant p-4 rounded-xl"
              style={{ boxShadow: 'var(--shadow-level-2)' }}
            >
              <div className="text-primary mb-2"><Wallet size={24} /></div>
              <h3 className="text-sm leading-5 font-medium tracking-wide text-on-surface">Secure Escrow</h3>
              <p className="text-sm leading-5 text-on-surface-variant">Guaranteed payments for every milestone.</p>
            </div>
          </div>
        </section>

        {/* Right Column: Registration Form */}
        <section className="lg:col-span-7 w-full max-w-2xl mx-auto">
          <div
            className="flex flex-col backdrop-blur-md border border-outline-variant p-8 rounded-xl"
            style={{ boxShadow: 'var(--shadow-level-2)' }}
          >
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl leading-8 font-semibold text-on-surface">Create an account</h2>
              <p className="text-base leading-6 text-on-surface-variant">Join 50k+ professionals globally</p>
            </div>

            <RegisterForm />

            <Link href={'/login'} className="block text-center text-sm leading-5 text-on-surface-variant mt-8">
              Already have an account?{' '}
              <span className="text-primary font-bold hover:underline">Sign in to GigFlow</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Visual Polish: Background Gradients */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/5 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary-container/10 rounded-full blur-[100px] -z-10"></div>
    </div>
  );
}