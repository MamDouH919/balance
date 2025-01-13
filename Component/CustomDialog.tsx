import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Paper, Stack } from '@mui/material';
import { styled } from "@mui/material/styles";

interface propsInput {
    PaperProps?: any;
    handleClose: (value: any) => void;
    open: boolean;
    title?: string | React.ReactNode;
    content?: string | React.ReactNode;
    buttonAction?: string | React.ReactNode;
    hideActions?: boolean
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const DialogContentStyle = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2)
}));
const DialogTitleStyle = styled(DialogTitle)(({ theme }) => ({
    padding: theme.spacing(1,2),
    "& h2":{
        padding: theme.spacing(1)
    }
}));

export default function CustomDialog(props: propsInput) {
    const {
        open,
        handleClose,
        PaperProps,
        title,
        content,
        buttonAction,
        hideActions = false,
        maxWidth = 'xs'
    } = props

    return (
        <React.Fragment>
            <Dialog
                fullWidth
                open={open}
                onClose={handleClose}
                PaperProps={PaperProps}
                maxWidth={maxWidth}
            >
                {title &&
                    <Paper sx={{ background: (theme) => theme.palette.background.default }}>
                        <DialogTitleStyle textTransform={"capitalize"}>
                            {title}
                        </DialogTitleStyle>
                    </Paper>
                }
                {content && <DialogContentStyle>{content}</DialogContentStyle>}
                {!hideActions &&
                    <DialogActions sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                        <Stack direction={"row"} spacing={1}>
                            <Button onClick={handleClose} color='inherit' variant='contained'>
                                {"إلغاء"}
                            </Button>
                            {buttonAction}
                        </Stack>
                    </DialogActions>
                }
            </Dialog>
        </React.Fragment>
    );
}
