"use client"
import CustomDialog from '@/component/ui/customDialog'
import { Box, Button, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import LoadingButton from '@mui/lab/LoadingButton'

const DeleteItem = ({ children, id, deleteFun }: { children: React.ReactNode, id: string, deleteFun: (id: string) => Promise<void> }) => {
    const [openDialog, setOpenDialog] = useState(false)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const closeDialog = () => {
        setOpenDialog(false)
    }

    const openDialogFun = () => {
        setOpenDialog(true)
    }

    const deleteHighlightsFun = async (id: string) => {
        setLoading(true)
        await deleteFun(id).then(() => {
            setLoading(false)
            router.refresh()
            closeDialog()
        }).catch(() => {
            setError("errorInDelete")
        })
    }

    const { t } = useTranslation(['dashboard'])

    return (
        <>
            <CustomDialog
                open={openDialog}
                handleClose={closeDialog}
                title={t("delete")}
                content={
                    <Box p={2}>
                        <Typography>{t("deleteMSG")}</Typography>
                        <Typography>{t(error)}</Typography>
                    </Box>
                }
                actions={
                    <Stack justifyContent={"flex-end"} direction={"row"} spacing={1}>
                        <LoadingButton loading={loading} variant='contained' color='error' onClick={() => deleteHighlightsFun(id)}>{t("delete")}</LoadingButton>
                        <Button variant='contained' color='inherit' onClick={closeDialog} disabled={loading}>{t("cancel")}</Button>
                    </Stack>
                }
            />
            <div style={{ width: "100%" }} onClick={openDialogFun}>
                {children}
            </div>
        </>
    )
}

export default DeleteItem
