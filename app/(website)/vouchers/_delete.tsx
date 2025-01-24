import ControlMUITextField from '@/Component/ControlMUItextField'
import CustomDialog from '@/Component/CustomDialog'
import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const DeleteDialog = ({
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
            if (session.data?.user.role === "user") {
                data.status = "pending"
                await axios.post(`/api/vouchers/update`, data)
            } else {
                await axios.post(`/api/vouchers/delete`, data)
            }

            handleClose(true)
        } catch (error: any) {
            if (error.response.data) {
                error.response.data.title && setError("title", { type: "manual", message: error.response.data.title });
            }
            // Handle the error (you can show an error message here)
        } finally {
            setLoading(false) // Set loading state to false after request completion
        }
    }

    useEffect(() => {
        if (dataById) {
            setValue("id", dataById._id)
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
                    <Typography fontSize={19}>{"حذف المدخل"}</Typography>
                </Stack>
            }
            content={
                <Stack py={2} spacing={2}>
                    {session.data?.user.role !== "user" && <Alert severity={"error"} sx={{ mb: 2 }}>
                        {"هذا الحذف لا يمكن التراجع عنه ولا يمكن استعادته مرة أخرى"}
                    </Alert>}
                    {session.data?.user.role === "user" && <Alert severity={"warning"} sx={{ mb: 2 }}>
                        {"سيتم الرجوع للمسؤول قبل الحذف"}
                    </Alert>}
                    {session.data?.user.role === "user" && <ControlMUITextField
                        label={"سبب الحذف"}
                        control={control}
                        name="reason"
                        rows={4}
                        rules={{
                            required: "هذا الحقل مطلوب",
                        }}
                    />}
                </Stack>
            }
            buttonAction={
                <LoadingButton loading={loading} type='submit' variant='contained'>{"حفظ"}</LoadingButton>
            }
        />
    )
}

export default DeleteDialog