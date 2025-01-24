"use client"
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { styled } from "@mui/material/styles";

import axios from 'axios';
import { ListHeaderTitle } from '@/Component/ListHeader';
import ListPaper from '@/Component/ListPaper';
import TableBodyWithLoad from '@/Component/TableBodyWithLoad';
import { FixedTableCell } from '@/Component/FixedTableCell';
import MUITablePagination from '@/Component/TablePagination';
import Form from './_Form';
import { dateFormatLL } from '@/Component/helperFunctions/dateFunctions';
import { TableCellColor } from '@/Component/CellColor';
import { useSession } from 'next-auth/react';
import DeleteDialog from './_delete';
import { Delete, Info } from '@mui/icons-material';
import UpdateDialog from './_update';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import MUIDate from '@/Component/MuiDate';

const PREFIX = "orders";
const classes = {
    filter: `${PREFIX}-filter`,
    filterActive: `${PREFIX}-filterActive`,
    title: `${PREFIX}-title`,
    grid: `${PREFIX}-grid`,
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
    [`& .${classes.grid}`]: {
        display: "grid",
        gridAutoFlow: "column", /* Forces items to be laid out in a single row */
        gridGap: "10px", /* Optional: Adds spacing between items */
        overflowX: "scroll", /* Allows horizontal scrolling if items overflow */
        whiteSpace: "nowrap",
        width: "100%",
        MsOverflowStyle: "none", /* Internet Explorer 10+ */
        "&::-webkit-scrollbar": {
            display: "none"
        },
        justifyContent: "start",
        alignItems: "center"
    },
}));

export default function TransactionsList() {
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(20);
    const session = useSession();

    const [fetch, setFetch] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const [data, setData] = React.useState<any>([]);
    const [totals, setTotals] = React.useState<any>({});
    const [totalCount, setTotalCount] = React.useState<number>(0);

    const { control, handleSubmit } = useForm()

    const fetchData = async () => {
        const response = await
            axios.get(`/api/vouchers?page=${page + 1}&limit=${pageSize}&${session.data?.user.role === "user" ? `userId=${session.data?.user.userId}` : ''}`)
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
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
    const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false)
    const [dataById, setDataById] = React.useState(null)

    const closeDialog = (value?: any) => {
        setDataById(null)
        setOpenDialog(false)
        value && setFetch(prev => !prev)
    };

    const closeDeleteDialog = (value?: any) => {
        setDataById(null)
        setOpenDeleteDialog(false)
        value && setFetch(prev => !prev)
    };

    const closeUpdateDialog = (value?: any) => {
        setDataById(null)
        setOpenUpdateDialog(false)
        value && setFetch(prev => !prev)
    };

    const tableCellHeader = [
        "", "عنوان السند", "نوع السند", "الوصف", "الاستلامات النقدية", "المصروفات", "القائم بالإنشاء", "تاريخ الإنشاء", "حذف"
    ]

    if (session.data?.user.role !== "user") {
        tableCellHeader.splice(1, 0, "");
    }

    const types: Record<"income" | "expense", string> = {
        income: "استلام نقدي",
        expense: "مصروفات",
    };

    const onSubmit = (data: any) => {
        console.log(data);

        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([value]) => value !== null && value !== "")
        );

        if (Object.entries(filteredData).length === 0) {
            // navigate(`/dashboard/orders`)
        } else {
            // if (filteredData.date) {
            //     filteredData.date = dateFormat(filteredData.date);
            // }
            // // Convert the filtered data to URLSearchParams
            // const searchParams = new URLSearchParams(filteredData).toString();
            // // Navigate to the new URL with search parameters
            // navigate(`?${searchParams}`);
        }
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
            {openDeleteDialog &&
                <DeleteDialog
                    dataById={dataById}
                    open={openDeleteDialog}
                    handleClose={closeDeleteDialog}
                />
            }
            {openUpdateDialog &&
                <UpdateDialog
                    dataById={dataById}
                    open={openUpdateDialog}
                    handleClose={closeUpdateDialog}
                />
            }
            <Stack spacing={2} height={"100%"} overflow={"hidden"}>
                <Stack direction={"row"} spacing={2} justifyContent={"space-between"} useFlexGap>
                    <ListHeaderTitle title={"الحسابات"} />
                    <Button variant="contained" color="primary" size="small" onClick={() => setOpenDialog(true)}>
                        {"جديد"}
                    </Button>
                </Stack>
                <Stack direction={"row"} spacing={1} component={"form"} onSubmit={handleSubmit(onSubmit)} minHeight={50}>
                    <Stack width={"100px"} justifyContent={"center"}>
                        <LoadingButton loading={loading} variant='contained' type='submit'>{"بحث"}</LoadingButton>
                    </Stack>
                    <Box className={classes.grid}>
                        <Stack width={"180px"}>
                            <MUIDate
                                label={"date"}
                                control={control}
                                name="date"
                            />
                        </Stack>
                    </Box>
                </Stack>

                {!loading && data.length === 0 && <div>No Data</div>}
                {(!!data.length || loading) && <ListPaper loading={loading} data={!!(data && data.length)} restFilter={`${PREFIX}`}>
                    <TableContainer sx={{ width: "100%", overflow: "auto" }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {tableCellHeader.map((e, i) =>
                                        <FixedTableCell align={'left'} key={i}>
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
                                                {session.data?.user.role !== "user" &&
                                                    <FixedTableCell>
                                                        {row.status === "pending" &&
                                                            <IconButton
                                                                color='error'
                                                                size='small'
                                                                onClick={() => {
                                                                    setDataById(row)
                                                                    setOpenUpdateDialog(true)
                                                                }}
                                                            >
                                                                <Info fontSize='inherit' />
                                                            </IconButton>
                                                        }
                                                    </FixedTableCell>
                                                }
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
                                                    {row.incomeAmount ? row.incomeAmount + " جنية" : "ــــ"}
                                                </FixedTableCell>
                                                <FixedTableCell>
                                                    {row.expenseAmount ? row.expenseAmount + " جنية" : "ــــ"}
                                                </FixedTableCell>
                                                <FixedTableCell>
                                                    {row.userId.email}
                                                </FixedTableCell>
                                                <FixedTableCell>
                                                    {dateFormatLL(row.createdAt, "ar")}
                                                </FixedTableCell>
                                                <FixedTableCell>
                                                    {row.status === "approved" && <IconButton
                                                        size='small'
                                                        onClick={() => {
                                                            setDataById(row)
                                                            setOpenDeleteDialog(true)
                                                        }}
                                                    >
                                                        <Delete fontSize='inherit' />
                                                    </IconButton>
                                                    }
                                                </FixedTableCell>

                                            </TableRow>
                                        );
                                    })}
                                    <TableRow hover>
                                        <FixedTableCell colSpan={3} allowPlaceholder={false} />
                                        <FixedTableCell>{"المجموع"}</FixedTableCell>
                                        <FixedTableCell>
                                            {totals.totalIncomeAmount}{" "}{"جنية"}
                                        </FixedTableCell>
                                        <FixedTableCell>
                                            {totals.totalExpenseAmount}{" "}{"جنية"}
                                        </FixedTableCell>
                                        <FixedTableCell >
                                            {"الصافي"}{": "}
                                            <Typography component={"span"} variant={"body2"} dir='ltr' px={1}>
                                                {totals.totalIncomeAmount - totals.totalExpenseAmount}
                                            </Typography>
                                            جنية
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
