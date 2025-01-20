import React, { memo, ReactNode } from "react";
import { styled } from '@mui/material/styles';
import { TableCell, TableCellProps } from "@mui/material";

const PREFIX = 'FixedTableCell';

const classes = {
    cellWidth: `${PREFIX}-cellWidth`,
    cellWidthAuto: `${PREFIX}-cellWidthAuto`
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1),
    [`& .${classes.cellWidth}`]: {
        whiteSpace: "normal",
        maxWidth: "200px",
        inlineSize: "max-content",
    },
    [`& .${classes.cellWidthAuto}`]: {
        whiteSpace: "normal",
        maxWidth: "auto",
        inlineSize: "max-content",
    }
}));

interface FixedTableCellProps extends TableCellProps {
    allowPlaceholder?: boolean;
    dir?: "ltr" | "rtl";
    children?: ReactNode;
    auto?: boolean;
}

export const FixedTableCell = memo(function FixedTableCell(props: FixedTableCellProps) {
    const { allowPlaceholder = true, dir, auto, ...restProps } = props;
    return (
        <StyledTableCell {...restProps}>
            <div className={auto ? classes.cellWidthAuto : classes.cellWidth} dir={dir}>
                {props.children ?? (allowPlaceholder && "ــــ")}
            </div>
        </StyledTableCell>
    );
});

FixedTableCell.displayName = 'FixedTableCell';