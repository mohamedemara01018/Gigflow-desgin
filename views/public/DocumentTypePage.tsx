import DocumentOption from '@/components/features/public/document-type/DocumentOption'
import SecuritySidebar from '@/components/features/public/document-type/SecuritySidebar'
import { DocumentType } from '@/utils/enums.utils'
import { BookOpen, Car, IdCard } from 'lucide-react'
import { SetStateAction, useEffect } from 'react'



interface DocumentTypePageProbs {
    selected: string,
    setSelected: (selected: string) => void
    setFiles: React.Dispatch<SetStateAction<File[]>>
}

function DocumentTypePage({ selected, setSelected, setFiles }: DocumentTypePageProbs) {
    useEffect(() => {
        setFiles([])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 wrapper mx-auto mt-10">
            <section className="card">
                <div className="flex items-center gap-2 text-on-surface">
                    <IdCard size={22} className="text-primary" />
                    <h2 className="text-headline-md">Select Document Type</h2>
                </div>
                <p className="text-body-md text-on-surface-variant mt-2">
                    Choose a valid, government-issued document to verify your
                    identity.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                    <DocumentOption
                        icon={BookOpen}
                        title="Passport"
                        description="Recommended for global users. Must be unexpired."
                        selected={selected === DocumentType.PASSPORT}
                        onSelect={() => setSelected(DocumentType.PASSPORT)}
                    />
                    <DocumentOption
                        icon={IdCard}
                        title="National ID"
                        description="Government-issued identity card. Front and back required."
                        selected={selected === DocumentType.NATIONAL_ID}
                        onSelect={() => setSelected(DocumentType.NATIONAL_ID)}
                    />
                    <DocumentOption
                        icon={Car}
                        title="Driver's License"
                        description="Valid driver's license from your country of residence."
                        selected={selected === DocumentType.DRIVING_LICENSE}
                        onSelect={() => setSelected(DocumentType.DRIVING_LICENSE)}
                        className="sm:col-span-2"
                    />
                </div>
            </section>
            < SecuritySidebar />
        </div>
    )
}

export default DocumentTypePage