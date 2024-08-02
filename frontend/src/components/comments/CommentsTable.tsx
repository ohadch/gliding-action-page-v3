import {CommentSchema} from "../../lib/types";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {useTranslation} from "react-i18next";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import {useCallback, useState} from "react";
import {useSelector} from "react-redux";
import {getMemberDisplayValue} from "../../utils/display.ts";
import {RootState, useAppDispatch} from "../../store";
import CommentEditDialog from "./CommentEditDialog.tsx";
import {Button, Grid, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import {fetchComments} from "../../store/actions/currentAction.ts";
import {createComment, deleteComment, updateComment} from "../../store/actions/comment.ts";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export interface CommentsTableProps {
    comments: CommentSchema[];
    flightId?: number;
}

export default function CommentsTable(props: CommentsTableProps) {
    const {t} = useTranslation();
    const {comments, flightId} = props;
    const membersStoreState = useSelector((state: RootState) => state.members)
    const [newCommentText, setNewCommentText] = useState<string | null>(null);
    const [editedComment, setEditedComment] = useState<CommentSchema | null>(null);
    const [editCommentDialogOpen, setEditCommentDialogOpen] = useState<boolean>(false);
    const currentActionStoreState = useSelector((state: RootState) => state.currentAction);
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))
    const fieldResponsibleId = action?.field_responsible_id;
    const dispatch = useAppDispatch();
    const flight = useSelector((state: RootState) => state.currentAction.flights?.find((flight) => flight.id === flightId));

    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);
    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(
            member,
        ) : "";
    }

    function onEditCommentDialogClose() {
        setEditCommentDialogOpen(false);
        setEditedComment(null);
        setNewCommentText(null);
    }

    function onEditedCommentSave(text: string) {
        if (!fieldResponsibleId || !currentActionStoreState.actionId) {
            return;
        }

        if (editedComment) {
            dispatch(
                updateComment({
                    commentId: editedComment.id,
                    updatePayload: {
                        text,
                    }
                })
            )
        } else {
            dispatch(
                createComment({
                    text,
                    action_id: currentActionStoreState.actionId,
                    author_id: fieldResponsibleId,
                    flight_id: flight?.id,
                })
            )
        }

        dispatch(
            fetchComments(
                {
                    actionId: currentActionStoreState.actionId,
                }
            )
        )

        onEditCommentDialogClose()
    }

    function onCommentDelete(commentId: number) {
        if (!confirm(t("DELETE_COMMENT_CONFIRMATION"))) {
            return;
        }

        if (!currentActionStoreState.actionId) {
            return;
        }

        dispatch(
            deleteComment(commentId)
        )

        dispatch(
            fetchComments(
                {
                    actionId: currentActionStoreState.actionId,
                }
            )
        )
    }

    function renderCommentsTable() {

        if (comments.length === 0) {
            return (
                <p>
                    {t("NO_COMMENTS")}.
                </p>
            )
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
                                <TableCell align="right">{comment.updated_at}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title={t("DELETE_COMMENT")} onClick={() => onCommentDelete(comment.id)}>
                                            <IconButton aria-label="delete">
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    return (
        <>
            {editCommentDialogOpen && (
                <CommentEditDialog
                    open={editCommentDialogOpen}
                    initialText={editedComment ? editedComment.text : newCommentText}
                    onCancel={() => {
                        onEditCommentDialogClose();
                    }}
                    onSave={(text) => {
                        onEditedCommentSave(text);
                    }}

                />
            )}
            <Grid>
                <Grid sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}>
                    <Grid>
                        <Typography variant="h5">
                            {t("COMMENTS")}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Button variant="contained" onClick={() => {
                            setNewCommentText("");
                            setEditCommentDialogOpen(true);
                        }}>
                            {t("ADD_COMMENT")}
                        </Button>
                    </Grid>
                </Grid>
                <Grid>
                    {renderCommentsTable()}
                </Grid>

            </Grid>
        </>
    );

}
