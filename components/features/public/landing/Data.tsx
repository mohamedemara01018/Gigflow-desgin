import { BoltIcon, ShieldCheckIcon, BadgeCheckIcon } from './Icons';

export const features = [
    {
        icon: <BoltIcon />,
        title: 'Instant Matching',
        desc: 'Our AI engine analyzes your project requirements and connects you to the best talent in under 60 seconds. No more endless scrolling.',
    },
    {
        icon: <ShieldCheckIcon />,
        title: 'Secure Escrow',
        desc: 'Guaranteed payment via milestone-based escrow. Funds are held securely and released only when deliverables meet your satisfaction.',
    },
    {
        icon: <BadgeCheckIcon />,
        title: 'Verified Talent',
        desc: 'We verify the top 5% of freelancers, enabling a curated talent pool that critically forms the foundation of high-impact projects.',
    },
];

export const steps = [
    {
        num: '01',
        title: 'Post a Job',
        desc: 'Describe your project requirements and budget in our streamlined job listing format.',
    },
    {
        num: '02',
        title: 'Match with Talent',
        desc: 'Receive curated freelancer proposals within 24 hours, with portfolio and skill fit scores.',
    },
    {
        num: '03',
        title: 'Get Work Done',
        desc: 'Collaborate with your expert, track milestones, and release secure payments upon completion.',
    },
];

export const stats = [
    { value: '1M+', label: 'Jobs Completed' },
    { value: '$500M+', label: 'Paid to Freelancers' },
    { value: '4.9/5', label: 'Avg. Rating' },
];

export const partners = ['Linear', 'Stripe', 'Vercel', 'Notion', 'Figma'];