import {useParams} from "react-router-dom";
import {ISyllabus} from "../../@types";
import {useEffect, useState} from "react";
import {syllabusesApiService} from "../../services/api";
import SyllabusItemsContainer from "../../components/syllabusItems/SyllabusItemsContainer.tsx";

export default function SyllabusPage() {
    const {id} = useParams();
    const [syllabus, setSyllabus] = useState<ISyllabus | null>(null);
    const syllabusId = parseFloat(id as string)

    useEffect(() => {
        if (!syllabus) {
            syllabusesApiService.getById(syllabusId).then((syllabus) => {
                setSyllabus(syllabus);
            });
        }
    })

    if (!syllabus) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{syllabus.name}</h1>
            <SyllabusItemsContainer syllabus={syllabus} />
        </div>
    )
}
