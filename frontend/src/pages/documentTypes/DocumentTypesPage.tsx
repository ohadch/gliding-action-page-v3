import DocumentTypesTable from "../../components/documentTypes/DocumentTypesTable.tsx";
import {IDocumentType, IDocumentTypeCreate} from "../../@types";
import {useEffect, useState} from "react";
import CreateDocumentTypeDialog from "../../components/documentTypes/CreateDocumentTypeDialog.tsx";
import EditDocumentTypeDialog from "../../components/documentTypes/EditDocumentTypeDialog.tsx";
import {documentTypesApiService} from "../../services/api/documentTypesApi.service.ts";

export default function DocumentTypesPage() {
    const [documentTypes, setDocumentTypes] = useState<IDocumentType[] | null>(null);
    const [createDocumentTypeDialogOpen, setCreateDocumentTypeDialogOpen] = useState<boolean>(false);
    const [currentlyEditedDocumentType, setCurrentlyEditedDocumentType] = useState<IDocumentType | null>(null);

    useEffect(() => {
        if (!documentTypes) {
            documentTypesApiService.get().then((documentType) => {
                setDocumentTypes(documentType);
            })
        }
    })

    const createDocumentType = (data: IDocumentTypeCreate) => {
        documentTypesApiService.create(data).then((documentType) => {
            setDocumentTypes([...(documentTypes || []), documentType]);
        })
    }

    const updateDocumentType = (data: IDocumentType) => {
        documentTypesApiService.update(data.id, {
            name: data.name,
        }).then((documentType) => {
            setDocumentTypes((documentTypes || []).map((d) => {
                if (d.id === documentType.id) {
                    return documentType;
                }

                return d;
            }));
        })
    }

    const deleteDocumentType = (data: IDocumentType) => {
        if (!confirm(`Are you sure you want to delete documentType "${data.name}"?`)) {
            return;
        }

        documentTypesApiService.delete(data.id).then(() => {
            setDocumentTypes((documentTypes || []).filter((d) => {
                return d.id !== data.id;
            }));
        })
    }

    return (
        <>
            <CreateDocumentTypeDialog
                open={createDocumentTypeDialogOpen}
                onClose={() => setCreateDocumentTypeDialogOpen(false)}
                onDocumentTypeCreate={createDocumentType}
            />
            {currentlyEditedDocumentType && (
                <EditDocumentTypeDialog
                    open={!!currentlyEditedDocumentType}
                    onClose={() => setCurrentlyEditedDocumentType(null)}
                    documentType={currentlyEditedDocumentType}
                    onDocumentTypeUpdate={updateDocumentType}
                />
            )}
            <DocumentTypesTable
                documentType={documentTypes || []}
                onDocumentTypeCreate={() => setCreateDocumentTypeDialogOpen(true)}
                onDocumentTypeEdit={(documentType) => setCurrentlyEditedDocumentType(documentType)}
                onDocumentTypeDelete={deleteDocumentType}
            />
        </>
    )
}
