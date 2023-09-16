import {Grid} from "@mui/material";
import CreateSyllabusItemDialog from "./CreateSyllabusItemDialog.tsx";
import {useEffect, useState} from "react";
import {ISyllabusItem, ISyllabusItemCreate, ISyllabus} from "../../@types";
import {SyllabusItemsApiService} from "../../services/api/syllabusItemsApi.service.ts";
import SyllabusItemsTable from "./SyllabusItemsTable.tsx";
import EditSyllabusItemDialog from "./EditSyllabusItemDialog.tsx";

export interface SyllabusItemsProps {
    syllabus: ISyllabus;
}

export default function SyllabusItemsContainer({syllabus}: SyllabusItemsProps) {
    const [items, setItems] = useState<ISyllabusItem[] | null>(null);
    const [createSyllabusItemDialogOpen, setCreateSyllabusItemDialogOpen] = useState<boolean>(false);
    const [currentlyEditedSyllabusItem, setCurrentlyEditedSyllabusItem] = useState<ISyllabusItem | null>(null);
    const syllabusItemsApiService = new SyllabusItemsApiService(syllabus.id);

    useEffect(() => {
        if (!items) {
            syllabusItemsApiService.get().then((items) => {
                setItems(items);
            });
        }
    })

    const createSyllabusItem = (data: ISyllabusItemCreate) => {
        syllabusItemsApiService
            .create(data)
            .then((item) => {
                setItems([...(items || []), item]);
            })
            .catch((err) => {
                alert(err);
            })
    }

    const updateSyllabusItem = (data: ISyllabusItem) => {
        syllabusItemsApiService
            .update(data.id, {
                name: data.name,
                syllabus_id: data.syllabus_id,
            })
            .then((item) => {
                setItems((items || []).map((d) => {
                    if (d.id === item.id) {
                        return item;
                    }

                    return d;
                }));
            })
            .catch((err) => {
                alert(err);
            })
    }

    const deleteSyllabusItem = (item: ISyllabusItem) => {
        if (!window.confirm(`Are you sure you want to delete ${syllabus.name}'s '${item.name}' item?`)) {
            return;
        }

        syllabusItemsApiService
            .delete(item.id)
            .then(() => {
                setItems((items || []).filter((d) => d.id !== item.id));
            })
            .catch((err) => {
                alert(err);
            })
    }

    return (
        <>
            <CreateSyllabusItemDialog
                open={createSyllabusItemDialogOpen}
                onClose={() => setCreateSyllabusItemDialogOpen(false)}
                onSyllabusItemCreate={createSyllabusItem}
                syllabus={syllabus}
            />
            {currentlyEditedSyllabusItem && (
                <EditSyllabusItemDialog
                    open={!!currentlyEditedSyllabusItem}
                    onClose={() => setCurrentlyEditedSyllabusItem(null)}
                    syllabusItem={currentlyEditedSyllabusItem}
                    onSyllabusItemUpdate={updateSyllabusItem}
                />
            )}
            <Grid container spacing={2}>
                <SyllabusItemsTable
                    items={items || []}
                    onSyllabusItemCreate={() => setCreateSyllabusItemDialogOpen(true)}
                    onSyllabusItemEdit={(item) => setCurrentlyEditedSyllabusItem(item)}
                    onSyllabusItemDelete={deleteSyllabusItem}
                />
            </Grid>
        </>
    )
}
