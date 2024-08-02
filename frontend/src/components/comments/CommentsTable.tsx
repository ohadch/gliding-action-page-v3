import { CommentSchema } from "../../lib/types";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {useTranslation} from "react-i18next";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import {useCallback} from "react";
import {useSelector} from "react-redux";
import {getMemberDisplayValue} from "../../utils/display.ts";
import {RootState} from "../../store";

export interface CommentsTableProps {
    comments: CommentSchema[];
    onCommentCreate: (comment: CommentSchema) => void;
    onCommentUpdate: (comment: CommentSchema) => void;
    onCommentDelete: (commentId: number) => void;
}

export default function CommentsTable(props: CommentsTableProps) {
    const {t} = useTranslation();
    const {comments} = props;
    const membersStoreState = useSelector((state: RootState) => state.members)

    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);
    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(
            member,
        ) : "";
    }

    return (
        <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">{t("ID")}</TableCell>
                            <TableCell align="right">{t("AUTHOR")}</TableCell>
                            <TableCell align="right">{t("CONTENT")}</TableCell>
                            <TableCell align="right">{t("CREATED_AT")}</TableCell>
                            <TableCell align="right">{t("UPDATED_AT")}</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {comments.map((comment) => (
                            <TableRow key={comment.id}>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right">{comment.id}</TableCell>
                                <TableCell align="right">
                                    {displayMember(comment.author_id)}
                                </TableCell>
                                <TableCell align="right">{comment.text}</TableCell>
                                <TableCell align="right">{comment.created_at}</TableCell>
                                <TableCell align="right">{comment.updated_at}</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
        </TableContainer>
    );

}
