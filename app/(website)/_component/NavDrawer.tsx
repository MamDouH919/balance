import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { styled } from "@mui/material/styles";
import React, { Fragment, memo, useState } from "react";
import { Collapse } from "@mui/material";
import Link from "next/link";
import {
    DashboardOutlined,
    HouseOutlined,
} from '@mui/icons-material';

import clsx from "clsx";
import { useSession } from "next-auth/react";

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

const drawerWidth = 200;

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

interface LinkItem {
    pathname?: string;
    primary: string;
    icon?: React.ElementType;
    permission?: string;
    action?: () => void;
    children?: LinkItem[];
    sectionName?: string;
}

const NavDrawer = (props: propsInput) => {
    const { open, DrawerHeader } = props;
    const session = useSession();

    const user = session?.data?.user.role !== "user";

    const linksList: LinkItem[] = [
        {
            pathname: "/",
            icon: HouseOutlined,
            primary: "الصفحة الرئيسية",

        },
        ...(user ? [{
            pathname: "/users",
            icon: DashboardOutlined,
            primary: "المستخدمين",
        }] : []),
        {
            pathname: "/vouchers",
            icon: HouseOutlined,
            primary: "الحسابات",

        },
    ];

    const [nestedList, setNestedList] = useState<Record<string, boolean>>({});

    const toggleNestedList = (key: string) => {
        setNestedList((prev) => ({ ...prev, [key]: !prev[key] }));
    };

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
                        return <Link href={link.pathname!} key={index} className={classes.link}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    className={classes.listItem}>
                                    <ListItemIcon
                                        className={clsx(classes.listIcon)}
                                    >
                                        {link.icon && <link.icon fontSize={"small"} />}
                                    </ListItemIcon>
                                    <ListItemText
                                        className={clsx(classes.ListItemText)}
                                        disableTypography={true}
                                        primary={link.primary}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    } else {
                        return <Fragment key={index}>
                            <ListItemButton
                                onClick={() => toggleNestedList(link.sectionName || "")}
                                className={clsx(classes.listItem, classes.link)}>
                                <ListItemIcon className={classes.listIcon}>
                                    {link.icon && <link.icon fontSize={"small"} />}
                                </ListItemIcon>
                                <ListItemText
                                    className={classes.ListItemText}
                                    disableTypography={true}
                                    primary={link.primary}
                                />
                            </ListItemButton>
                            <Collapse
                                in={nestedList[link.sectionName || ""]}
                                key={index}
                                timeout="auto"
                                unmountOnExit
                            >
                                {link?.children?.map((child, i) => {
                                    return (
                                        <Link
                                            href={child.pathname!}
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
