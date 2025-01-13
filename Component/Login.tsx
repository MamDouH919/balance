"use client"
import React, { Fragment, useState } from 'react';
import { Avatar, Button, Container, IconButton, Paper, Stack, Typography } from '@mui/material';
import { styled } from "@mui/material/styles";
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import ControlMUITextField from './ControlMUItextField';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const PREFIX = "Login";

const classes = {
    avatar: `${PREFIX}-avatar`,
    form: `${PREFIX}-form`,
};

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

// async function createUser(dataEntered: any) {
//     const response = await fetch('http://localhost:3000/api/auth/signup', {
//         method: 'POST',
//         body: JSON.stringify({ ...dataEntered }),
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//         throw new Error(data.message || 'Something went wrong!');
//     }

//     return data;
// }

const Login = () => {
    const [passType, setPassType] = useState("password");
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to store the error message
    const { control, handleSubmit, setError } = useForm();

    // async function submitHandler() {
    //     const data = {
    //         name: 'super admin',
    //         email: 'superadmin@admin.com',
    //         password: "Mamdouh123!!!", // This will be hashed
    //         role: 'superAdmin',
    //         active: true,
    //     };

    //     try {
    //         const result = await createUser(data);
    //         console.log(result);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const onSubmit = async (data: any) => {
        console.log('Form Data:', data);

        try {
            // Call NextAuth's signIn function with credentials
            const result = await signIn('credentials', {
                redirect: false, // Prevent automatic redirection
                email: data.email,
                password: data.password,
            });
            console.log(result);


            if (result?.error) {
                // If there's an error, update the error message state
                const errors = JSON.parse(result.error)
                if (errors.email) {
                    setError("email", { type: "manual", message: errors.email });
                }
                if (errors.password) {
                    setError("password", { type: "manual", message: errors.password });
                }
                if (errors.isActive) {
                    setErrorMessage(errors.isActive);
                }
            } else {
                console.log('Signed in successfully:', result);
                
                router.refresh();
                router.replace('/');
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error('Unexpected error:', error);
            setErrorMessage('Unexpected error occurred. Please try again.'); // Display general error
        }
    };

    return (
        <Root alignItems={"center"} justifyContent={"center"}>
            <Container maxWidth="xs">
                <Stack component={Paper} p={2} spacing={2} alignItems={"center"}>
                    <Avatar className={classes.avatar}>
                        <LockOutlined fontSize='large' />
                    </Avatar>
                    <Typography component="h1" variant="h5" color={"text.primary"}>
                        تسجيل الدخول
                    </Typography>

                    <Fragment>
                        <Stack spacing={2} component={"form"} className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                            <ControlMUITextField
                                label={"البريد الإلكتروني"}
                                control={control}
                                name="email"
                                rules={{
                                    required: "هذا الحقل مطلوب",
                                }}
                            />
                            <ControlMUITextField
                                name='password'
                                label={"كلمة المرور"}
                                type={passType}
                                control={control}
                                rules={{
                                    required: "هذا الحقل مطلوب",
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: <IconButton size='small' onClick={() => setPassType(passType === "password" ? "text" : "password")}>
                                            {passType === "password" && <VisibilityOff color='primary' fontSize='inherit' />}
                                            {passType === "text" && <Visibility color='primary' fontSize='inherit' />}
                                        </IconButton>
                                    }
                                }}
                            />
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                تسجيل الدخول
                            </Button>

                            {/* Show error message if there's any */}
                            {errorMessage && (
                                <Typography color="error" variant="body2" align="center" style={{ marginTop: '10px' }}>
                                    {errorMessage}
                                </Typography>
                            )}
                        </Stack>
                    </Fragment>
                </Stack>
            </Container>
        </Root>
    );
};

export default Login;
