import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button, Grid, Tooltip,

} from "@mui/material";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {fetchActions} from "../../store/actions/action.ts";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";

export interface SelectActionDialogProps {
    open: boolean
    onClose: () => void
    onActionSelected: (actionId: number) => void
    onQuitAction: () => void
}

export default function SelectActionDialog({open, onQuitAction, onClose, onActionSelected}: SelectActionDialogProps) {
    const dispatch = useAppDispatch();
    const {fetchInProgress, actions, page, pageSize} = useSelector((state: RootState) => state.actions)
    const {actionId: currentActionId} = useSelector((state: RootState) => state.currentAction)

    const {
        t
    } = useTranslation()

    useEffect(() => {
        if (!actions && !fetchInProgress) {
            dispatch(fetchActions({
                page,
                pageSize,
            }));
        }
    });

    return (
        <Dialog open={open}>
            <DialogTitle
                sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
            }}
            >
                {t("SELECT_ACTION")}
            </DialogTitle>
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">{t("ID")}</TableCell>
                                <TableCell align="right">{t("DATE")}</TableCell>
                                <TableCell align="right">{t("WEEKDAY")}</TableCell>
                                <TableCell align="right">{t("IS_CLOSED")}</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {actions?.map((action) => (
                                <TableRow
                                    key={action.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell align="right">{action.id}</TableCell>
                                    <TableCell align="right">{action.date.split("T")[0]}</TableCell>
                                    <TableCell
                                        align="right">{t(moment(action.date).format("dddd").toUpperCase())}</TableCell>
                                    <TableCell align="right">{action.closed_at ? t("YES") : t("NO")}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant={currentActionId === action.id ? "contained" : "outlined"}
                                            onClick={() => {
                                                if (currentActionId !== action.id && !confirm(`${t("CONFIRM_ACTION_CHANGE")}: ${action.date.split("T")[0]}`)) {
                                                    return;
                                                }

                                                onActionSelected(action.id)
                                                onClose()
                                            }}
                                        >
                                            {t("SELECT")}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid
                    container
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <Grid item xs={2}/>
                    <Grid item xs={2}>
                        <Tooltip title={t("GO_TO_PREVIOUS_PAGE")}>
                            <IconButton
                                disabled={page === 1}
                                onClick={() => {
                                    dispatch(fetchActions({
                                        page: page - 1,
                                        pageSize,
                                    }));
                                }}
                            >
                                <ArrowForwardIcon/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            {`${t("PAGE")} ${page}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Tooltip title={t("GO_TO_NEXT_PAGE")}>
                            <IconButton
                                disabled={actions?.length !== pageSize}
                                onClick={() => {
                                    dispatch(fetchActions({
                                        page: page + 1,
                                        pageSize,
                                    }));
                                }}
                            >
                                <ArrowBackIcon/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={2}/>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {t("CANCEL")}
                </Button>
                <Button onClick={onQuitAction}>
                    {t("SELECT_TODAYS_ACTION")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
