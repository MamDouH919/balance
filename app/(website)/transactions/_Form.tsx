import ControlMUITextField from '@/Component/ControlMUItextField'
import CustomDialog from '@/Component/CustomDialog'
import MuiSwitch from '@/Component/MuiSwitch'
import LoadingButton from '@mui/lab/LoadingButton'
import { Stack, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const Form = ({
    open,
    handleClose,
    dataById
}: {
    open: boolean,
    handleClose: (value: any) => void,
    dataById: any
}) => {
    const [loading, setLoading] = React.useState(false)
    const { handleSubmit, control, setError, setValue } = useForm()
    const onSubmit = async (data: any) => {
        setLoading(true) // Set loading state to true when submitting
        try {
            console.log(dataById);

            if (dataById?._id) {
                // Update User
                const response = await axios.post(`/api/updateUser`, data)
                console.log('User updated:', response.data)
            } else {
                // Create User
                const response = await axios.post('/api/users', data)
                console.log('User created:', response.data)
            }
            // Send form data to your backend API
            // await axios.post('/api/users', data)
            // Handle the successful creation of the user
            // Close the dialog or show a success message
            handleClose(true)
        } catch (error: any) {
            if (error.response.data) {
                console.log(error.response.data)
                setError("email", { type: "manual", message: error.response.data.email });
            }
            console.log(error);
            console.log('Error creating user:', error.response.data)
            // Handle the error (you can show an error message here)
        } finally {
            setLoading(false) // Set loading state to false after request completion
        }
    }

    useEffect(() => {
        !dataById && setValue("isActive", true)
        if (dataById) {
            console.log(dataById)
            setValue("id", dataById._id)
            setValue("isActive", !!dataById.isActive)
            setValue("name", dataById.name)
            setValue("email", dataById.email)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataById])
    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: handleSubmit(onSubmit),
                noValidate: true
            }}
            title={
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography fontSize={19}>{"مستخدم جديد"}</Typography>
                    <MuiSwitch
                        edge="end"
                        name="isActive"
                        label={"فعال"}
                        control={control}
                    />
                </Stack>
            }
            content={
                <Stack py={2} spacing={2}>
                    <ControlMUITextField
                        label={"الاسم"}
                        control={control}
                        name="name"
                        rules={{
                            required: "هذا الحقل مطلوب",
                        }}
                    />
                    <ControlMUITextField
                        label={"البريد الإلكتروني"}
                        control={control}
                        name="email"
                        rules={{
                            required: "هذا الحقل مطلوب",
                        }}
                    />
                    <ControlMUITextField
                        label={"كلمة المرور"}
                        control={control}
                        name="password"
                        rules={{
                            required: dataById ? false : "هذا الحقل مطلوب",
                        }}
                    />
                </Stack>
            }
            buttonAction={
                <LoadingButton loading={loading} type='submit' variant='contained'>{"حفظ"}</LoadingButton>
            }
        />
    )
}

export default Form