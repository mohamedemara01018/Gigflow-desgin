

import FreelanceNavbar from "@/components/layout/freelancer/navbar/Navbar";
import FreelanceFooter from "@/components/layout/freelancer/footer/Footer";

function FreelancerPage() {
    return (
        <div className="min-h-screen bg-background text-on-surface font-['Inter']">
            <FreelanceNavbar />

            <main className="wrapper py-8 space-y-8">
                freelancer
            </main>

            <FreelanceFooter />
        </div>
    )
}

export default FreelancerPage