export default function PrivacyPolicyPage() {
    return (
        <main className="bg-(--color-surface) min-h-screen px-6 md:px-10 py-10">
            <div className="max-w-[900px] mx-auto">
                <h1 className="text-display-lg text-(--color-on-surface)">
                    Privacy Policy
                </h1>
                <p className="text-body-md text-(--color-on-surface-variant) mt-3">
                    Last updated: May 20, 2024
                </p>

                <hr className="border-(--color-outline-variant) mt-6" />

                <div className="flex flex-col gap-10 mt-8 text-(--color-on-surface-variant)">
                    <section>
                        <h2 className="text-headline-md text-(--color-on-surface)">
                            1. Introduction
                        </h2>
                        <p className="text-body-md leading-relaxed mt-3">
                            Welcome to GigFlow. We are committed to protecting your personal
                            data and respecting your privacy. This Privacy Policy outlines
                            how we collect, use, process, and protect your information when
                            you access or use our platform, services, and applications
                            (collectively, the &quot;Services&quot;).
                        </p>
                        <p className="text-body-md leading-relaxed mt-4">
                            By using GigFlow, you agree to the collection and use of
                            information in accordance with this policy. If you do not agree
                            with the terms of this Privacy Policy, please do not access the
                            Services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-headline-md text-(--color-on-surface)">
                            2. Data Collection
                        </h2>
                        <p className="text-body-md leading-relaxed mt-3">
                            We collect several different types of information for various
                            purposes to provide and improve our Services to you.
                        </p>

                        <h3 className="text-body-lg font-semibold text-(--color-on-surface) mt-6">
                            Types of Data Collected:
                        </h3>

                        <ul className="flex flex-col gap-3 mt-3">
                            <li className="flex gap-2 text-body-md leading-relaxed">
                                <span className="text-(--color-primary) mt-2 shrink-0">•</span>
                                <span>
                                    <strong className="text-(--color-on-surface)">
                                        Personal Data:
                                    </strong>{" "}
                                    While using our Services, we may ask you to provide us with
                                    certain personally identifiable information that can be used
                                    to contact or identify you. Personally identifiable
                                    information may include, but is not limited to:
                                    <ul className="flex flex-col gap-1.5 mt-3 ml-1">
                                        {[
                                            "Email address",
                                            "First name and last name",
                                            "Phone number",
                                            "Address, State, Province, ZIP/Postal code, City",
                                        ].map((item) => (
                                            <li key={item} className="text-body-md">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </span>
                            </li>
                            <li className="flex gap-2 text-body-md leading-relaxed">
                                <span className="text-(--color-primary) mt-2 shrink-0">•</span>
                                <span>
                                    <strong className="text-(--color-on-surface)">
                                        Professional Data:
                                    </strong>{" "}
                                    Skills, portfolio links, employment history, and gig
                                    completion records necessary to facilitate the freelancing
                                    marketplace.
                                </span>
                            </li>
                            <li className="flex gap-2 text-body-md leading-relaxed">
                                <span className="text-(--color-primary) mt-2 shrink-0">•</span>
                                <span>
                                    <strong className="text-on-surface">
                                        Usage Data:
                                    </strong>{" "}
                                    We may also collect information on how the Services are
                                    accessed and used. This Usage Data may include information
                                    such as your computer&apos;s Internet Protocol address (e.g., IP
                                    address), browser type, browser version, the pages of our
                                    Services that you visit, the time and date of your visit, the
                                    time spent on those pages, unique device identifiers, and
                                    other diagnostic data.
                                </span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-headline-md text-(--color-on-surface)">
                            3. How We Use Your Data
                        </h2>
                        <p className="text-body-md leading-relaxed mt-3">
                            GigFlow uses the collected data for various purposes:
                        </p>
                        <ul className="flex flex-col gap-2.5 mt-3">
                            {[
                                "To provide and maintain our Services, including facilitating connections between freelancers and clients.",
                                "To notify you about changes to our Services or your account status.",
                                "To allow you to participate in interactive features of our Services when you choose to do so.",
                                "To provide customer support and respond to inquiries.",
                                "To gather analysis or valuable information so that we can improve our Services.",
                                "To monitor the usage of our Services and detect, prevent, and address technical issues.",
                                "To provide you with news, special offers, and general information about other goods, services, and events which we offer that are similar to those that you have already purchased or enquired about, unless you have opted not to receive such information.",
                            ].map((item) => (
                                <li key={item} className="flex gap-2 text-body-md leading-relaxed">
                                    <span className="text-(--color-primary) mt-2 shrink-0">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-headline-md text-(--color-on-surface)">
                            4. Cookies and Tracking Technologies
                        </h2>
                        <p className="text-body-md leading-relaxed mt-3">
                            We use cookies and similar tracking technologies to track the
                            activity on our Services and hold certain information. Cookies
                            are files with a small amount of data which may include an
                            anonymous unique identifier. Cookies are sent to your browser
                            from a website and stored on your device.
                        </p>
                        <p className="text-body-md leading-relaxed mt-4">
                            You can instruct your browser to refuse all cookies or to
                            indicate when a cookie is being sent. However, if you do not
                            accept cookies, you may not be able to use some portions of our
                            Services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-headline-md text-(--color-on-surface)">
                            5. Data Sharing and Disclosure
                        </h2>
                        <p className="text-body-md leading-relaxed mt-3">
                            We do not sell your personal data. We may share your information
                            in the following situations:
                        </p>
                        <ul className="flex flex-col gap-3 mt-3">
                            {[
                                {
                                    label: "With Service Providers:",
                                    text: "We may share your personal information with Service Providers to monitor and analyze the use of our Services, process payments, or provide technical support.",
                                },
                                {
                                    label: "For Business Transfers:",
                                    text: "We may share or transfer your personal information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.",
                                },
                                {
                                    label: "With other users:",
                                    text: "When you share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.",
                                },
                                {
                                    label: "Law enforcement:",
                                    text: "Under certain circumstances, GigFlow may be required to disclose your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).",
                                },
                            ].map(({ label, text }) => (
                                <li key={label} className="flex gap-2 text-body-md leading-relaxed">
                                    <span className="text-(--color-primary) mt-2 shrink-0">•</span>
                                    <span>
                                        <strong className="text-(--color-on-surface)">{label}</strong>{" "}
                                        {text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-headline-md text-(--color-on-surface)">
                            6. Your Rights
                        </h2>
                        <p className="text-body-md leading-relaxed mt-3">
                            Depending on your location, you may have the following rights
                            regarding your personal data:
                        </p>
                        <ul className="flex flex-col gap-2.5 mt-3">
                            {[
                                "The right to access, update, or to delete the information we have on you.",
                                "The right of rectification. You have the right to have your information rectified if that information is inaccurate or incomplete.",
                                "The right to object. You have the right to object to our processing of your Personal Data.",
                                "The right of restriction. You have the right to request that we restrict the processing of your personal information.",
                                "The right to data portability. You have the right to be provided with a copy of your Personal Data in a structured, machine-readable, and commonly used format.",
                                "The right to withdraw consent. You also have the right to withdraw your consent at any time where GigFlow relied on your consent to process your personal information.",
                            ].map((item) => (
                                <li key={item} className="flex gap-2 text-body-md leading-relaxed">
                                    <span className="text-(--color-primary) mt-2 shrink-0">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="text-body-md leading-relaxed mt-4">
                            To exercise any of these rights, please contact our Data
                            Protection Officer at{" "}
                            <a
                                href="mailto:privacy@gigflow.com"
                                className="text-(--color-primary) hover:underline"
                            >
                                privacy@gigflow.com
                            </a>
                            .
                        </p>
                    </section>
                </div>

                <hr className="border-(--color-outline-variant) mt-10" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
                    <p className="text-body-md text-(--color-on-surface-variant)">
                        If you have questions about this policy, please contact us.
                    </p>
                    <button className="bg-(--color-primary) text-(--color-on-primary) text-label-md rounded-(--radius-md) px-6 py-2.5 hover:opacity-90 transition-opacity shrink-0">
                        Contact Support
                    </button>
                </div>
            </div>
        </main>
    );
}