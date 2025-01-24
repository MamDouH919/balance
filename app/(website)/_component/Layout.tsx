"use client"
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Stack, Tooltip, Typography } from '@mui/material';
import NavDrawer from './NavDrawer';
import useWidth, { isWidthDown } from '@/Component/helperFunctions/useWidth';
import Footer from './Footer';
import { LogoutOutlined } from '@mui/icons-material';
import LogoutDialog from './LogoutDialog';

const drawerWidth = 200;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean; }>(({ theme, open }) => ({
    flexGrow: 1,
    // padding: theme.spacing(3),
    height: "100dvh",
    // minHeight: "100%",
    overflow: "hidden",
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const FooterStyle = styled('footer', { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean; }>(({ theme }) => ({
    // position: "absolute",
    // bottom: 0,
    minHeight: "50px",
    width: "100%",
    // background: "#000",
    // background: theme.palette.background.paper,
    // overflow: "auto",
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    background: theme.palette.background.paper,
    zIndex: 1201,
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),

}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = React.useState<boolean>(false);

    const handleDrawerOpen = () => {
        // localStorage.setItem("DrawerOpen", `${!open}`)
        setOpen(prev => !prev);
    };

    const [logoutState, setLogoutState] = React.useState<boolean>(false)

    const handleCloseLogoutDialog = () => {
        setLogoutState(false)
    }

    const handleOpenLogoutDialog = () => {
        setLogoutState(true)
    }


    // const handleDrawerClose = () => {
    //     setOpen(false);
    // };

    const screenWidth = useWidth();
    const isScreenSmall = isWidthDown("sm", screenWidth);

    return (
        <Box sx={{ display: 'flex', minHeight: "100dvh", overflow: "hidden" }}>
            {logoutState && <LogoutDialog open={logoutState} handleClose={handleCloseLogoutDialog} />}
            <AppBar position='fixed' open={open}>
                <Toolbar sx={{ py: 1 }}>
                    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
                        <Stack direction={"row"} spacing={1} alignItems={"center"}>
                            <IconButton
                                color="primary"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h1" noWrap fontSize={20} color='primary.main'>
                                د/ محمد لاشين
                            </Typography>
                        </Stack>
                        <Tooltip title={"تسجيل الخروج"}>
                            <IconButton
                                aria-label="profile"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                color="default"
                                onClick={handleOpenLogoutDialog}
                            >
                                <LogoutOutlined />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Toolbar>
            </AppBar>
            <NavDrawer
                open={open}
                DrawerHeader={DrawerHeader}
            />
            <Main open={isScreenSmall ? false : open}>
                <Stack height={"100dvh"}>
                    <DrawerHeader />
                    {/* <BoxStyle>
                        dashboard
                    </BoxStyle> */}
                    <Stack flexGrow={1} overflow={"auto"} p={2} >
                        {children}
                    </Stack>
                    <FooterStyle>
                        <Footer />
                    </FooterStyle>
                </Stack>
            </Main>
        </Box>
    );
}