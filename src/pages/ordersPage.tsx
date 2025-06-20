import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import ConfirmModal from "../components/common/ConfirmModal";
import DataTable from "../components/common/DataTable";
import { Order } from "../types/order";
import { useNavigate } from "react-router";
import { API_PATHS } from "../utils/config";
import { useAxios } from "../hooks/useAxios";

type OrdersPageProps = {
    title?: string;
    filterStatus?: string;
};

export default function OrdersPage({ title, filterStatus }: OrdersPageProps) {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        pageSize: 5,
        page: 0,
    });


    const selectedStatuses = filterStatus == "Received" ? ["Order Received"] : ["Quotation Sent", "Pending"];
    const queryParams = selectedStatuses
        .map(status => `status=${encodeURIComponent(status)}`)
        .join("&");

    const [deleteOrder, setDeleteOrder] = useState<Order | null>(null);

    const { data, loading, refetch, } = useAxios<Order[]>({
        url: `${API_PATHS.GET_ALL_ORDERS}?${queryParams}`,
    });

    const orders: Order[] = data || [];


    const handleDelete = (orderId: string) => {
        console.log(orderId)
        refetch();
        setDeleteOrder(null);
    };

    const columns: GridColDef[] = useMemo(
        () => [

            { field: "orderId", headerName: "Order ID", width: 140 },
            { field: "createdAt", headerName: "Order Date", width: 200 },
            { field: "firstName", headerName: "Customer", width: 140 },
            { field: "email", headerName: "Email", width: 200 },
            { field: "phone", headerName: "Phone", width: 140 },
            // { field: "address", headerName: "Address", width: 140 },
            { field: "address", headerName: "Billing Address", width: 240, renderCell: (params) => <>{params.value ? params.value : "NA"}</>, },
            { field: "invoiceAddress", headerName: "Invoice Address", width: 240, renderCell: (params) => <>{params.value ? params.value : "NA"}</>, },
            {
                field: "deliveryCharges",
                headerName: "Delivery Charges",
                width: 140,
                renderCell: (params) => <>{params.value ? `$${params.value}` : "NA"}</>,
            },
            {
                field: "total",
                headerName: "Total Amount",
                width: 140,
                renderCell: (params) => <>{params.value ? `$${params.value}` : "NA"}</>,
            },
            {
                field: "status",
                headerName: "Status",
                width: 200,
                renderCell: (params) => {
                    const getBadgeClass = (status: string) => {
                        switch (status) {
                            case "Pending":
                                return "bg-yellow-100 text-yellow-800";
                            case "Quotation Sent":
                                return "bg-blue-100 text-blue-800";
                            case "Order Received":
                                return "bg-green-100 text-green-800";
                            case "Delivered":
                                return "bg-gray-100 text-gray-800";
                            case "Cancelled":
                                return "bg-red-100 text-red-800";
                            default:
                                return "bg-gray-100 text-gray-800";
                        }
                    };

                    return (
                        <>
                            {
                                filterStatus == "Received" ? <select
                                    value={params.value}
                                    // onChange={(e) =>
                                    //     setOrders((prev) =>
                                    //         prev.map((o) =>
                                    //             o.orderId === params.row.orderId
                                    //                 ? { ...o, status: e.target.value }
                                    //                 : o
                                    //         )
                                    //     )
                                    // }
                                    className={`rounded-full px-3 py-1 text-sm font-semibold border-none focus:outline-none ${getBadgeClass(
                                        params.value
                                    )}`}
                                >
                                    <option value="Received">Received</option>
                                    <option value="Delivered">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select> : <div className={`rounded-full px-3 py-1 text-sm font-semibold border-none focus:outline-none ${getBadgeClass(
                                    params.value
                                )}`}>{params.value}</div>
                            }

                        </>
                    );
                },
            },
            {
                field: "actions",
                headerName: "Actions",
                width: 150,
                renderCell: (params) => (
                    <Box display="flex" gap={1}>
                        <Tooltip title="View">
                            <IconButton
                                onClick={() => navigate(`/quotation-details`, { state: { orderId: params.row.orderId } })}
                                color="info"
                                size="small"
                            >
                                <Eye size={16} />
                            </IconButton>
                        </Tooltip>
                        {filterStatus !== "Received" && (
                            <>
                                <Tooltip title="Edit">
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => navigate(`/quotation-details`, { state: { orderId: params.row.orderId } })}
                                    >
                                        <Edit2 size={16} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => setDeleteOrder(params.row)}
                                    >
                                        <Trash2 size={16} />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Box>
                ),
                sortable: false,
                filterable: false,
            },
        ],
        [orders]
    );

    function getRowId(row: any) {
        return row.orderId;
    }

    const getRowClassName = (params: any) => {
        switch (params.row.status) {
            case "Pending":
                return "bg-yellow-50 bg-opacity-20";
            case "Quotation Sent":
                return "bg-blue-100 bg-opacity-20";
            case "Received":
                return "bg-green-100 bg-opacity-20";
            case "Delivered":
                return "bg-gray-100 bg-opacity-20";
            case "Cancelled":
                return "bg-red-100 bg-opacity-20";
            default:
                return "";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {title ? title : "Manage Orders"}
                </h2>
                <div className="flex items-center flex-1 justify-end">
                    <Input
                        name="search"
                        type="search"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button onClick={() => navigate("/create-order")} size="sm" className="ml-4">
                        Create New Order
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 h-14 rounded-md" />
                    ))}
                </div>
            ) : (
                <DataTable
                    getRowId={getRowId}
                    rows={orders}
                    columns={columns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    getRowClassName={getRowClassName}
                />
            )}

            <ConfirmModal
                open={!!deleteOrder}
                onClose={() => setDeleteOrder(null)}
                onConfirm={() => deleteOrder && handleDelete(deleteOrder.orderId)}
                title="Confirm Delete Order"
                description={`Are you sure you want to delete order ${deleteOrder?.orderId}?`}
            />
        </div>
    );
}
