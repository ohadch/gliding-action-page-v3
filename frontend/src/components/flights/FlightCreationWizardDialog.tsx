import {
    Autocomplete,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormGroup,
    Grid,
    TextField,
} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {FlightType, GliderSchema, PayersType,} from "../../lib/types.ts";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {fetchMembers, fetchMembersRoles} from "../../store/actions/member.ts";
import {fetchGliderOwners, fetchGliders} from "../../store/actions/glider.ts";
import {fetchTowAirplanes} from "../../store/actions/towAirplane.ts";
import {
    getFlightTypeDisplayValue,
    getGliderDisplayValue,
    getMemberDisplayValue,
    getPayersTypeDisplayValue
} from "../../utils/display.ts";
import {hasRole, isCertifiedForSingleSeatGliders} from "../../utils/members.ts";

enum RenderedInputName {
    GLIDER = "GLIDER",
    TOW_AIRPLANE = "TOW_AIRPLANE",
    PILOT_1 = "PILOT_1",
    PILOT_2 = "PILOT_2",
    TOW_PILOT = "TOW_PILOT",
}

export interface FlightCreationWizardDialogProps {
    open: boolean
    onCancel: () => void
    onSubmit: (flight: FlightCreationWizardDialogSubmitPayload) => void
}

export interface FlightCreationWizardDialogSubmitPayload {
    gliderId?: number | null,
    pilot1Id?: number | null,
    pilot2Id?: number | null,
    towAirplaneId?: number | null,
    towPilotId?: number | null,
    towType?: number | null,
    flightType?: number | null,
    payersType?: number | null,
    paymentMethodId?: number | null,
    payingMemberId?: number | null,
    paymentReceiverId?: number | null,
}

export default function FlightCreationWizardDialog({open, onCancel, onSubmit}: FlightCreationWizardDialogProps) {
    const dispatch = useAppDispatch();
    const membersStoreState = useSelector((state: RootState) => state.members)
    const glidersStoreState = useSelector((state: RootState) => state.gliders)
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)

    const {
        t
    } = useTranslation()


    const getMemberById = (id: number) => membersStoreState.members?.find((member) => member.id === id);

    const getGliderById = useCallback((id: number) => glidersStoreState.gliders?.find((glider) => glider.id === id), [glidersStoreState.gliders]);
    const getGliderOwnersById = useCallback((id: number) => glidersStoreState.ownerships?.filter((ownership) => ownership.glider_id === id) || [], [glidersStoreState.ownerships]);
    const isGliderPrivate = useCallback((id: number) => getGliderOwnersById(id).length > 0, [getGliderOwnersById]);

    const displayGlider = (id: number) => {
        const glider = getGliderById(id);
        return glider ? getGliderDisplayValue(
            glider,
            glidersStoreState.ownerships?.filter((ownership) => ownership.glider_id === id) || [],
            true
        ) : "";
    }

    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(
            member,
            membersStoreState.membersRoles?.filter((role) => role.member_id === member.id) || [],
            true
        ) : "";
    }

    const displayTowAirplane = (id: number) => {
        const towAirplane = getTowAirplaneById(id);
        return towAirplane ? towAirplane.call_sign : "";
    }

    const getTowAirplaneById = (id: number) => towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === id);

    const [gliderId, setGliderId] = useState<number | null | undefined>();
    const [pilot1Id, setPilot1Id] = useState<number | null | undefined>();
    const [pilot2Id, setPilot2Id] = useState<number | null | undefined>();
    const [towAirplaneId, setTowAirplaneId] = useState<number | null | undefined>();
    const [towPilotId, setTowPilotId] = useState<number | null | undefined>();
    const [flightType, setFlightType] = useState<FlightType | null | undefined>();
    const [payersType, setPayersType] = useState<PayersType | null | undefined>()
    // const [paymentMethodId, setPaymentMethodId] = useState<number | null | undefined>();
    // const [payingMemberId, setPayingMemberId] = useState<number | null | undefined>();
    // const [paymentReceiverId, setPaymentReceiverId] = useState<number | null | undefined>();


    useEffect(() => {
        if (!membersStoreState.members && !membersStoreState.fetchInProgress) {
            dispatch(fetchMembers());
            dispatch(fetchMembersRoles());
        }
    });

    useEffect(() => {
        if (!glidersStoreState.gliders && !glidersStoreState.fetchInProgress) {
            dispatch(fetchGliders());
            dispatch(fetchGliderOwners());
        }
    });

    useEffect(() => {
        if (!towAirplanesStoreState.towAirplanes && !towAirplanesStoreState.fetchInProgress) {
            dispatch(fetchTowAirplanes());
        }
    });

    useEffect(() => {
        if (!membersStoreState.membersRoles) {
            return
        }

        if (!gliderId) {
            return
        }

        if (isGliderPrivate(gliderId)) {
            return;
        } else {
            const glider = getGliderById(gliderId);

            if (!glider) {
                return;
            }

            if (glider.num_seats === 1) {
                if (!pilot1Id) {
                    return
                }

                if (!payersType) {
                    return setPayersType("FirstPilot")
                }

                const pilot1 = getMemberById(pilot1Id);

                if (!pilot1) {
                    return
                }

                if (hasRole(pilot1, membersStoreState.membersRoles, "SoloStudent")) {
                    if (!flightType) {
                        return setFlightType("Solo")
                    }
                }

                if (!flightType) {
                    return setFlightType("Members")
                }
            }

        }
    }, [
        pilot1Id,
        gliderId,
        flightType,
        payersType,
        isGliderPrivate,
        getGliderById,
        getMemberById,
        membersStoreState.membersRoles,
    ]);


    const [autocompleteOpen, setAutocompleteOpen] = useState(true);

    function getInputToRender() {
        if (!gliderId) {
            return RenderedInputName.GLIDER;
        }

        const glider = getGliderById(gliderId);

        if (!glider) {
            throw new Error("Glider not found");
        }

        if (!pilot1Id) {
            return RenderedInputName.PILOT_1;
        }

        if ((glider.num_seats === 2) && !pilot2Id) {
            return RenderedInputName.PILOT_2;
        }

        if (!towAirplaneId) {
            return RenderedInputName.TOW_AIRPLANE;
        }

        if (!towPilotId) {
            return RenderedInputName.TOW_PILOT;
        }

        return null;
    }

    const getPilot1Options = () => {
        const initialOptions = membersStoreState.members || [];

        if (!gliderId) {
            return initialOptions;
        }

        const glider = getGliderById(gliderId);

        if (!glider) {
            return initialOptions;
        }

        if (isGliderPrivate(glider.id)) {
            const gliderOwners = getGliderOwnersById(glider.id);
            return initialOptions.filter((member) => gliderOwners.some((ownership) => ownership.member_id === member.id));
        }

        if (glider.num_seats === 1) {
            return initialOptions.filter((member) => isCertifiedForSingleSeatGliders(member, membersStoreState.membersRoles || []));
        }

        return initialOptions;
    }

    function renderInput(inputName: RenderedInputName) {
        switch (inputName) {
            case RenderedInputName.GLIDER:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="glider"
                                options={glidersStoreState.gliders || []}
                                value={gliderId ? getGliderById(gliderId) : null}
                                onChange={(_, newValue) => setGliderId(newValue?.id)}
                                getOptionLabel={(option: GliderSchema) => getGliderDisplayValue(
                                    option,
                                    glidersStoreState.ownerships?.filter((ownership) => ownership.glider_id === option.id) || [],
                                    true
                                )}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("GLIDER")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
                )
            case RenderedInputName.TOW_AIRPLANE:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="towAirplane"
                                options={towAirplanesStoreState.towAirplanes || []}
                                value={towAirplaneId ? getTowAirplaneById(towAirplaneId) : null}
                                onChange={(_, newValue) => setTowAirplaneId(newValue?.id)}
                                getOptionLabel={(option) => option.call_sign}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("TOW_AIRPLANE")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
                )
            case RenderedInputName.PILOT_1:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="pilot1"
                                options={getPilot1Options()}
                                value={pilot1Id ? getMemberById(pilot1Id) : null}
                                onChange={(_, newValue) => setPilot1Id(newValue?.id)}
                                getOptionLabel={(option) => getMemberDisplayValue(
                                    option,
                                    membersStoreState.membersRoles?.filter((role) => role.member_id === option.id) || [],
                                    true
                                )}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("PILOT_1")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
                )
            case RenderedInputName.PILOT_2:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="pilot2"
                                options={membersStoreState.members || []}
                                value={pilot2Id ? getMemberById(pilot2Id) : null}
                                onChange={(_, newValue) => setPilot2Id(newValue?.id)}
                                getOptionLabel={(option) => getMemberDisplayValue(
                                    option,
                                    membersStoreState.membersRoles?.filter((role) => role.member_id === option.id) || [],
                                    true
                                )}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("PILOT_2")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
                )
            case RenderedInputName.TOW_PILOT:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="towPilot"
                                options={membersStoreState.members || []}
                                value={towPilotId ? getMemberById(towPilotId) : null}
                                onChange={(_, newValue) => setTowPilotId(newValue?.id)}
                                getOptionLabel={(option) => getMemberDisplayValue(
                                    option
                                )}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("TOW_PILOT")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
                )
            default:
                return null;
        }
    }

    const renderedInputName = getInputToRender();

    function renderFlightPreview() {
        return (
            <Grid>
                {flightType && (
                    <Grid>
                        <strong>{t("FLIGHT_TYPE")}</strong>: {getFlightTypeDisplayValue(flightType)}
                    </Grid>
                )}
                {gliderId && (
                    <Grid>
                        <strong>{t("GLIDER")}</strong>: {displayGlider(gliderId)}
                    </Grid>
                )}
                {pilot1Id && (
                    <Grid>
                        <strong>{t("PILOT_1")}</strong>: {displayMember(pilot1Id)}
                    </Grid>
                )}
                {pilot2Id && (
                    <Grid>
                        <strong>{t("PILOT_2")}</strong>: {displayMember(pilot2Id)}
                    </Grid>
                )}
                {towAirplaneId && (
                    <Grid>
                        <strong>{t("TOW_AIRPLANE")}</strong>: {displayTowAirplane(towAirplaneId)}
                    </Grid>
                )}
                {towPilotId && (
                    <Grid>
                        <strong>{t("TOW_PILOT")}</strong>: {displayMember(towPilotId)}
                    </Grid>
                )}
                {payersType && (
                    <Grid>
                        <strong>{t("PAYERS_TYPE")}</strong>: {getPayersTypeDisplayValue(payersType)}
                    </Grid>
                )}
            </Grid>
        )
    }

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Dialog open={open} maxWidth="xl">
            <DialogTitle sx={{
                display: "flex",
                justifyContent: "space-between",
            }}>
                <div>{t("CREATE_NEW_FLIGHT")}</div>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                    <Button onClick={onCancel}>
                        {t("CANCEL")}
                    </Button>
                    <Button onClick={() => onSubmit({})}>
                        {t("CONFIRM")}
                    </Button>
                </div>
            </DialogTitle>
            <DialogContent>
                {renderFlightPreview()}
                <Grid sx={{
                    mt: 2,
                    width: 400,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}>
                    {renderedInputName && renderInput(renderedInputName)}
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
