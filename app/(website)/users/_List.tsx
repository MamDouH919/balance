"use client"
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, IconButton, Stack } from '@mui/material';
import { styled } from "@mui/material/styles";

import axios from 'axios';
import { ListHeaderTitle } from '@/Component/ListHeader';
import ListPaper from '@/Component/ListPaper';
import TableBodyWithLoad from '@/Component/TableBodyWithLoad';
import { FixedTableCell } from '@/Component/FixedTableCell';
import MUITablePagination from '@/Component/TablePagination';
import Form from './_Form';
import { Edit } from '@mui/icons-material';
import BooleanCell from '@/Component/BooleanCell';


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

export default function UsersList() {
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(20);

    const [fetch, setFetch] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const [data, setData] = React.useState<any>([]);
    const [totalCount, setTotalCount] = React.useState<number>(0);

    const fetchData = async () => {
        const response = await axios.get(`/api/users?page=${page + 1}&limit=${pageSize}`)
        setLoading(false);
        setData(response.data.users);
        setTotalCount(response.data.pagination.totalUsers);
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
        "ــ", "الأسم", "البريد الإلكتروني", "فعال", "خيارات"
    ]


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
                                        <TableCell align={'left'} key={e}>
                                            {e}
                                        </TableCell>
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
                                                    {row.name}
                                                </FixedTableCell>
                                                <FixedTableCell>
                                                    {row.email}
                                                </FixedTableCell>
                                                <FixedTableCell>
                                                    <BooleanCell value={row.isActive} />
                                                </FixedTableCell>
                                                <FixedTableCell>
                                                    <IconButton
                                                        size='small'
                                                        onClick={() => {
                                                            setDataById(row)
                                                            setOpenDialog(true)
                                                        }}
                                                    >
                                                        <Edit fontSize='inherit' />
                                                    </IconButton>
                                                </FixedTableCell>
                                            </TableRow>
                                        );
                                    })}
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
