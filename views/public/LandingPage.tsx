

import Hero from "@/components/features/landing/Hero";
import PartnersBar from "@/components/features/landing/Partnersbar";
import Features from "@/components/features/landing/Features";
import Workflow from "@/components/features/landing/Workflow";
import Stats from "@/components/features/landing/Stats";
import Testimonial from "@/components/features/landing/Testimonial";
import CtaBanner from "@/components/features/landing/Ctabanner";

import PublicNavbar from "@/components/layout/public/navbar/Navbar";
import PublicFooter from "@/components/layout/public/footer/Footer";

function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-surface transition-colors duration-200">
            <PublicNavbar />
            <Hero />
            <PartnersBar />
            <Features />
            <Workflow />
            <Stats />
            <Testimonial />
            <CtaBanner />
            <PublicFooter />
        </div>
    )
}

export default LandingPage