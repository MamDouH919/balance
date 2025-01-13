import { Skeleton, TableBody, TableRow } from "@mui/material"
import { FixedTableCell } from "./FixedTableCell";

interface inputProps {
    loading: boolean,
    tableCellHeaderLength: number,
    children: React.ReactNode,
}

const TableBodyWithLoad = (props: inputProps) => {
    const { loading, tableCellHeaderLength, children } = props

    const loadingArray = Array.from({ length: 30 }, (_, index) => index + 1);
    const FixedTableCellArray = Array.from({ length: tableCellHeaderLength }, (_, index) => index + 1);

    if (!loading) {
        return children
    }


    return <TableBody>
        {loadingArray.map((row) =>
            <TableRow hover tabIndex={-1} key={row}>
                {
                    FixedTableCellArray.map(e => {
                        return <FixedTableCell key={`${row}-${e}`}>
                            <Skeleton animation="wave" width={50} height={50} />
                        </FixedTableCell>
                    }
                    )
                }
            </TableRow>
        )}
    </TableBody>

}

export default TableBodyWithLoad