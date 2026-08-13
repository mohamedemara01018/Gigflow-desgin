import { Briefcase, ImageOff } from "lucide-react";
import { ChangeEvent } from "react";

interface IdentityDocumentCardProps {
    documentType: string;
    imgs: string[]
    notes: string,
    notesError: boolean,
    setNotesError: (notesError: boolean) => void,
    setNotes: (notes: string) => void
}

function DocumentThumb({ src, label }: { src?: string; label: string }) {
    return (
        <div className="relative rounded-md overflow-hidden aspect-4/3 bg-surface-container-high">
            {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={`${label} of document`}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-on-surface-variant">
                    <ImageOff size={22} />
                    <span className="text-body-sm">No image uploaded</span>
                </div>
            )}
            <span className="absolute bottom-2 left-2 bg-inverse-surface/80 text-inverse-on-surface text-label-sm px-2.5 py-1 rounded-sm">
                {label}
            </span>
        </div>
    );
}

function ReviewDocumentPage({
    documentType,
    imgs,
    notes,
    notesError,
    setNotesError,
    setNotes
}: IdentityDocumentCardProps) {

    const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
        setNotesError(false)
    }
    return (
        <div className="wrapper pt-16 space-y-4">
            <section className="card">
                <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                        <Briefcase size={18} />
                    </span>
                    <h2 className="text-headline-md text-on-surface">
                        Identity Document
                    </h2>
                </div>

                <div className="flex items-center gap-2 mt-5">
                    <span className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                        Type:
                    </span>
                    <span className="bg-surface-container-high text-on-surface text-body-sm px-3 py-1 rounded-full">
                        {documentType}
                    </span>
                </div>

                <div className={`grid grid-cols-${imgs.length} gap-4 mt-4`}>
                    {
                        imgs.map((img, idx) => {
                            return <DocumentThumb key={idx} src={img} label="Front" />
                        })
                    }

                </div>
            </section>
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="notes"
                    className={` text-sm font-medium transition-colors duration-150${notesError ? "text-error" : "text-on-surface"}`}
                >
                    Notes
                    <span className="ml-1 text-on-surface-variant">
                        (optional)
                    </span>
                    {notesError && <span className="ml-2 text-sm text-error font-medium">!</span>}

                </label>

                <div
                    className={` rounded-lg border transition-all duration-200 ${notesError ? ` border-error bg-error-container focus-within:ring-2 focus-within:ring-error/20` : ` border-outline-variant bg-surface-container hover:border-outline focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20`}`}
                >
                    <textarea
                        id="notes"
                        name="notes"
                        value={notes}
                        onChange={handleTextareaChange}
                        placeholder="Tell us why you want to use the site..."
                        aria-invalid={!!notesError}
                        aria-describedby={
                            notesError ? "notes-error" : undefined
                        }
                        className={` min-h-28 w-full resize-none rounded-lg bg-transparent p-3 text-sm text-on-surface placeholder:text-on-surface-variant outline-none transition-colors duration-200`}
                    />
                </div>



                <div className="flex justify-end">
                    <span className="text-xs text-on-surface-variant">
                        {notes.length}/500
                    </span>
                </div>
            </div>
        </div >
    );
}

export default ReviewDocumentPage;
