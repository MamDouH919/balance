import { Paper, Stack, Typography } from "@mui/material"
import CopyrightIcon from '@mui/icons-material/Copyright';
import { styled } from "@mui/material/styles";

const ImageStyle = styled("img")(() => ({
    width: "100%",
    height: "20px !important"
}));
const Link = styled("a")(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const Footer = () => {
    return (
        <Stack component={Paper} position={"relative"} zIndex={11} height={"100%"} justifyContent={"center"} alignItems={"center"}>
            <Stack gap={1} direction={"row"} justifyContent={"center"} alignItems={"center"} flexWrap={"wrap"}>
                <CopyrightIcon />
                <Typography variant='body1' fontSize={"16px"}>
                    {"2025 مدعوم بواسطة"}
                </Typography>
                <Link href='https://mountain-egy.site/' rel="noopener noreferrer" target="_blank">
                    <ImageStyle src={"/logo.webp"} alt="mountain" width="100%" />
                </Link>
            </Stack>
        </Stack>
    )
}

export default Footer