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
import {FlightCreateSchema, FlightType, GliderSchema, PayersType,} from "../../lib/types.ts";
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
import {hasRole, isCertifiedForSinglePilotOperation, isCfi, isTowPilot} from "../../utils/members.ts";
import {SUPPORTED_FLIGHT_TYPES} from "../../utils/consts.ts";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";

enum RenderedInputName {
    GLIDER = "GLIDER",
    TOW_AIRPLANE = "TOW_AIRPLANE",
    PILOT_1 = "PILOT_1",
    PILOT_2 = "PILOT_2",
    TOW_PILOT = "TOW_PILOT",
    FLIGHT_TYPE = "FLIGHT_TYPE",
}

export interface FlightCreationWizardDialogProps {
    open: boolean
    onCancel: () => void
    onSubmit: (flight: FlightCreateSchema) => void
    onAdvancedEdit: (flight: FlightCreateSchema) => void
}

export default function FlightCreationWizardDialog({open, onCancel, onSubmit, onAdvancedEdit}: FlightCreationWizardDialogProps) {
    const dispatch = useAppDispatch();
    const membersStoreState = useSelector((state: RootState) => state.members)
    const glidersStoreState = useSelector((state: RootState) => state.gliders)
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)
    const {action} = useSelector((state: RootState) => state.currentAction)

    const {
        t
    } = useTranslation()

    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);
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

    const isMemberOccupied = (memberId: number) => {
        const activePilots = [
            towPilotId,
            pilot1Id,
            pilot2Id,
        ].filter(Boolean) as number[];

        return activePilots.includes(memberId);
    }

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
            } else {
                if (flightType === "ClubGuest") {
                    if (!payersType) {
                        return setPayersType("Guest")
                    }
                } else if (flightType === "MembersGuest") {
                    if (!payersType) {
                        return setPayersType("SecondPilot")
                    }
                } else if (flightType === "Instruction") {
                    if (!payersType) {
                        return setPayersType("FirstPilot")
                    }
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

        if (glider.num_seats === 1) {
            if (!pilot1Id) {
                return RenderedInputName.PILOT_1;
            }
        }
        if (glider.num_seats === 2) {
            if (!flightType) {
                return RenderedInputName.FLIGHT_TYPE;
            }

            if (flightType !== "ClubGuest" && flightType !== "MembersGuest" && !pilot1Id) {
                return RenderedInputName.PILOT_1;
            }

            if (flightType !== "Solo" && !pilot2Id) {
                return RenderedInputName.PILOT_2;
            }
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

        if ((glider.num_seats === 1) || (flightType && flightType === "Solo")) {
            return initialOptions.filter((member) => isCertifiedForSinglePilotOperation(member, membersStoreState.membersRoles || []));
        }

        return initialOptions;
    }

    const getPilot2Options = () => {
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

        if ((glider.num_seats === 1) || (flightType && flightType === "Solo")) {
            return [];
        }

        if (flightType && flightType === "Instruction") {
            return initialOptions.filter((member) => isCfi(member, membersStoreState.membersRoles || []));
        }

        return initialOptions;
    }

    const getTowPilotOptions = () => {
        const initialOptions = membersStoreState.members || [];
        return initialOptions.filter((member) => isTowPilot(member, membersStoreState.membersRoles || []));
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
                                options={getPilot1Options().filter((member) => !isMemberOccupied(member.id))}
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
                                options={getPilot2Options().filter((member) => !isMemberOccupied(member.id))}
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
                                options={getTowPilotOptions().filter((member) => !isMemberOccupied(member.id))}
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
            case RenderedInputName.FLIGHT_TYPE:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="flightType"
                                options={SUPPORTED_FLIGHT_TYPES}
                                value={flightType}
                                onChange={(_, newValue) => setFlightType(newValue)}
                                getOptionLabel={(option) => getFlightTypeDisplayValue(option)}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("FLIGHT_TYPE")}
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
                        <IconButton disabled={true}>
                            <CancelIcon/>
                        </IconButton>
                        <strong>{t("FLIGHT_TYPE")}</strong>: {getFlightTypeDisplayValue(flightType)}
                    </Grid>
                )}
                {gliderId && (
                    <Grid>
                        <IconButton onClick={() => setGliderId(undefined)}>
                            <CancelIcon/>
                        </IconButton>
                        <strong>{t("GLIDER")}</strong>: {displayGlider(gliderId)}
                    </Grid>
                )}
                {pilot1Id && (
                    <Grid>
                        <IconButton onClick={() => setPilot1Id(undefined)}>
                            <CancelIcon/>
                        </IconButton>
                        <strong>{t("PILOT_1")}</strong>: {displayMember(pilot1Id)}
                    </Grid>
                )}
                {pilot2Id && (
                    <Grid>
                        <IconButton onClick={() => setPilot2Id(undefined)}>
                            <CancelIcon/>
                        </IconButton>
                        <strong>{t("PILOT_2")}</strong>: {displayMember(pilot2Id)}
                    </Grid>
                )}
                {towAirplaneId && (
                    <Grid>
                        <IconButton onClick={() => setTowAirplaneId(undefined)}>
                            <CancelIcon/>
                        </IconButton>
                        <strong>{t("TOW_AIRPLANE")}</strong>: {displayTowAirplane(towAirplaneId)}
                    </Grid>
                )}
                {towPilotId && (
                    <Grid>
                        <IconButton onClick={() => setTowPilotId(undefined)}>
                            <CancelIcon/>
                        </IconButton>
                        <strong>{t("TOW_PILOT")}</strong>: {displayMember(towPilotId)}
                    </Grid>
                )}
                {payersType && (
                    <Grid>
                        <IconButton disabled={true}>
                            <CancelIcon/>
                        </IconButton>
                        <strong>{t("PAYERS_TYPE")}</strong>: {getPayersTypeDisplayValue(payersType)}
                    </Grid>
                )}
            </Grid>
        )
    }

    const isSubmitEnabled = () => {
        const conditions: boolean[] = [
            Boolean(gliderId),
            Boolean(flightType),
            Boolean(payersType),
        ]

        if ((flightType !== "MembersGuest") && (flightType !== "ClubGuest")) {
            conditions.push(Boolean(pilot1Id))
        }

        if (flightType === "Instruction") {
            conditions.push(Boolean(pilot2Id))
        }

        return conditions.every(Boolean)
    }

    if (!action) {
        return null;
    }

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Dialog open={open} maxWidth="xl">
            <DialogTitle sx={{
                display: "flex",
                justifyContent: "space-between",
            }}>
                <div>{t("CREATE_FLIGHT")}</div>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                    <Button onClick={onCancel}>
                        {t("CANCEL")}
                    </Button>
                    <Button onClick={onCancel}>
                        {t("CLEAR")}
                    </Button>
                    <Button onClick={() => onAdvancedEdit({
                        action_id: action.id,
                        state: "Draft",
                        flight_type: flightType,
                        glider_id: gliderId,
                        pilot_1_id: pilot1Id,
                        pilot_2_id: pilot2Id,
                        tow_airplane_id: towAirplaneId,
                        tow_pilot_id: towPilotId,
                        payment_receiver_id: null,
                        tow_type: null,
                        payers_type: payersType,
                        payment_method: null,
                    })}>
                        {t("ADVANCED_EDIT")}
                    </Button>
                    <Button
                        disabled={!isSubmitEnabled()}
                        onClick={() => onSubmit({
                            action_id: action.id,
                            state: "Draft",
                            flight_type: flightType,
                            glider_id: gliderId,
                            pilot_1_id: pilot1Id,
                            pilot_2_id: pilot2Id,
                            tow_airplane_id: towAirplaneId,
                            tow_pilot_id: towPilotId,
                            payment_receiver_id: null,
                            tow_type: null,
                            payers_type: payersType,
                            payment_method: null,
                        })}>
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
