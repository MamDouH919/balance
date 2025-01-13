"use client";
import React, { Fragment, useState } from 'react';
// import { useForm } from '@inertiajs/react';
import { Avatar, Button, Container, IconButton, Paper, Stack, Typography } from '@mui/material';
import { styled } from "@mui/material/styles";
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import ControlMUITextField from './ControlMUItextField';
const PREFIX = "Login";
const classes = {
    avatar: `${PREFIX}-avatar`,
    form: `${PREFIX}-form`,
};
// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled(Stack)(({ theme }) => ({
    height: "100%",
    [`& .${classes.avatar}`]: {
        margin: theme.spacing(1),
        width: theme.spacing(6),
        height: theme.spacing(6),
        backgroundColor: theme.palette.primary.main,
    },
    [`& .${classes.form}`]: {
        width: "100%", // Fix IE 11 issue.
    },
}));
const Login = () => {
    const [passType, setPassType] = useState("password");
    const { control, handleSubmit } = useForm();
    // const { data, setData, post, processing, errors } = useForm({
    //     username: '',
    //     password: '',
    // });
    const onSubmit = (data) => {
        console.log(data);
    };
    return (<Root alignItems={"center"} justifyContent={"center"}>
            <Container maxWidth="xs">
                <Stack component={Paper} p={2} spacing={2} alignItems={"center"}>
                    <Avatar className={classes.avatar}>
                        <LockOutlined fontSize='large'/>
                    </Avatar>
                    <Typography component="h1" variant="h5" color={"text.primary"}>
                        تسجيل الدخول
                    </Typography>

                    <Fragment>
                        <Stack spacing={2} component={"form"} className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                            <ControlMUITextField label={"البريد الإلكتروني"} control={control} name="email" rules={{
            required: "هذا الحقل مطلوب",
        }}/>
                            <ControlMUITextField name='password' label={"كلمة المرور"} type={passType} control={control} rules={{
            required: "هذا الحقل مطلوب",
        }} slotProps={{
            input: {
                endAdornment: <IconButton size='small' onClick={() => setPassType(passType === "password" ? "text" : "password")}>
                                            {passType === "password" && <VisibilityOff color='primary' fontSize='inherit'/>}
                                            {passType === "text" && <Visibility color='primary' fontSize='inherit'/>}
                                        </IconButton>
            }
        }}/>
                            <Button fullWidth 
    // className={classes.button}
    size="large" variant="contained" color="primary" type="submit">
                                تسجيل الدخول
                            </Button>

                            {/* <Grid fontSize={16} marginBottom={1}>
            <SpanLink pathname={`/forgot-password`}>
                {t("forgotPassword")}
            </SpanLink>
        </Grid> */}
                        </Stack>
                    </Fragment>
                </Stack>
            </Container>
        </Root>);
};
export default Login;
