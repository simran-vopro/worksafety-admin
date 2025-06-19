import {  GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Avatar, Box, IconButton, Switch, Tooltip } from "@mui/material";
import { Edit2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import PhoneInput from "../components/form/group-input/PhoneInput";
import { EnvelopeIcon } from "../icons";
import DataTable from "../components/common/DataTable";
import ConfirmModal from "../components/common/ConfirmModal";
import CommonModal from "../components/common/CommonModal";

interface Customer {
    id: number;
    avatar: string;
    name: string;
    email: string;
    mobile: string;
    totalOrders: number;
    address: string;
    isActive: boolean;
}

const customerData: Customer[] = [
    {
        id: 1,
        avatar: "./images/user/user-17.jpg",
        name: "Amit Patel",
        email: "amit@example.com",
        mobile: "+91-9876543210",
        totalOrders: 15,
        address: "Ahmedabad, Gujarat",
        isActive: true,
    },
    {
        id: 2,
        avatar: "./images/user/user-18.jpg",
        name: "Sneha Rao",
        email: "sneha@example.com",
        mobile: "+91-9123456780",
        totalOrders: 8,
        address: "Pune, Maharashtra",
        isActive: false,
    },
    {
        id: 3,
        avatar: "./images/user/user-19.jpg",
        name: "Rahul Singh",
        email: "rahul@example.com",
        mobile: "+91-9988776655",
        totalOrders: 22,
        address: "Lucknow, UP",
        isActive: true,
    },
];

const countries = [
    { code: "IN", label: "+91" },
    { code: "US", label: "+1" },
    { code: "GB", label: "+44" },
    { code: "CA", label: "+1" },
    { code: "AU", label: "+61" },
];

export default function CustomerPage() {
    const [customers, setCustomers] = useState(customerData);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState(customerData);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        pageSize: 5,
        page: 0,
    });

    // Modal state
    const [editUser, setEditUser] = useState<Customer | null>(null);
    const [deleteUser, setDeleteUser] = useState<Customer | null>(null);
    const [statusChangeUser, setStatusChangeUser] = useState<Customer | null>(null);

    // Form state for editing
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        address: "",
    });

    // Filter customers whenever searchQuery or customers change
    useEffect(() => {
        if (!searchQuery) {
            setFilteredCustomers(customers);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredCustomers(
                customers.filter(
                    (c) =>
                        c.name.toLowerCase().includes(query) ||
                        c.email.toLowerCase().includes(query) ||
                        c.mobile.toLowerCase().includes(query)
                )
            );
        }
    }, [searchQuery, customers]);

    // Open edit modal and fill form
    const openEditModal = (user: Customer) => {
        setEditUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            address: user.address,
        });
    };

    // Handle form input changes
    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Save edited user
    const handleSaveEdit = () => {
        if (!editUser) return;
        setCustomers((prev) =>
            prev.map((c) =>
                c.id === editUser.id
                    ? { ...c, ...formData }
                    : c
            )
        );
        setEditUser(null);
    };

    // Delete user
    const handleDelete = (id: number) => {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
        setDeleteUser(null);
    };

    // Toggle status but confirm first
    const handleToggleStatusRequest = (user: Customer) => {
        setStatusChangeUser(user);
    };

    const handleConfirmStatusChange = () => {
        if (!statusChangeUser) return;
        setCustomers((prev) =>
            prev.map((c) =>
                c.id === statusChangeUser.id ? { ...c, isActive: !c.isActive } : c
            )
        );
        setStatusChangeUser(null);
    };

    const customerColumns: GridColDef[] = useMemo(
        () => [
            {
                field: "avatar",
                headerName: "Avatar",
                width: 80,
                renderCell: (params) => (
                    <Avatar src={params.value} alt="avatar" sx={{ width: 32, height: 32 }} />
                ),
                sortable: false,
                filterable: false,
            },
            {
                field: "name",
                headerName: "Name",
                flex: 1,
                renderCell: (params) => (
                    <div className="text-sm text-gray-800 dark:text-white/90">{params.value}</div>
                ),
            },
            {
                field: "mobile",
                headerName: "Mobile",
                flex: 1,
                renderCell: (params) => (
                    <span className="text-sm text-gray-700 dark:text-gray-400">{params.value}</span>
                ),
            },
            {
                field: "email",
                headerName: "Email",
                flex: 1.5,
                renderCell: (params) => (
                    <span className="text-sm text-gray-700 dark:text-gray-400">{params.value}</span>
                ),
            },
            {
                field: "totalOrders",
                headerName: "Orders",
                width: 100,
                renderCell: (params) => (
                    <span className="text-sm text-gray-700 dark:text-gray-400">{params.value}</span>
                ),
            },
            {
                field: "address",
                headerName: "Address",
                flex: 1.5,
                renderCell: (params) => (
                    <span className="text-sm text-gray-700 dark:text-gray-400">{params.value}</span>
                ),
            },
            {
                field: "isActive",
                headerName: "Status",
                width: 100,
                renderCell: (params) => (
                    <Switch
                        checked={params.value}
                        onChange={() => handleToggleStatusRequest(params.row)}
                        size="small"
                    />
                ),
            },
            {
                field: "actions",
                headerName: "Actions",
                width: 120,
                renderCell: (params) => (
                    <Box display="flex" gap={1}>
                        <Tooltip title="Edit">
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={() => openEditModal(params.row)}
                            >
                                <Edit2 size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                color="error"
                                size="small"
                                onClick={() => setDeleteUser(params.row)}
                            >
                                <Trash2 size={16} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ),
                sortable: false,
                filterable: false,
            },
        ],
        [customers]
    );

    return (
        <div className="space-y-4">
            {/* Title + Search container */}
            <div className="flex justify-between items-center ">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Manage Customers</h2>

                <div className="flex justify-end flex-1">
                    <div className="w-1/2">
                        <Input
                            name="search"
                            type="search"
                            placeholder="Search customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                </div>
            </div>


                <DataTable
                    rows={filteredCustomers}
                    columns={customerColumns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                />
          

            {/* Edit User Modal */}
            <CommonModal
                open={!!editUser}
                onClose={() => setEditUser(null)}
                title="Edit User"
                width="medium"
            >
                <div className="space-y-6">
                    {/* Row 1 */}
                    <div className="flex gap-6">
                        <div className="w-1/2">
                            <Label>Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e: any) => handleInputChange("name", e.target.value)}
                                placeholder="Name"
                            />
                        </div>
                        <div className="w-1/2">
                            <Label>Email</Label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    className="pl-[62px]"
                                    value={formData.email}
                                    onChange={(e: any) => handleInputChange("email", e.target.value)}
                                    placeholder="Email"
                                />
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                    <EnvelopeIcon className="size-6" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="flex gap-6">
                        <div className="w-1/2">
                            <Label>Mobile</Label>
                            <PhoneInput
                                selectPosition="start"
                                countries={countries}
                                placeholder="+1 (555) 000-0000"
                                onChange={(val: any) => handleInputChange("mobile", val)}
                            />
                        </div>
                        <div className="w-1/2">
                            <Label>Address</Label>
                            <Input
                                value={formData.address}
                                onChange={(e: any) => handleInputChange("address", e.target.value)}
                                placeholder="Address"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" size="sm" onClick={() => setEditUser(null)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                            Save
                        </Button>
                    </div>
                </div>
            </CommonModal>



            {/* Confirm Delete Modal */}
            <ConfirmModal
                open={!!deleteUser}
                onClose={() => setDeleteUser(null)}
                onConfirm={() => deleteUser && handleDelete(deleteUser.id)}
                title="Confirm Delete User"
                description={`Are you sure you want to delete user ${deleteUser?.name}?`}
            />




            {/* Confirm Status Change Modal */}
            <ConfirmModal
                open={!!statusChangeUser}
                onClose={() => setStatusChangeUser(null)}
                onConfirm={handleConfirmStatusChange}
                title="Confirm Status Change"
                description={
                    <>
                        Are you sure you want to{" "}
                        <strong>{statusChangeUser?.isActive ? "deactivate" : "activate"}</strong> user{" "}
                        <strong>{statusChangeUser?.name}</strong>?
                    </>
                }
            />




        </div>
    );
}
