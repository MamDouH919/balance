import React from 'react'
import { LoadingButton } from '@mui/lab'
import { Stack } from '@mui/material'
import CustomDialog from '@/Component/CustomDialog'
import { signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'

interface PropsType {
    open: boolean
    handleClose: () => void
}

const LogoutDialog = ({
    open,
    handleClose
}: PropsType) => {
    const [loading, setLoading] = React.useState(false)

    const onSubmit = () => {
        setLoading(true)
        signOut().then(() => {
            setLoading(false)
            redirect("/login")
        })
    }

    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            content={
                <Stack py={2}>
                   هل أنت متأكد من تسجيل الخروج ؟
                </Stack>
            }
            buttonAction={
                <LoadingButton loading={loading} type='submit' variant='contained' onClick={onSubmit}>تأكيد</LoadingButton>
            }
        />
    )
}

export default LogoutDialog