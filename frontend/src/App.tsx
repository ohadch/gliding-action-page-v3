import * as React from 'react';
import {styled, createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronLeft';
import List from '@mui/material/List';
import {
    Alert,
    AlertTitle,
    Button,
    Card,
    Grid,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    CircularProgress
} from "@mui/material";
import {Route, Routes, useLocation} from "react-router-dom";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import i18n from "i18next";
import {initReactI18next, useTranslation} from "react-i18next";
import SelectActionDialog from "./components/actions/SelectActionDialog";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "./store";
import {TEXTS} from "./utils/consts";
import {CacheService} from "./utils/cache";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {
    ConnectingAirports,
    Email,
    LegendToggle,
    Settings,
    Dashboard,
    People
} from "@mui/icons-material";
import {useEffect} from "react";
import {
    setActionAsToday,
    setCurrentActionId,
    fetchActiveTowAirplanes,
    fetchFlights,
    fetchEvents,
    fetchComments,
    fetchNotifications,
    fetchGliders,
    fetchTowAirplanes
} from "./store";

const DRAWER_WIDTH = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginRight: DRAWER_WIDTH,
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: DRAWER_WIDTH,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    }
})

i18n
    .use(initReactI18next)
    .init({
        resources: {
            he: {
                translation: TEXTS
            }
        },
        lng: "he",
        fallbackLng: "he",
        interpolation: {
            escapeValue: false
        }
    });

export default function App() {
    const dispatch = useAppDispatch();
    const [drawerOpen, setDrawerDrawerOpen] = React.useState(false);
    const [theme, setTheme] = React.useState(CacheService.get("CACHE_KEY_THEME") === "dark" ? darkTheme : lightTheme);
    const action = useSelector((state: RootState) =>
        state.actionDays.list.actions?.find((action) => action.id === state.actionDays.currentDay.currentActionId)
    );
    const reviewMode = useSelector((state: RootState) => state.actionDays.currentDay.reviewMode);
    const [selectActionDialogOpen, setSelectActionDialogOpen] = React.useState(false);
    const {t} = useTranslation()
    const {pathname} = useLocation();

    document.body.dir = i18n.dir();

    // If review mode, surround the app with the reviewModeStyle which is an orange border
    const reviewModeStyle = reviewMode ? {
        border: "10px solid orange",
    } : {};

    // Fetch initial data only once when app loads
    useEffect(() => {
        dispatch(fetchGliders());
        dispatch(fetchTowAirplanes());
    }, []); // Empty dependency array means run once on mount

    // Set today's action if needed
    useEffect(() => {
        if (!reviewMode && !action) {
            dispatch(
                setActionAsToday({
                    date: new Date().toISOString().split("T")[0]
                })
            )
        }
    }, [action, dispatch, reviewMode]);

    const toggleDrawer = () => {
        setDrawerDrawerOpen(!drawerOpen);
    };

    const ROUTES = [
        {
            name: t("DASHBOARD"),
            path: "/",
            icon: <ConnectingAirports/>,
            element: React.lazy(() => import('./pages/dashboard/DashboardPage')),
        },
        {
            name: t("FLIGHTS_BOARD"),
            path: "/flights-board",
            icon: <Dashboard/>,
            element: React.lazy(() => import('./pages/flights-board/FlightsBoardPage.tsx')),
        },
        {
            name: t("EVENTS"),
            path: "/events",
            icon: <LegendToggle/>,
            element: React.lazy(() => import('./pages/events/EventsPage.tsx')),
        },
        {
            name: t("NOTIFICATIONS"),
            path: "/notifications",
            icon: <Email/>,
            element: React.lazy(() => import('./pages/notifications/NotificationsPage.tsx')),
        },
        {
            name: t("SETTINGS"),
            path: "/settings",
            icon: <Settings/>,
            element: React.lazy(() => import('./pages/settings/SettingsPage.tsx')),
        },
        {
            name: t("MEMBERS"),
            path: "/members",
            icon: <People />,
            element: React.lazy(() => import('./pages/members/MembersPage')),
        }
    ]

    function renderActionNotSelectedMessage() {
        return (
            <Typography variant="h4" component="h4">
                <Card>
                    <Alert severity="info" sx={{
                        height: "100%",
                    }}>
                        <AlertTitle>
                            <strong>{t("ACTION_NOT_SELECTED_TITLE")}</strong>
                        </AlertTitle>
                        {t("ACTION_NOT_SELECTED_MESSAGE")}
                        <Button
                            onClick={() => setSelectActionDialogOpen(true)}>
                            {t("SELECT_ACTION")}
                        </Button>
                    </Alert>
                </Card>
            </Typography>
        )
    }

    function renderReviewModeAlertMessage() {
        return (
            <Typography variant="h4" component="h4" mb={2}>
                <Card>
                    <Alert severity="warning" sx={{
                        height: "100%",
                    }}>
                        <AlertTitle>
                            <strong>{t("REVIEW_MODE_TITLE")}</strong>
                        </AlertTitle>
                        {t("REVIEW_MODE_MESSAGE")}
                    </Alert>
                </Card>
            </Typography>
        )
    }

    function renderActionClosedMessage() {
        return (
            <Typography variant="h4" component="h4">
                <Card>
                    <Alert severity="warning" sx={{
                        height: "100%",
                    }}>
                        <AlertTitle>
                            <strong>{t("ACTION_CLOSED_TITLE")}</strong>
                        </AlertTitle>
                        {t("ACTION_CLOSED_MESSAGE")}
                    </Alert>
                </Card>
            </Typography>
        )
    }

    function renderFlightsWithUnsettledPaymentsExistMessage() {
        return (
            <Typography variant="h4" component="h4">
                <Card>
                    <Alert severity="warning" sx={{
                        height: "100%",
                        fontSize: "1.5rem",
                        display: "flex",
                        ".MuiAlert-icon": {
                            marginTop: "0.4rem",
                        }
                    }}>
                        <AlertTitle sx={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                        }}>
                            <strong>{t("FLIGHTS_WITH_UNSETTLED_PAYMENTS_TITLE")}!</strong>
                        </AlertTitle>
                        {t("FLIGHTS_WITH_UNSETTLED_PAYMENTS_MESSAGE")}
                    </Alert>
                </Card>
            </Typography>
        )
    }

    function renderRoutes() {
        if (!action) {
            return renderActionNotSelectedMessage()
        }

        return (
            <Routes>
                {ROUTES.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <React.Suspense fallback={
                                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                                    <CircularProgress />
                                </Box>
                            }>
                                <route.element/>
                            </React.Suspense>
                        }
                    />
                ))}
            </Routes>
        )
    }

    function renderActionSelectionButton() {
        if (!action) {
            return (
                <Button
                    color="inherit"
                    onClick={() => setSelectActionDialogOpen(true)}
                    variant={"outlined"}
                >
                    {t("SELECT_ACTION")}
                </Button>
            )
        }
        return (
            <Button
                color="inherit"
                onClick={() => setSelectActionDialogOpen(true)}
                disabled={!reviewMode}
                sx={{
                    color: "white !important",
                }}
            >
                {t("CURRENT_ACTION")}: {" "}
                {action?.date.split("T")[0]}
            </Button>
        )
    }

    const flightsWithUnsettlePayments = useSelector((state: RootState) => state.actionDays.currentDay.flights?.filter((flight) => {
        // Only ClubGuest flights require payment settlement
        if (flight.flight_type !== "ClubGuest") {
            return false
        }

        return !(flight.paying_member_id || (flight.payment_method && flight.payment_receiver_id))
    })) || []

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <ThemeProvider theme={theme}>
                <SelectActionDialog
                    open={selectActionDialogOpen}
                    onClose={() => setSelectActionDialogOpen(false)}
                    onActionSelected={(actionId) => {
                        dispatch(setCurrentActionId(actionId));
                        dispatch(fetchActiveTowAirplanes(actionId));
                        dispatch(fetchFlights(actionId));
                        dispatch(fetchEvents(actionId));
                        dispatch(fetchNotifications(actionId));
                        dispatch(fetchComments(actionId));
                    }}
                />
                <Box sx={{display: 'flex'}}>
                    <CssBaseline/>
                    <AppBar position="absolute" open={drawerOpen} color={reviewMode ? "warning" : "primary" as any}>
                        <Toolbar
                            sx={{
                                pl: '24px', // keep padding when drawer closed
                            }}
                        >
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={toggleDrawer}
                                sx={{
                                    marginLeft: '36px',
                                    ...(drawerOpen && {display: 'none'}),
                                }}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                sx={{flexGrow: 1}}
                            >
                                {t("APP_NAME")}
                            </Typography>
                            <Tooltip title={t("CLICK_TO_SELECT")}>
                                {renderActionSelectionButton()}
                            </Tooltip>
                        </Toolbar>
                    </AppBar>
                    <Drawer variant="permanent" open={drawerOpen}>
                        <Toolbar
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                px: [1],
                            }}
                        >
                            <IconButton onClick={toggleDrawer}>
                                <ChevronRightIcon/>
                            </IconButton>
                        </Toolbar>
                        <Divider/>
                        <List component="nav">
                            <React.Fragment>
                                {ROUTES
                                    .filter((route) => route.icon)
                                    .map((route) => (
                                        <ListItemButton
                                            key={route.path}
                                            component="a"
                                            href={route.path}
                                            selected={pathname === route.path}
                                        >
                                            <ListItemIcon>
                                                {route.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={route.name}/>
                                        </ListItemButton>
                                    ))}
                                <Divider/>
                                <ListItemButton
                                    onClick={() => {
                                        setTheme(theme.palette.mode === 'light' ? darkTheme : lightTheme)
                                        CacheService.set("CACHE_KEY_THEME", theme.palette.mode === 'light' ? "dark" : "light")
                                    }}>
                                    <ListItemIcon>
                                        <Brightness4Icon/>
                                    </ListItemIcon>
                                    <ListItemText primary={t("TOGGLE_THEME")}/>
                                </ListItemButton>
                            </React.Fragment>
                        </List>
                    </Drawer>
                    <Box
                        component="main"
                        sx={{
                            // Actually the background color is used, I'm not sure why the IDE complains
                            backgroundColor: (theme) =>
                                theme.palette.mode === 'light'
                                    ? theme.palette.grey[100]
                                    : theme.palette.grey[900],
                            flexGrow: 1,
                            height: '100vh',
                            overflow: 'auto',
                        }}
                        style={reviewModeStyle}
                    >
                        <Toolbar/>
                        <Container maxWidth="xl" sx={{mt: 4, mb: 4}}>
                            {reviewMode && renderReviewModeAlertMessage()}

                            {
                                action?.closed_at && (
                                    <Grid mb={2}>
                                        {renderActionClosedMessage()}
                                    </Grid>
                                )
                            }

                            {
                                flightsWithUnsettlePayments.length > 0 && (
                                    <Grid mb={2}>
                                        {renderFlightsWithUnsettledPaymentsExistMessage()}
                                    </Grid>
                                )
                            }

                            {renderRoutes()}
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider>
        </LocalizationProvider>
    );
}
