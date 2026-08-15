import Dropzone from "@/components/ui/Dropzone";
import { ShieldCheck, CheckCircle2, Lock } from "lucide-react";



const REQUIREMENTS = [
    {
        title: "Issued by government",
        description: "Must be a valid state or federal ID.",
    },
    {
        title: "Current and valid",
        description: "Cannot be expired or revoked.",
    },
    {
        title: "Photo must be clear",
        description: "Ensure no glare or blur obscures your face.",
    },
    {
        title: "Address must be visible",
        description: "Your current residential address must be readable.",
    },
];

interface IUploadDriversLicensePage {
    files: File[],
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}


export default function UploadDriversLicensePage({ files, setFiles }: IUploadDriversLicensePage) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mt-8">
            <div className="card h-fit">
                <h1 className="text-headline-md text-on-surface">
                    Upload Your Driver&apos;s License
                </h1>
                <p className="text-body-md text-on-surface-variant mt-2">
                    Please provide clear photos of both the front and back of your
                    valid driver&apos;s license.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mt-8">
                    <Dropzone label="Front of License" hint="JPG, PNG (Max 5MB)" files={files} setFiles={setFiles} index={0} />
                    <Dropzone label="Back of License" hint="JPG, PNG (Max 5MB)" files={files} setFiles={setFiles} index={1} />
                </div>
            </div>

            <aside className="flex flex-col gap-6">
                <section className="bg-surface-container-low rounded-lg p-6">
                    <span className="flex items-center gap-2 text-headline-md text-[20px]! leading-7! text-on-surface">
                        <ShieldCheck size={20} className="text-primary" />
                        License Requirements
                    </span>

                    <div className="flex flex-col gap-4 mt-5">
                        {REQUIREMENTS.map(({ title, description }) => (
                            <div key={title} className="flex gap-3">
                                <CheckCircle2
                                    size={18}
                                    className="text-primary shrink-0 mt-0.5"
                                />
                                <div>
                                    <p className="text-body-md font-medium text-on-surface">
                                        {title}
                                    </p>
                                    <p className="text-body-sm text-on-surface-variant mt-0.5">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-surface-container-low border-l-4 border-primary rounded-md p-5 flex gap-3">
                    <Lock size={18} className="text-primary shrink-0 mt-0.5" />
                    <div>
                        <p className="text-body-md font-semibold text-on-surface">
                            Your Data is Secure
                        </p>
                        <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                            We use bank-level encryption to protect your personal
                            information. Your documents are used solely for identity
                            verification.
                        </p>
                    </div>
                </section>
            </aside>
        </div>
    );
}