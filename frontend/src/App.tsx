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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import List from '@mui/material/List';
import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {Route, Routes, useLocation} from "react-router-dom";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import BadgeIcon from '@mui/icons-material/Badge';
import LanguageIcon from '@mui/icons-material/Language';
import i18n from "i18next";
import {initReactI18next, useTranslation} from "react-i18next";

const DRAWER_WIDTH = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const ROUTES = [
    {
        name: "Dashboard",
        path: "/",
        icon: <BadgeIcon/>,
        element: React.lazy(() => import('./pages/dashboard/DashboardPage.tsx')),
    }
]


const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: DRAWER_WIDTH,
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
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources: {
            en: {
                translation: {
                    APP_NAME: "Gliding Action Management",
                }
            },
            he: {
                translation: {
                    APP_NAME: "ניהול פעולת הדאיה",
                }
            }
        },
        lng: "he", // if you're using a language detector, do not define the lng option
        fallbackLng: "en",

        interpolation: {
            escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        }
    });

export default function App() {
    const [open, setOpen] = React.useState(true);
    const [theme, setTheme] = React.useState(lightTheme);
    const [language, setLanguage] = React.useState("he" as "en" | "he");
    const {t} = useTranslation()

    function changeLanguage (lng: string) {
        const newLanguage = language === "en" ? "he" : "en";
        i18n.changeLanguage(lng, () => setLanguage(newLanguage)).then();
    }

    const {pathname} = useLocation();
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && {display: 'none'}),
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
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon/>
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
                                onClick={() => setTheme(theme.palette.mode === 'light' ? darkTheme : lightTheme)}>
                                <ListItemIcon>
                                    <Brightness4Icon/>
                                </ListItemIcon>
                                <ListItemText primary="Toggle Theme"/>
                            </ListItemButton>
                            <ListItemButton onClick={() => changeLanguage(language === "en" ? "he" : "en")}>
                                <ListItemIcon>
                                    <LanguageIcon/>
                                </ListItemIcon>
                                <ListItemText primary={language === "en" ? "עברית" : "English"}/>
                            </ListItemButton>
                        </React.Fragment>
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar/>
                    <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                        <Routes>
                            {ROUTES.map((route) => (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        <React.Suspense fallback={<div></div>}>
                                            <route.element/>
                                        </React.Suspense>
                                    }
                                />
                            ))}
                        </Routes>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
