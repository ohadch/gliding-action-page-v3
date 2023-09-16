import SyllabusesTable from "../../components/syllabuses/SyllabusesTable.tsx";
import {ISyllabus, ISyllabusCreate} from "../../@types/models/Syllabus";
import {useEffect, useState} from "react";
import CreateSyllabusDialog from "../../components/syllabuses/CreateSyllabusDialog.tsx";
import EditSyllabusDialog from "../../components/syllabuses/EditSyllabusDialog.tsx";
import {syllabusesApiService} from "../../services/api/syllabusesApi.service.ts";

export default function SyllabusesPage() {
    const [syllabuses, setSyllabuses] = useState<ISyllabus[] | null>(null);
    const [createSyllabusDialogOpen, setCreateSyllabusDialogOpen] = useState<boolean>(false);
    const [currentlyEditedSyllabus, setCurrentlyEditedSyllabus] = useState<ISyllabus | null>(null);

    useEffect(() => {
        if (!syllabuses) {
            syllabusesApiService.get().then((syllabus) => {
                setSyllabuses(syllabus);
            })
        }
    })

    const createSyllabus = (data: ISyllabusCreate) => {
        syllabusesApiService.create(data).then((syllabus) => {
            setSyllabuses([...(syllabuses || []), syllabus]);
        })
    }

    const updateSyllabus = (data: ISyllabus) => {
        syllabusesApiService.update(data.id, {
            name: data.name,
        }).then((syllabus) => {
            setSyllabuses((syllabuses || []).map((d) => {
                if (d.id === syllabus.id) {
                    return syllabus;
                }

                return d;
            }));
        })
    }

    const deleteSyllabus = (data: ISyllabus) => {
        if (!confirm(`Are you sure you want to delete syllabus "${data.name}"?`)) {
            return;
        }

        syllabusesApiService.delete(data.id).then(() => {
            setSyllabuses((syllabuses || []).filter((d) => {
                return d.id !== data.id;
            }));
        })
    }

    return (
        <>
            <CreateSyllabusDialog
                open={createSyllabusDialogOpen}
                onClose={() => setCreateSyllabusDialogOpen(false)}
                onSyllabusCreate={createSyllabus}
            />
            {currentlyEditedSyllabus && (
                <EditSyllabusDialog
                    open={!!currentlyEditedSyllabus}
                    onClose={() => setCurrentlyEditedSyllabus(null)}
                    syllabus={currentlyEditedSyllabus}
                    onSyllabusUpdate={updateSyllabus}
                />
            )}
            <SyllabusesTable
                syllabus={syllabuses || []}
                onSyllabusCreate={() => setCreateSyllabusDialogOpen(true)}
                onSyllabusEdit={(syllabus) => setCurrentlyEditedSyllabus(syllabus)}
                onSyllabusDelete={deleteSyllabus}
            />
        </>
    )
}
