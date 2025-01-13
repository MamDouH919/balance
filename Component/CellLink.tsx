import Link from 'next/link'
import { styled } from "@mui/material/styles";
import { FixedTableCell } from './FixedTableCell';

const Root = styled("div")(({ theme }) => ({
    // background: theme.palette.background.default,
    "a": {
        textDecoration: "none",
        color: theme.palette.primary.main,
        opacity: 1,
        [`&:hover`]: {
            textDecoration: "underline",
        },
    }
}));


export const CellLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    return (
        <FixedTableCell>
            <Root>
                <Link href={href}>
                    {children}
                </Link>
            </Root>
        </FixedTableCell>
    )
}