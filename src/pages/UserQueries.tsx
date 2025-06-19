import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Avatar, Box, IconButton, Switch, Tooltip } from "@mui/material";
import { Edit2, Key, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import PhoneInput from "../components/form/group-input/PhoneInput";
import { EnvelopeIcon } from "../icons";
import DataTable from "../components/common/DataTable";
import ConfirmModal from "../components/common/ConfirmModal";
import CommonModal from "../components/common/CommonModal";

interface Agent {
    id: number;
    avatar: string;
    name: string;
    email: string;
    mobile: string;
    totalOrders: number;
    address: string;
    isActive: boolean;
}

const agentData: Agent[] = [
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

export default function QueriesPage() {
    const [agents, setAgents] = useState(agentData);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredAgents, setFilteredAgents] = useState(agentData);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        pageSize: 5,
        page: 0,
    });

    // Modal states
    const [editAgent, setEditAgent] = useState<Agent | null>(null);
    const [deleteAgent, setDeleteAgent] = useState<Agent | null>(null);
    const [statusChangeAgent, setStatusChangeAgent] = useState<Agent | null>(null);
    const [addAgentModalOpen, setAddAgentModalOpen] = useState(false);

    // Form state for editing & adding
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        address: "",
        password: "",
        confirmPassword: "",
    });

    // Filter agents on search
    useEffect(() => {
        if (!searchQuery) {
            setFilteredAgents(agents);
        } else {
            const q = searchQuery.toLowerCase();
            setFilteredAgents(
                agents.filter(
                    (a) =>
                        a.name.toLowerCase().includes(q) ||
                        a.email.toLowerCase().includes(q) ||
                        a.mobile.toLowerCase().includes(q)
                )
            );
        }
    }, [searchQuery, agents]);

    // Open edit modal & fill form
    const openEditModal = (agent: Agent) => {
        setEditAgent(agent);
        setFormData({
            name: agent.name,
            email: agent.email,
            mobile: agent.mobile,
            address: agent.address,
            password: "",
            confirmPassword: "",
        });
    };

    // Open add modal and reset form
    const openAddModal = () => {
        setAddAgentModalOpen(true);
        setFormData({
            name: "",
            email: "",
            mobile: "",
            address: "",
            password: "",
            confirmPassword: "",
        });
    };

    // Handle form changes
    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Save edited agent
    const handleSaveEdit = () => {
        if (!editAgent) return;

        // Validate passwords only if filled
        if (formData.password || formData.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            // Here, implement your password update logic or API call
        }

        setAgents((prev) =>
            prev.map((a) =>
                a.id === editAgent.id
                    ? { ...a, ...formData, password: undefined, confirmPassword: undefined }
                    : a
            )
        );
        setEditAgent(null);
    };

    // Save new agent
    const handleAddAgent = () => {
        if (!formData.name || !formData.email) {
            alert("Name and Email are required");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const newAgent: Agent = {
            id: agents.length ? agents[agents.length - 1].id + 1 : 1,
            avatar: "./images/user/default-avatar.jpg",
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            totalOrders: 0,
            address: formData.address,
            isActive: true,
        };

        setAgents((prev) => [...prev, newAgent]);
        setAddAgentModalOpen(false);
    };

    // Delete agent
    const handleDelete = (id: number) => {
        setAgents((prev) => prev.filter((a) => a.id !== id));
        setDeleteAgent(null);
    };

    // Toggle status confirm request
    const handleToggleStatusRequest = (agent: Agent) => {
        setStatusChangeAgent(agent);
    };

    const handleConfirmStatusChange = () => {
        if (!statusChangeAgent) return;
        setAgents((prev) =>
            prev.map((a) =>
                a.id === statusChangeAgent.id ? { ...a, isActive: !a.isActive } : a
            )
        );
        setStatusChangeAgent(null);
    };

    const columns: GridColDef[] = useMemo(
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
                width: 160,
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
                                onClick={() => setDeleteAgent(params.row)}
                            >
                                <Trash2 size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Change Password">
                            <IconButton
                                color="secondary"
                                size="small"
                                onClick={() => {
                                    // Open your change password modal or logic here
                                    openEditModal(params.row);
                                    // Optionally, focus only password fields or show a dedicated password modal
                                }}
                            >
                                <Key size={16} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ),
                sortable: false,
                filterable: false,
            },
        ],
        [agents]
    );

    return (
        <div className="space-y-4">
            {/* Title + Search + Add Button */}
            <div className="flex justify-between items-center ">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Manage User Queries</h2>

                <div className="flex gap-3 items-center">
                    <div>
                        <Input
                            name="search"
                            type="search"
                            placeholder="Search agents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="primary" size="sm" onClick={openAddModal}>
                        Add New Agent
                    </Button>
                </div>
            </div>

            <DataTable
                rows={filteredAgents}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
            />


            {/* Edit Agent Modal */}
            <CommonModal open={!!editAgent} onClose={() => setEditAgent(null)} title="Edit Agent" width="medium">
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
                            // value={formData.mobile}
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

                    {/* Row 3: Change Password */}
                    <div className="flex gap-6">
                        <div className="w-1/2">
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                value={formData.password}
                                onChange={(e: any) => handleInputChange("password", e.target.value)}
                                placeholder="New Password"
                            />
                        </div>
                        <div className="w-1/2">
                            <Label>Confirm Password</Label>
                            <Input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e: any) => handleInputChange("confirmPassword", e.target.value)}
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" size="sm" onClick={() => setEditAgent(null)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                            Save
                        </Button>
                    </div>
                </div>
            </CommonModal>

            {/* Add New Agent Modal */}
            <CommonModal open={addAgentModalOpen} onClose={() => setAddAgentModalOpen(false)} title="Add New Agent" width="medium">
                <div className="space-y-6">
                    {/* Same form as edit modal */}
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

                    <div className="flex gap-6">
                        <div className="w-1/2">
                            <Label>Mobile</Label>
                            <PhoneInput
                                selectPosition="start"
                                countries={countries}
                                placeholder="+1 (555) 000-0000"
                                onChange={(val: any) => handleInputChange("mobile", val)}
                            // value={formData.mobile}
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

                    <div className="flex gap-6">
                        <div className="w-1/2">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={formData.password}
                                onChange={(e: any) => handleInputChange("password", e.target.value)}
                                placeholder="Password"
                            />
                        </div>
                        <div className="w-1/2">
                            <Label>Confirm Password</Label>
                            <Input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e: any) => handleInputChange("confirmPassword", e.target.value)}
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" size="sm" onClick={() => setAddAgentModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleAddAgent}>
                            Add
                        </Button>
                    </div>
                </div>
            </CommonModal>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                open={!!deleteAgent}
                onClose={() => setDeleteAgent(null)}
                onConfirm={() => deleteAgent && handleDelete(deleteAgent.id)}
                title="Confirm Delete Agent"
                description={`Are you sure you want to delete agent ${deleteAgent?.name}?`}
            />

            {/* Confirm Status Change Modal */}
            <ConfirmModal
                open={!!statusChangeAgent}
                onClose={() => setStatusChangeAgent(null)}
                onConfirm={handleConfirmStatusChange}
                title="Confirm Status Change"
                description={
                    <>
                        Are you sure you want to{" "}
                        <strong>{statusChangeAgent?.isActive ? "deactivate" : "activate"}</strong> agent{" "}
                        <strong>{statusChangeAgent?.name}</strong>?
                    </>
                }
            />
        </div>
    );
}
