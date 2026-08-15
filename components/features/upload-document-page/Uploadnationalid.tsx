import Dropzone from "@/components/ui/Dropzone";
import {
    ShieldCheck,
    Lock,
    EyeOff,
    Lightbulb,
    Camera,
    Square,
    Crop,
    AlignLeft,
} from "lucide-react";




const TIPS = [
    { icon: Camera, label: "Well-lit" },
    { icon: Square, label: "No glare" },
    { icon: Crop, label: "All corners visible" },
    { icon: AlignLeft, label: "Text is readable" },
];

interface IUploadnationalid {
    files: File[],
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

function Uploadnationalid({ files, setFiles }: IUploadnationalid) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 ">
            <div className="card flex flex-col gap-6">
                <div>
                    <h1 className="text-headline-md text-on-surface">
                        Upload Your Documents
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-2">
                        Please provide clear photos of both the front and back of your
                        National ID to proceed.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                    <Dropzone label="Front of ID" hint="JPG, PNG (Max 5MB)" files={files} setFiles={setFiles} index={0} />
                    <Dropzone label="Back of ID" hint="JPG, PNG (Max 5MB)" files={files} setFiles={setFiles} index={1} />
                </div>

                <section className="bg-surface-container-low rounded-lg p-6">
                    <span className="flex items-center gap-2 text-body-md font-medium text-on-surface">
                        <Lightbulb size={18} className="text-primary" />
                        Tips for a good photo
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                        {TIPS.map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="bg-surface-container-highest rounded-md py-6 flex flex-col items-center gap-3"
                            >
                                <Icon size={22} className="text-on-surface" />
                                <span className="text-body-sm text-on-surface text-center">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <aside className="bg-surface-container-low rounded-lg p-6 h-fit">
                <span className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center">
                    <ShieldCheck size={22} />
                </span>
                <h2 className="text-headline-md text-[20px]! leading-7! text-on-surface mt-4">
                    Secure &amp; Private
                </h2>
                <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Your documents are encrypted and securely stored. We only use
                    this information to verify your identity and ensure trust across
                    our platform.
                </p>
                <div className="flex flex-col gap-2.5 mt-5">
                    <span className="flex items-center gap-2 text-body-sm text-on-surface font-medium">
                        <Lock size={16} className="text-primary" />
                        Bank-level encryption
                    </span>
                    <span className="flex items-center gap-2 text-body-sm text-on-surface font-medium">
                        <EyeOff size={16} className="text-primary" />
                        Never shared publicly
                    </span>
                </div>
            </aside>
        </div>
    )
}

export default Uploadnationalid