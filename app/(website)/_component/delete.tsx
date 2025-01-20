"use client"
import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingButton from '@mui/lab/LoadingButton'
import CustomDialog from '@/Component/CustomDialog'

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


    return (
        <>
            <CustomDialog
                open={openDialog}
                handleClose={closeDialog}
                title={"delete"}
                content={
                    <Box p={2}>
                        <Typography>{"deleteMSG"}</Typography>
                        <Typography>{error}</Typography>
                    </Box>
                }
                buttonAction={
                    <LoadingButton loading={loading} variant='contained' color='error' onClick={() => deleteHighlightsFun(id)}>{"delete"}</LoadingButton>

                }
            />
            <div style={{ width: "100%" }} onClick={openDialogFun}>
                {children}
            </div>
        </>
    )
}

export default DeleteItem
