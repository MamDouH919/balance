import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { styled } from "@mui/material/styles";
import React, { Fragment, memo } from "react";
import { Collapse } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    DashboardOutlined,
    HouseOutlined,
    RecentActorsOutlined,
} from '@mui/icons-material';

import clsx from "clsx";

const PREFIX = "NavDrawer";

const classes = {
    link: `${PREFIX}-link`,
    listIcon: `${PREFIX}-listIcon`,
    listItem: `${PREFIX}-listItem`,
    list: `${PREFIX}-list`,
    ListItemText: `${PREFIX}-ListItemText`,
    ListItemTextChild: `${PREFIX}-ListItemTextChild`,
    ListItemTextActive: `${PREFIX}-ListItemTextActive`,
};

const drawerWidth = 180;

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled(Drawer)(({ theme }) => ({
    [`& .${classes.link}`]: {
        textDecoration: "none",
        fontSize: "0.9rem",
    },
    [`& .${classes.listIcon}`]: {
        minWidth: "25px",
    },
    [`& .${classes.listItem}`]: {
        padding: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
        [`&:hover`]: {
            borderRadius: theme.spacing(1)
        },
    },

    [`& .${classes.ListItemText}`]: {
        margin: 0,
        textTransform: "capitalize",
        color: theme.palette.text.primary
    },
    [`& .${classes.ListItemTextActive}`]: {
        color: theme.palette.primary.main
    },

    [`& .${classes.ListItemTextChild}`]: {
        color: "grey"
    },

    [`& .${classes.list}`]: {
        padding: theme.spacing(2)
    },

}));

interface propsInput {
    open: boolean,
    DrawerHeader: any,
}

interface LinksListChildren {
    pathname: string,
    icon: any,
    primary: string,
}
interface LinksList {
    pathname: string,
    icon: any,
    primary: string,
    regex: RegExp,
    sectionName?: string,
    children?: LinksListChildren[],
}

const NavDrawer = (props: propsInput) => {
    const { open, DrawerHeader } = props;
    const pathname = usePathname()

    const linksList: LinksList[] = [
        {
            pathname: "/users",
            icon: DashboardOutlined,
            primary: "المستخدمين",
            regex: /users/,
        },
        {
            regex: /transactions/,
            pathname: "/transactions",
            sectionName: "transactions",
            icon: HouseOutlined,
            primary: "المعاملات",
        },
        {
            pathname: "/admin/contacts",
            sectionName: "contacts",
            icon: RecentActorsOutlined,
            primary: "contacts",
            regex: /contacts/,
        },
    ];

    return (
        <Root
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader />
            <Divider />
            <List className={classes.list}>
                {linksList.map((link, index) => {
                    if (!link.children) {
                        return <Link href={link.pathname} key={index} className={classes.link}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    className={classes.listItem}>
                                    <ListItemIcon
                                        className={clsx(classes.listIcon, { [classes.ListItemTextActive]: link.regex.test(pathname) })}
                                    >
                                        {<link.icon fontSize={"small"} />}
                                    </ListItemIcon>
                                    <ListItemText
                                        className={clsx(classes.ListItemText, { [classes.ListItemTextActive]: link.regex.test(pathname) })}
                                        disableTypography={true}
                                        primary={link.primary}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    } else {
                        return <Fragment key={index}>
                            <Link href={link.pathname} className={classes.link}>
                                <ListItemButton
                                    className={classes.listItem}>
                                    <ListItemIcon className={classes.listIcon}>
                                        {<link.icon fontSize={"small"} />}
                                    </ListItemIcon>
                                    <ListItemText
                                        className={classes.ListItemText}
                                        disableTypography={true}
                                        primary={link.primary}
                                    />
                                </ListItemButton>
                            </Link>
                            <Collapse
                                key={index}
                                in={link.regex.test(pathname) ?? false}
                                timeout="auto"
                                unmountOnExit
                            >
                                {link?.children?.map((child, i) => {
                                    return (
                                        <Link
                                            href={child.pathname}
                                            key={i}
                                            className={classes.link}
                                        >
                                            <ListItem
                                                className={classes.listItem}
                                            >
                                                <ListItemIcon className={classes.listIcon}>
                                                </ListItemIcon>
                                                <ListItemText
                                                    className={`${classes.ListItemText} ${classes.ListItemTextChild}`}
                                                    disableTypography={true}
                                                    primary={child.primary}
                                                />
                                            </ListItem>
                                        </Link>

                                    );
                                })}
                            </Collapse>
                        </Fragment>
                    }
                })}
            </List>
        </Root>
    );
};

export default memo(NavDrawer);
