import {
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Box,
    IconButton,
    Tooltip,
    Button,
    DialogActions,
} from "@mui/material";
import { useState, KeyboardEvent } from "react";
import { FlightCreateSchema, FlightType, GliderSchema } from "../../lib/types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import CloseIcon from '@mui/icons-material/Close';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { FlightTemplates } from './flightCreation/FlightTemplates';
import { FlightForm } from './flightCreation/FlightForm';
import { FlightPreview } from './flightCreation/FlightPreview';
import { useFlightCreation } from './flightCreation/useFlightCreation';

export interface FlightCreationWizardDialogProps {
    open: boolean;
    onCancel: () => void;
    onSubmit: (flight: FlightCreateSchema) => void;
    onAdvancedEdit: (flight: FlightCreateSchema) => void;
}

export default function FlightCreationWizardDialog({
    open,
    onCancel,
    onSubmit,
    onAdvancedEdit,
}: FlightCreationWizardDialogProps) {
    const { t } = useTranslation();
    const action = useSelector((state: RootState) => 
        state.actionDays.list.actions?.find(
            (action) => action.id === state.actionDays.currentDay.currentActionId
        )
    );

    const {
        gliderId,
        pilot1Id,
        pilot2Id,
        flightType,
        payersType,
        availableGliders,
        handleGliderChange,
        handlePilot1Change,
        handlePilot2Change,
        handleFlightTypeChange,
        handlePayersTypeChange,
        handleTemplateSelect,
        isSubmitEnabled,
        createFlightPayload,
    } = useFlightCreation();

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && isSubmitEnabled()) {
            event.preventDefault();
            onSubmit(createFlightPayload());
        } else if (event.key === 'Enter' && event.shiftKey) {
            event.preventDefault();
            onAdvancedEdit(createFlightPayload());
        } else if (event.key === 'Escape') {
            event.preventDefault();
            onCancel();
        }
    };

    if (!action) {
        return null;
    }

    return (
        <Dialog 
            open={open} 
            maxWidth="lg" 
            fullWidth 
            onKeyDown={handleKeyDown}
        >
            <DialogTitle sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2
            }}>
                <div>{t("CREATE_FLIGHT")}</div>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Tooltip title={t("CANCEL") + " (Esc)"}>
                        <IconButton onClick={onCancel} size="large" color="error">
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t("ADVANCED_EDIT") + " (Shift+Enter)"}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => onAdvancedEdit(createFlightPayload())}
                            endIcon={<KeyboardReturnIcon />}
                        >
                            {t("ADVANCED_EDIT")}
                        </Button>
                    </Tooltip>
                    <Tooltip title={t("CONFIRM") + " (Enter)"}>
                        <span>
                            <Button
                                color="primary"
                                variant="contained"
                                size="large"
                                disabled={!isSubmitEnabled()}
                                onClick={() => onSubmit(createFlightPayload())}
                                endIcon={<KeyboardReturnIcon />}
                            >
                                {t("CONFIRM")}
                            </Button>
                        </span>
                    </Tooltip>
                </Box>
            </DialogTitle>
            <DialogContent>
                <FlightTemplates onTemplateSelect={handleTemplateSelect} />
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <FlightForm
                            gliderId={gliderId}
                            pilot1Id={pilot1Id}
                            pilot2Id={pilot2Id}
                            flightType={flightType}
                            payersType={payersType}
                            availableGliders={availableGliders}
                            onGliderChange={handleGliderChange}
                            onPilot1Change={handlePilot1Change}
                            onPilot2Change={handlePilot2Change}
                            onFlightTypeChange={handleFlightTypeChange}
                            onPayersTypeChange={handlePayersTypeChange}
                        />
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <FlightPreview
                            gliderId={gliderId}
                            pilot1Id={pilot1Id}
                            pilot2Id={pilot2Id}
                            flightType={flightType}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
