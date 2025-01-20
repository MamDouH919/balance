import React, { memo } from "react";
import { styled } from "@mui/material/styles";
import { Chip } from "@mui/material";
import * as colors from "@mui/material/colors";
import { FixedTableCell } from "./FixedTableCell";

// Define props for StyledFixedTableCell to include colorcode
interface StyledFixedTableCellProps {
    colorCode: string;
}

// Styled component with proper TypeScript typings
const StyledFixedTableCell = styled(Chip, {
    shouldForwardProp: (prop) => prop !== "colorCode",
})<StyledFixedTableCellProps>(({ theme, colorCode }) => ({
    color: theme.palette.getContrastText(colorCode),
    backgroundColor: `${colorCode} !important`,
}));

// Define the shape of the `shipment` prop
interface Cell {
    label: string;
    code: string;
}

// Define props for TableCellColor
interface TableCellColorProps {
    cell: Cell;
    table?: boolean;
}

export const TableCellColor: React.FC<TableCellColorProps> = memo(({ cell, table = true }) => {
    const color: { [key in Cell["code"]]?: string } = {
        expense: colors["red"]["500"],
        income: colors["green"]["500"],
    };

    const cellCode = cell?.code as keyof typeof color;
    const colorCode = color[cellCode] || colors["brown"]["500"];

    return table ? (
        <FixedTableCell>
            <StyledFixedTableCell
                colorCode={colorCode}
                size="small"
                label={cell.label}
            />
        </FixedTableCell>
    ) : (
        <StyledFixedTableCell
            colorCode={colorCode}
            size="small"
            label={cell.label}
        />
    );
});

TableCellColor.displayName = "TableCellColor";