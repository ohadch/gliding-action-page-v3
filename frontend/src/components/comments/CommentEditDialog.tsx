import {useTranslation} from "react-i18next";
import {useState} from "react";
import {Button, Dialog, DialogTitle, DialogContent, DialogActions, TextareaAutosize} from "@mui/material";

export interface CommentEditDialogProps {
    initialText: string | null;
    open: boolean;
    onCancel: () => void;
    onSave: (text: string) => void;
}

export default function CommentEditDialog(props: CommentEditDialogProps) {
    const {t} = useTranslation();
    const {initialText, open} = props;
    const [text, setText] = useState(initialText);

    return (
        <Dialog open={open}>
            <DialogTitle>{t("EDIT_COMMENT")}</DialogTitle>
            <DialogContent>
                <TextareaAutosize
                    style={{width: "400px"}}
                    minRows={12}
                    placeholder={t("CONTENT")}
                    defaultValue={initialText || ""}
                    onChange={(e) => setText(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel}>{t("CANCEL")}</Button>
                <Button onClick={() => text && props.onSave(text)}>{t("SAVE")}</Button>
            </DialogActions>
        </Dialog>
    );

}
