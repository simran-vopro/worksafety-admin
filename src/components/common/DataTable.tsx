import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Box } from "@mui/material";

interface DataTableProps {
    rows: any[];
    columns: GridColDef[];
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
    getRowId?: any;
    onRowClick?: any;
    getRowClassName?: any;
}



export default function DataTable({
    rows,
    columns,
    paginationModel,
    onPaginationModelChange,
    getRowId,
    onRowClick,
    getRowClassName
}: DataTableProps) {

    return (
        <Box className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-2">
            <DataGrid
                getRowClassName={getRowClassName}
                onRowClick={onRowClick}
                getRowId={getRowId}
                rows={rows}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={onPaginationModelChange}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
                getRowHeight={() => 60}
                className="text-sm [&_.MuiDataGrid-columnHeaders]:bg-gray-50 dark:[&_.MuiDataGrid-columnHeaders]:bg-white/[0.03]"
                sx={{
                    border: "none",
                    backgroundColor: "transparent",

                    ".MuiDataGrid-columnHeaderTitle": {
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "#6B7280",
                    },

                    ".MuiDataGrid-columnHeaders": {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                    },

                    ".MuiDataGrid-cell": {
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        py: 0,
                        // color: "white",
                    },
                    // ".MuiTablePagination-root": {
                    //     color: "white",
                    // },
                    // ".MuiSvgIcon-root": {
                    //     color: "white",
                    // },
                }}

            />
        </Box>
    );
}
