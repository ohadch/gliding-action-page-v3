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
import {getMemberDisplayValue} from "../../utils/display";
import {RootState, useAppDispatch} from "../../store";
import CommentEditDialog from "./CommentEditDialog";
import {Button, Grid, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import {createComment, updateComment, deleteComment} from "../../store/comments";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export interface CommentsTableProps {
    comments: CommentSchema[];
    flightId?: number;
}

export default function CommentsTable(props: CommentsTableProps) {
    const {t} = useTranslation();
    const {comments, flightId} = props;
    const dispatch = useAppDispatch();

    const membersState = useSelector((state: RootState) => state.members);
    const action = useSelector((state: RootState) => 
        state.actionDays.list.actions?.find(
            (action) => action.id === state.actionDays.currentDay.currentActionId
        )
    );
    const flight = useSelector((state: RootState) => 
        state.actionDays.currentDay.flights?.find((f) => f.id === flightId)
    );

    const [newCommentText, setNewCommentText] = useState<string | null>(null);
    const [editedComment, setEditedComment] = useState<CommentSchema | null>(null);
    const [editCommentDialogOpen, setEditCommentDialogOpen] = useState<boolean>(false);

    const getMemberById = useCallback(
        (id: number) => membersState.members?.find((member) => member.id === id),
        [membersState.members]
    );

    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(member) : "";
    };

    function onEditCommentDialogClose() {
        setEditCommentDialogOpen(false);
        setEditedComment(null);
        setNewCommentText(null);
    }

    function onEditedCommentSave(text: string) {
        if (!action?.field_responsible_id || !action.id) {
            return;
        }

        if (editedComment) {
            dispatch(updateComment({
                commentId: editedComment.id,
                updatePayload: {text}
            }));
        } else {
            dispatch(createComment({
                text,
                action_id: action.id,
                author_id: action.field_responsible_id,
                flight_id: flight?.id,
            }));
        }

        onEditCommentDialogClose();
    }

    function onCommentDelete(commentId: number) {
        if (!confirm(t("DELETE_COMMENT_CONFIRMATION"))) {
            return;
        }

        if (!action?.id) {
            return;
        }

        dispatch(deleteComment(commentId));
    }

    function renderCommentsTable() {
        if (comments.length === 0) {
            return (
                <p>{t("NO_COMMENTS")}.</p>
            );
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
        );
    }

    return (
        <>
            {editCommentDialogOpen && (
                <CommentEditDialog
                    open={editCommentDialogOpen}
                    initialText={editedComment ? editedComment.text : newCommentText}
                    onCancel={onEditCommentDialogClose}
                    onSave={onEditedCommentSave}
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
                        <Button 
                            variant="contained" 
                            onClick={() => {
                                setNewCommentText("");
                                setEditCommentDialogOpen(true);
                            }}
                        >
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
