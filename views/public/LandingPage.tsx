

import Hero from "@/components/features/public/landing/Hero";
import PartnersBar from "@/components/features/public/landing/Partnersbar";
import Features from "@/components/features/public/landing/Features";
import Workflow from "@/components/features/public/landing/Workflow";
import Stats from "@/components/features/public/landing/Stats";
import Testimonial from "@/components/features/public/landing/Testimonial";
import CtaBanner from "@/components/features/public/landing/Ctabanner";

import PublicNavbar from "@/components/layout/public/navbar/Navbar";
import PublicFooter from "@/components/layout/public/footer/Footer";

function LandingPage() {
    return (
        <div className="flex flex-col bg-surface transition-colors duration-200">
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