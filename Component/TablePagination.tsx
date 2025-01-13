import { TablePagination } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
const MUITablePagination = (props: any) => {
    const {
        count,
        rowsPerPage,
        page,
        onPageChange,
        onRowsPerPageChange,
        rowsPerPageOptions,
    } = props;

    const PREFIX = "ListPickups";

    const classes = {
        background: `${PREFIX}-background`,
    };

    const Root = styled("div")(() => ({
        [`& .${classes.background}`]: {
            "& .MuiTablePagination-toolbar": {
                overflowY: "hidden",
                height: "100% !important",
                minHeight: "100% !important",
                "&::-webkit-scrollbar": {
                    height: "8px",
                }
            },
        },
    }));

    return (
        <Root>
            <TablePagination
                className={classes.background}
                sx={{
                    height: "40px",
                    "& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                    {
                        margin: 0,
                    },
                }}
                labelDisplayedRows={
                    ({ from, to, count }) =>
                        `${from}-${to} من ${count !== -1 ? count : ` أكثر من${to}`}`
                }
                labelRowsPerPage={""}
                rowsPerPageOptions={rowsPerPageOptions ?? [20, 50, 100]}
                component="div"
                count={count ? count : 20}
                rowsPerPage={rowsPerPage}
                page={!count || count <= 0 ? 0 : page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                ActionsComponent={undefined}
            />
        </Root>
    );
};

export default MUITablePagination;
