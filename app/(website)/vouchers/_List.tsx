"use client"
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Stack } from '@mui/material';
import { styled } from "@mui/material/styles";

import axios from 'axios';
import { ListHeaderTitle } from '@/Component/ListHeader';
import ListPaper from '@/Component/ListPaper';
import TableBodyWithLoad from '@/Component/TableBodyWithLoad';
import { FixedTableCell } from '@/Component/FixedTableCell';
import MUITablePagination from '@/Component/TablePagination';
import Form from './_Form';
import { useSearchParams } from 'next/navigation';
import { dateFormatLL } from '@/Component/helperFunctions/dateFunctions';
import { TableCellColor } from '@/Component/CellColor';


const PREFIX = "orders";
const classes = {
    filter: `${PREFIX}-filter`,
    filterActive: `${PREFIX}-filterActive`,
    title: `${PREFIX}-title`,
};
const Root = styled("div")(({ theme }) => ({
    height: "100%",

    [`& .${classes.filter}`]: {
        padding: theme.spacing(0.5, 1.5),
        borderRadius: theme.spacing(1),
        cursor: "pointer",
        [`&:hover`]: {
            background: theme.palette.divider
        },
    },
    [`& .${classes.filterActive}`]: {
        background: theme.palette.divider
    },
    [`& .${classes.title}`]: {
        fontSize: "22px"
    },
}));

export default function TransactionsList() {
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(20);

    const [fetch, setFetch] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const [data, setData] = React.useState<any>([]);
    const [totals, setTotals] = React.useState<any>({});
    const [totalCount, setTotalCount] = React.useState<number>(0);

    const searchParams = useSearchParams();
    const status = searchParams.get("status");
    console.log(data);


    const fetchData = async () => {
        const response = await axios.get(`/api/vouchers?page=${page + 1}&limit=${pageSize}&${status ? `status=${status}` : ''}`)
        setLoading(false);
        setData(response.data.vouchers);
        setTotals(response.data.totals);
        setTotalCount(response.data.pagination.totalVouchers);
    };

    React.useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, fetch]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageSize(+event.target.value);
        setPage(0);
    };


    const [openDialog, setOpenDialog] = React.useState(false)
    const [dataById, setDataById] = React.useState(null)
    const closeDialog = (value?: any) => {
        setDataById(null)
        setOpenDialog(false)
        value && setFetch(prev => !prev)
    };

    const tableCellHeader = [
        "ــ", "عنوان السند", "نوع السند", "الوصف", "المقبوض", "المدفوع", "القائم بالإنشاء", "تاريخ الإنشاء"
    ]

    const types: Record<"income" | "expense", string> = {
        income: "سند قبض",
        expense: "سند دفع",
    };

    return (
        <Root>
            {openDialog &&
                <Form
                    dataById={dataById}
                    open={openDialog}
                    handleClose={closeDialog}
                />
            }
            <Stack spacing={2} height={"100%"} overflow={"hidden"}>
                <Stack direction={"row"} spacing={2} justifyContent={"space-between"} useFlexGap>
                    <ListHeaderTitle title={"المستخدمين"} />
                    <Button variant="contained" color="primary" size="small" onClick={() => setOpenDialog(true)}>
                        {"جديد"}
                    </Button>
                </Stack>

                {!loading && data.length === 0 && <div>No Data</div>}
                {(!!data.length || loading) && <ListPaper loading={loading} data={!!(data && data.length)} restFilter={`${PREFIX}`}>
                    <TableContainer sx={{ width: "100%", overflow: "auto" }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {tableCellHeader.map(e =>
                                        <FixedTableCell align={'left'} key={e}>
                                            {e}
                                        </FixedTableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBodyWithLoad loading={loading} tableCellHeaderLength={tableCellHeader.length}>
                                <TableBody>
                                    {data.map((row: any, index: number) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                <FixedTableCell>
                                                    {index + 1}
                                                </FixedTableCell>
                                                <FixedTableCell>
                                                    {row.title}
                                                </FixedTableCell>
                                                <TableCellColor
                                                    cell={{
                                                        code: row.type,
                                                        label: types[row.type as keyof typeof types] || "Unknown type", // Fallback for unexpected values
                                                    }}
                                                />
                                                <FixedTableCell>
                                                    {row.description}
                                                </FixedTableCell>
                                                <FixedTableCell>
                                                    {row.incomeAmount}
                                                </FixedTableCell>
                                                <FixedTableCell>
                                                    {row.expenseAmount}
                                                </FixedTableCell>
                                                <FixedTableCell>
                                                    {row.userId.email}
                                                </FixedTableCell>
                                                <FixedTableCell>
                                                    {dateFormatLL(row.createdAt, "ar")}
                                                </FixedTableCell>
                                                {/* <FixedTableCell>
                                                    <IconButton
                                                        size='small'
                                                        onClick={() => {
                                                            setDataById(row)
                                                            setOpenDialog(true)
                                                        }}
                                                    >
                                                        <Edit fontSize='inherit' />
                                                    </IconButton>
                                                </FixedTableCell> */}
                                            </TableRow>
                                        );
                                    })}
                                    <TableRow hover>
                                        <FixedTableCell colSpan={3} allowPlaceholder={false} />
                                        <FixedTableCell>{"المجموع"}</FixedTableCell>
                                        <FixedTableCell>
                                            {totals.totalIncomeAmount}
                                        </FixedTableCell>
                                        <FixedTableCell>
                                            {totals.totalExpenseAmount}
                                        </FixedTableCell>
                                        <FixedTableCell>
                                            {"الصافي"}{": "}{totals.totalIncomeAmount - totals.totalExpenseAmount}
                                        </FixedTableCell>
                                        <FixedTableCell colSpan={4} allowPlaceholder={false} />
                                    </TableRow>
                                </TableBody>

                            </TableBodyWithLoad>

                        </Table>

                    </TableContainer>
                    <MUITablePagination
                        count={totalCount}
                        page={page}
                        rowsPerPage={pageSize}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </ListPaper>}

            </Stack>

        </Root>
    );
}
