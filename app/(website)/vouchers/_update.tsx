import CustomDialog from '@/Component/CustomDialog'
import LoadingButton from '@mui/lab/LoadingButton'
import { Alert, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

const UpdateDialog = ({
    open,
    handleClose,
    dataById
}: {
    open: boolean,
    handleClose: (value: any) => void,
    dataById: any
}) => {
    const session = useSession();
    const [loading, setLoading] = useState(false)

    const update = async () => {
        setLoading(true)
        const data = {
            status: "approved",
            id: dataById._id,
            userId: session.data?.user.userId,
            reason: ""
        }
        await axios.post(`/api/vouchers/update`, data).catch(() => {
            setLoading(false)
        }).then(() => {
            setLoading(false)
            handleClose(true)
        })
    }
    const deleteVoucher = async () => {
        const data = {
            id: dataById._id,
            userId: session.data?.user.userId,
        }
        await axios.post(`/api/vouchers/delete`, data).catch(() => {
            setLoading(false)
        }).then(() => {
            setLoading(false)
            handleClose(true)
        })
    }

    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            title={
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography fontSize={19}>{"حذف المدخل"}</Typography>
                </Stack>
            }
            content={
                <Stack spacing={2}>
                    <Alert severity={"error"} sx={{ mb: 2 }}>
                        {"هذا الحذف لا يمكن التراجع عنه ولا يمكن استعادته مرة أخرى"}
                    </Alert>
                    <Typography variant={"body2"} sx={{ mb: 2 }}>
                        {dataById.reason}
                    </Typography>
                    <Stack direction={"row"} spacing={2}>
                        <LoadingButton
                            fullWidth
                            variant='contained'
                            color='success'
                            onClick={deleteVoucher}
                            loading={loading}
                        >
                            تأكيد الحذف
                        </LoadingButton>
                        <LoadingButton
                            fullWidth
                            variant='contained'
                            color='error'
                            onClick={update}
                            loading={loading}
                        >
                            إلغاء الحذف
                        </LoadingButton>
                    </Stack>
                </Stack>
            }
        />
    )
}

export default UpdateDialog