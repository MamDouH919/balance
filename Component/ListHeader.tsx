import { Typography } from '@mui/material'
import React from 'react'

export const ListHeaderTitle = ({ title }: { title: string }) => {
    return (
        <Typography fontSize={"20px"}>{title}</Typography>
    )
}