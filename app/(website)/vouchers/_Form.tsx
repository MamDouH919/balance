import ControlMUITextField from '@/Component/ControlMUItextField'
import CustomDialog from '@/Component/CustomDialog'
import MuiSelect from '@/Component/MuiSelect'
import LoadingButton from '@mui/lab/LoadingButton'
import { Stack, Typography } from '@mui/material'
import axios from 'axios'
import { useSession } from 'next-auth/react'
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
    const session = useSession();
    const [loading, setLoading] = React.useState(false)
    const { handleSubmit, control, setError, setValue } = useForm()
    const onSubmit = async (data: any) => {
        setLoading(true) // Set loading state to true when submitting
        try {
            data.userId = session.data?.user.userId
            const response = await axios.post(`/api/vouchers`, data)
            console.log('User updated:', response.data)
            // Send form data to your backend API
            // await axios.post('/api/users', data)
            // Handle the successful creation of the user
            // Close the dialog or show a success message
            handleClose(true)
        } catch (error: any) {
            if (error.response.data) {
                error.response.data.title && setError("title", { type: "manual", message: error.response.data.title });
                error.response.data.amount && setError("amount", { type: "manual", message: error.response.data.amount });
                error.response.data.description && setError("description", { type: "manual", message: error.response.data.description });
                error.response.data.type && setError("type", { type: "manual", message: error.response.data.type });
                error.response.data.custom && console.log(error.response.data.custom);

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
                </Stack>
            }
            content={
                <Stack py={2} spacing={2}>
                    <MuiSelect
                        name='type'
                        label={"النوع"}
                        control={control}
                        variant='filled'
                        data={
                            [
                                {
                                    value: "income",
                                    key: "سند قبض",
                                },
                                {
                                    value: "expense",
                                    key: "سند دفع",
                                }
                            ]
                        }
                        rules={{
                            required: "هذا الحقل مطلوب",
                        }}
                    />
                    <ControlMUITextField
                        label={"العنوان"}
                        control={control}
                        name="title"
                        rules={{
                            required: "هذا الحقل مطلوب",
                        }}
                    />
                    <ControlMUITextField
                        label={"المبلغ"}
                        control={control}
                        name="amount"
                        rules={{
                            required: "هذا الحقل مطلوب",
                        }}
                    />
                    <ControlMUITextField
                        label={"الوصف"}
                        control={control}
                        name="description"
                        rows={4}
                        rules={{
                            required: "هذا الحقل مطلوب",
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