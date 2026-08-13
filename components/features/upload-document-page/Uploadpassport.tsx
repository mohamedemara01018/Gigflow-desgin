import Dropzone from "@/components/ui/Dropzone";
import { FileSlots } from "@/views/UploadDocumentPage";
import {
    ImagePlus,
    CheckCircle2,
    Crop,
    Sun,
    Type,
    Info,
    Lock,
} from "lucide-react";

const REQUIREMENTS = [
    {
        icon: CheckCircle2,
        title: "Must be valid & unexpired",
        description: "Check the expiration date before uploading.",
    },
    {
        icon: Crop,
        title: "All four corners visible",
        description: "Do not crop the edges of the passport page.",
    },
    {
        icon: Sun,
        title: "No glare or shadows",
        description: "Ensure even lighting, especially over the hologram or laminate.",
    },
    {
        icon: Type,
        title: "Text must be perfectly readable",
        description: "Blurry images will be automatically rejected.",
    },
];

interface IUploadPassport {
    files: FileSlots,
    setFiles: React.Dispatch<React.SetStateAction<FileSlots>>;
}

export default function UploadPassport({ files, setFiles }: IUploadPassport) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 ">
            <div className="card flex flex-col gap-6 h-fit">
                <div className="max-w-160">
                    <h1 className="text-headline-md text-on-surface">
                        Upload Your Passport
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-2">
                        Please provide a clear, full-page photo of your passport&apos;s
                        information page. This ensures secure and verified access to the
                        ecosystem.
                    </p>
                </div>
                <Dropzone label="Drag & drop your passport photo" hint="JPG, PNG (Max 5MB)" files={files} setFiles={setFiles} index={0} />
            </div>

            <aside className="flex flex-col gap-6">
                <section className="bg-surface-container-low rounded-lg p-6">
                    <span className="flex items-center gap-2 text-headline-md text-[20px]! leading-7! text-on-surface">
                        <Info size={20} className="text-primary" />
                        Passport Requirements
                    </span>
                    <p className="text-body-sm text-on-surface-variant mt-2">
                        To avoid delays in verification, ensure your document meets
                        these strict criteria:
                    </p>

                    <div className="flex flex-col gap-4 mt-5">
                        {REQUIREMENTS.map(({ icon: Icon, title, description }) => (
                            <div key={title} className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                    <Icon size={14} />
                                </span>
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

                <section className="flex gap-3 bg-surface-container-low rounded-lg p-5">
                    <Lock size={18} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                        Your data is encrypted in transit and at rest. We only use
                        this information to verify your identity per KYC regulations.
                    </p>
                </section>
            </aside>
        </div>
    );
}