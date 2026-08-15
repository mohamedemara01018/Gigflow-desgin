import UploadDriversLicensePage from "@/components/features/upload-document-page/Uploaddriverslicense";
import Uploadnationalid from "@/components/features/upload-document-page/Uploadnationalid";
import UploadPassportPage from "@/components/features/upload-document-page/Uploadpassport";
import { DocumentType } from "@/utils/enums.utils";

import React from 'react'


interface IUploadDocumentPage {
    selected: string,
    files: File[],
    setFiles: React.Dispatch<
        React.SetStateAction<File[]>
    >;

}


function UploadDocumentPage({ selected, files, setFiles }: IUploadDocumentPage) {
    return (
        <main className="pt-16">
            <section className="wrapper">
                {selected == DocumentType.NATIONAL_ID && <Uploadnationalid files={files} setFiles={setFiles} />}
                {selected == DocumentType.PASSPORT && <UploadPassportPage files={files} setFiles={setFiles} />}
                {selected == DocumentType.DRIVING_LICENSE && <UploadDriversLicensePage files={files} setFiles={setFiles} />}
            </section>
        </main>
    )
}

export default UploadDocumentPage