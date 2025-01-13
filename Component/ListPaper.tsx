import { Paper, Stack, Typography } from "@mui/material"

const ListPaper = ({
    children,
    loading,
    data,
    height,
    minHeight
}: {
    children: React.ReactNode,
    loading?: boolean
    data?: boolean
    restFilter?: string
    height?: string
    minHeight?: string
}) => {
    return (
        <Paper
            sx={{
                width: '100%',
                display: "grid",
                height: height ?? "calc(100% - (16px + 38px + 16px))",
                gridTemplateRows: !data ? "1fr" : "1fr auto",
                ...(minHeight && { minHeight: minHeight })
            }}>
            {loading ? children :
                data ? children :
                    <Stack justifyContent={"center"} alignItems={"center"} spacing={2}>
                        <Typography textTransform={"capitalize"}>{"emptyData"}</Typography>
                        {/* {restFilter && <ButtonLink href={restFilter} linkLabel="reset List" />} */}
                    </Stack>
            }
        </Paper>
    )
}

export default ListPaper