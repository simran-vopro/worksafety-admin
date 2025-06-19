import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Avatar, Box, IconButton, Switch, Tooltip } from "@mui/material";
import { Edit2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import CommonModal from "../components/common/CommonModal";
import ConfirmModal from "../components/common/ConfirmModal";
import DataTable from "../components/common/DataTable";
import DropzoneComponent from "../components/form/form-elements/DropZone";
import { useNavigate } from "react-router";
import { API_PATHS } from "../utils/config";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";


interface Product {
    _id: string;
    Code: string;
    Description: string;
    Pack: number;
    rrp: number;
    GrpSupplier: string;
    GrpSupplierCode: string;
    Manufacturer: string;
    ManufacturerCode: string;
    ISPCCombined: number;
    VATCode: number;
    Brand: string; // For demo, just string name/_id
    ExtendedCharacterDesc: string;
    CatalogueCopy: string;
    ImageRef: string;
    Category1: string;
    Category2: string;
    Category3: string;
    Style: string;
    isActive: boolean;
}




// const productData: Product[] = [
//     {
//         _id: "1",
//         Code: "PRD001",
//         Description: "Sample Product 1",
//         Pack: 10,
//         rrp: 100,
//         GrpSupplier: "Supplier A",
//         GrpSupplierCode: "SUP-A001",
//         Manufacturer: "Manu A",
//         ManufacturerCode: "MANA01",
//         ISPCCombined: 1,
//         VATCode: 5,
//         Brand: "BrandX",
//         ExtendedCharacterDesc: "Extended Desc 1",
//         CatalogueCopy: "Copy 1",
//         ImageRef: "./images/products/prod1.jpg",
//         Category1: "Category1A",
//         Category2: "Subcategory1A",
//         Category3: "Subchild1A",
//         Style: "Style1",
//         isActive: true,
//     },
//     {
//         _id: " 2",
//         Code: "PRD002",
//         Description: "Sample Product 2",
//         Pack: 5,
//         rrp: 250,
//         GrpSupplier: "Supplier B",
//         GrpSupplierCode: "SUP-B002",
//         Manufacturer: "Manu B",
//         ManufacturerCode: "MANB02",
//         ISPCCombined: 0,
//         VATCode: 12,
//         Brand: "BrandY",
//         ExtendedCharacterDesc: "Extended Desc 2",
//         CatalogueCopy: "Copy 2",
//         ImageRef: "./images/products/prod2.jpg",
//         Category1: "Category1B",
//         Category2: "Subcategory1B",
//         Category3: "Subchild1B",
//         Style: "Style2",
//         isActive: false,
//     },
//     {
//         _id: "3",
//         Code: "PRD003",
//         Description: "Sample Product 3",
//         Pack: 20,
//         rrp: 150,
//         GrpSupplier: "Supplier C",
//         GrpSupplierCode: "SUP-C003",
//         Manufacturer: "Manu C",
//         ManufacturerCode: "MANC03",
//         ISPCCombined: 1,
//         VATCode: 8,
//         Brand: "BrandZ",
//         ExtendedCharacterDesc: "Extended Desc 3",
//         CatalogueCopy: "Copy 3",
//         ImageRef: "./images/products/prod3.jpg",
//         Category1: "Category1C",
//         Category2: "Subcategory1C",
//         Category3: "Subchild1C",
//         Style: "Style3",
//         isActive: true,
//     },
//     {
//         _id: "4",
//         Code: "PRD004",
//         Description: "Sample Product 4",
//         Pack: 8,
//         rrp: 300,
//         GrpSupplier: "Supplier D",
//         GrpSupplierCode: "SUP-D004",
//         Manufacturer: "Manu D",
//         ManufacturerCode: "MAND04",
//         ISPCCombined: 0,
//         VATCode: 15,
//         Brand: "BrandX",
//         ExtendedCharacterDesc: "Extended Desc 4",
//         CatalogueCopy: "Copy 4",
//         ImageRef: "./images/products/prod4.jpg",
//         Category1: "Category1D",
//         Category2: "Subcategory1D",
//         Category3: "Subchild1D",
//         Style: "Style4",
//         isActive: true,
//     },

// ];


export default function ProductManagement() {


    const { data } = useAxios<Product[]>({
        url: `${API_PATHS.PRODUCTS}`,
    });


    // const orders: Order[] = data || [];
    const productData: Product[] = data || [];

    console.log("productData", productData)

    const [products, setProducts] = useState(productData);
    const [searchQuery, setSearchQuery] = useState("");
    // const [filteredProducts, setFilteredProducts] = useState(productData);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        pageSize: 5,
        page: 0,
    });

    // Modal state
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
    const [statusChangeProduct, setStatusChangeProduct] = useState<Product | null>(null);
    const [csvModalOpen, setCsvModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Omit<Product, "_id" | "isActive">>({
        Code: "",
        Description: "",
        Pack: 0,
        rrp: 0,
        GrpSupplier: "",
        GrpSupplierCode: "",
        Manufacturer: "",
        ManufacturerCode: "",
        ISPCCombined: 0,
        VATCode: 0,
        Brand: "",
        ExtendedCharacterDesc: "",
        CatalogueCopy: "",
        ImageRef: "",
        Category1: "",
        Category2: "",
        Category3: "",
        Style: "",
    });

    useEffect(() => {
        if (!searchQuery) {
            // setFilteredProducts(products);
        } else {
            // const query = searchQuery.toLowerCase();
            // setFilteredProducts(
            //     products.filter(
            //         (p) =>
            //             p.Code.toLowerCase().includes(query) ||
            //             p.Description.toLowerCase().includes(query) ||
            //             p.GrpSupplier.toLowerCase().includes(query) ||
            //             p.Manufacturer.toLowerCase().includes(query)
            //     )
            // );
        }
    }, [searchQuery, products]);

    const openEditModal = (product: Product) => {
        setEditProduct(product);
        const { isActive, _id, ...rest } = product;
        setFormData(rest);
    };

    const handleInputChange = (field: keyof typeof formData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = () => {
        if (!editProduct) return;
        setProducts((prev) =>
            prev.map((p) => (p._id === editProduct._id ? { ...p, ...formData } : p))
        );
        setEditProduct(null);
    };

    const handleDelete = (_id: string) => {
        setProducts((prev) => prev.filter((p) => p._id !== _id));
        setDeleteProduct(null);
    };

    const handleToggleStatusRequest = (product: Product) => {
        setStatusChangeProduct(product);
    };

    const handleConfirmStatusChange = () => {
        if (!statusChangeProduct) return;
        setProducts((prev) =>
            prev.map((p) =>
                p._id === statusChangeProduct._id ? { ...p, isActive: !p.isActive } : p
            )
        );
        setStatusChangeProduct(null);
    };

    const productColumns: GridColDef[] = useMemo(
        () => [
            {
                field: "ImageRef",
                headerName: "Image",
                width: 80,
                renderCell: (params) => (
                    <Avatar
                        src={params.value}
                        alt={params.row.Code}
                        variant="square"
                        sx={{ width: 48, height: 48 }}
                    />
                ),
                sortable: false,
                filterable: false,
            },
            { field: "Code", headerName: "Code", width: 120 },
            { field: "Description", headerName: "Description", width: 180 },
            { field: "Pack", headerName: "Pack", width: 80, type: "number" },
            { field: "rrp", headerName: "RRP", width: 100, type: "number" },
            { field: "GrpSupplier", headerName: "Supplier", width: 150 },
            { field: "GrpSupplierCode", headerName: "Supplier Code", width: 150 },
            { field: "Manufacturer", headerName: "Manufacturer", width: 150 },
            { field: "ManufacturerCode", headerName: "Manufacturer Code", width: 160 },
            { field: "ISPCCombined", headerName: "ISPC", width: 100, type: "number" },
            { field: "VATCode", headerName: "VAT Code", width: 100, type: "number" },
            { field: "Brand", headerName: "Brand", width: 120 },
            { field: "ExtendedCharacterDesc", headerName: "Extended Desc", width: 180 },
            { field: "CatalogueCopy", headerName: "Catalogue Copy", width: 150 },
            { field: "Category1", headerName: "Category 1", width: 120 },
            { field: "Category2", headerName: "Category 2", width: 120 },
            { field: "Category3", headerName: "Category 3", width: 120 },
            { field: "Style", headerName: "Style", width: 120 },
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
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        width="100%"
                    >
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
                                onClick={() => setDeleteProduct(params.row)}
                            >
                                <Trash2 size={16} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ),
                sortable: false,
                filterable: false,
                cellClassName: "actions-column-sticky", // add this class
                headerClassName: "actions-column-sticky",
            },

        ],
        [products]
    );

    const navigate = useNavigate();

    // function parseAndAddProducts(csvText: string) {
    //     // Simple CSV parser, assumes header line matching Product fields
    //     const lines = csvText.trim().split("\n");
    //     if (lines.length < 2) return;

    //     const headers = lines[0].split(",").map((h) => h.trim());

    //     const newProducts: Product[] = lines.slice(1).map((line, index) => {
    //         const values = line.split(",").map((v) => v.trim());
    //         const productObj: any = {};
    //         headers.forEach((header, i) => {
    //             productObj[header] = values[i];
    //         });
    //         return {
    //             _id: products.length + index + 1, // simple _id assignment
    //             Code: productObj.Code || "",
    //             Description: productObj.Description || "",
    //             Pack: Number(productObj.Pack) || 0,
    //             rrp: Number(productObj.rrp) || 0,
    //             GrpSupplier: productObj.GrpSupplier || "",
    //             GrpSupplierCode: productObj.GrpSupplierCode || "",
    //             Manufacturer: productObj.Manufacturer || "",
    //             ManufacturerCode: productObj.ManufacturerCode || "",
    //             ISPCCombined: Number(productObj.ISPCCombined) || 0,
    //             VATCode: Number(productObj.VATCode) || 0,
    //             Brand: productObj.Brand || "",
    //             ExtendedCharacterDesc: productObj.ExtendedCharacterDesc || "",
    //             CatalogueCopy: productObj.CatalogueCopy || "",
    //             ImageRef: productObj.ImageRef || "",
    //             Category1: productObj.Category1 || "",
    //             Category2: productObj.Category2 || "",
    //             Category3: productObj.Category3 || "",
    //             Style: productObj.Style || "",
    //             isActive: true,
    //         };
    //     });

    //     setProducts((prev) => [...prev, ...newProducts]);
    // }


    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrop = (files: File[]) => {
        const file = files[0];
        console.log("file uploaded ==> ", file);
        if (!file) return;
        setSelectedFile(file);
    };

    const { token } = useAuth();

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(API_PATHS.UPLOAD_PRODUCTS_CSV, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Upload response:", response.data);
            // toast.success("Upload successful");
        } catch (err: any) {
            console.error("Upload failed:", err);
            setError(err.response?.data?.message || "Upload failed");
            // toast.error("Upload failed");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Manage Products
                </h2>
                <div className="flex items-center gap-3">
                    <div>
                        <Input
                            name="search"
                            type="search"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                            navigate("/addProduct")
                        }}
                    >
                        Add New Product
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => setCsvModalOpen(true)}>
                        Upload CSV
                    </Button>


                </div>
            </div>


            <DataTable
                getRowId={(row: any) => row._id}
                rows={productData}
                columns={productColumns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
            />



            {/* Edit Product Modal */}
            <CommonModal
                open={!!editProduct}
                onClose={() => setEditProduct(null)}
                title="Edit Product"
                width="large"
            >
                <div className="space-y-4 max-h-[70vh] overflow-auto">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Code *</Label>
                            <Input
                                value={formData.Code}
                                onChange={(e) => handleInputChange("Code", e.target.value)}
                                placeholder="Code"

                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                value={formData.Description}
                                onChange={(e) => handleInputChange("Description", e.target.value)}
                                placeholder="Description"
                            />
                        </div>
                        <div>
                            <Label>Pack</Label>
                            <Input
                                type="number"
                                value={formData.Pack}
                                onChange={(e) =>
                                    handleInputChange("Pack", Number(e.target.value))
                                }
                                placeholder="Pack"
                            />
                        </div>
                        <div>
                            <Label>RRP</Label>
                            <Input
                                type="number"
                                value={formData.rrp}
                                onChange={(e) => handleInputChange("rrp", Number(e.target.value))}
                                placeholder="RRP"
                            />
                        </div>
                        <div>
                            <Label>Supplier</Label>
                            <Input
                                value={formData.GrpSupplier}
                                onChange={(e) => handleInputChange("GrpSupplier", e.target.value)}
                                placeholder="Supplier"
                            />
                        </div>
                        <div>
                            <Label>Supplier Code</Label>
                            <Input
                                value={formData.GrpSupplierCode}
                                onChange={(e) => handleInputChange("GrpSupplierCode", e.target.value)}
                                placeholder="Supplier Code"
                            />
                        </div>
                        <div>
                            <Label>Manufacturer</Label>
                            <Input
                                value={formData.Manufacturer}
                                onChange={(e) => handleInputChange("Manufacturer", e.target.value)}
                                placeholder="Manufacturer"
                            />
                        </div>
                        <div>
                            <Label>Manufacturer Code</Label>
                            <Input
                                value={formData.ManufacturerCode}
                                onChange={(e) => handleInputChange("ManufacturerCode", e.target.value)}
                                placeholder="Manufacturer Code"
                            />
                        </div>
                        <div>
                            <Label>ISPC Combined</Label>
                            <Input
                                type="number"
                                value={formData.ISPCCombined}
                                onChange={(e) =>
                                    handleInputChange("ISPCCombined", Number(e.target.value))
                                }
                                placeholder="ISPC Combined"
                            />
                        </div>
                        <div>
                            <Label>VAT Code</Label>
                            <Input
                                type="number"
                                value={formData.VATCode}
                                onChange={(e) => handleInputChange("VATCode", Number(e.target.value))}
                                placeholder="VAT Code"
                            />
                        </div>
                        <div>
                            <Label>Brand</Label>
                            <Input
                                value={formData.Brand}
                                onChange={(e) => handleInputChange("Brand", e.target.value)}
                                placeholder="Brand"
                            />
                        </div>
                        <div>
                            <Label>Extended Description</Label>
                            <Input
                                value={formData.ExtendedCharacterDesc}
                                onChange={(e) =>
                                    handleInputChange("ExtendedCharacterDesc", e.target.value)
                                }
                                placeholder="Extended Description"
                            />
                        </div>
                        <div>
                            <Label>Catalogue Copy</Label>
                            <Input
                                value={formData.CatalogueCopy}
                                onChange={(e) => handleInputChange("CatalogueCopy", e.target.value)}
                                placeholder="Catalogue Copy"
                            />
                        </div>
                        <div>
                            <Label>Image Ref</Label>
                            <Input
                                value={formData.ImageRef}
                                onChange={(e) => handleInputChange("ImageRef", e.target.value)}
                                placeholder="Image URL"
                            />
                        </div>
                        <div>
                            <Label>Category 1</Label>
                            <Input
                                value={formData.Category1}
                                onChange={(e) => handleInputChange("Category1", e.target.value)}
                                placeholder="Category 1"
                            />
                        </div>
                        <div>
                            <Label>Category 2</Label>
                            <Input
                                value={formData.Category2}
                                onChange={(e) => handleInputChange("Category2", e.target.value)}
                                placeholder="Category 2"
                            />
                        </div>
                        <div>
                            <Label>Category 3</Label>
                            <Input
                                value={formData.Category3}
                                onChange={(e) => handleInputChange("Category3", e.target.value)}
                                placeholder="Category 3"
                            />
                        </div>
                        <div>
                            <Label>Style</Label>
                            <Input
                                value={formData.Style}
                                onChange={(e) => handleInputChange("Style", e.target.value)}
                                placeholder="Style"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" size="sm" onClick={() => setEditProduct(null)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                            Save
                        </Button>
                    </div>
                </div>
            </CommonModal>

            <CommonModal
                open={csvModalOpen}
                onClose={() => setCsvModalOpen(false)}
                title="Upload Products CSV"
                width="small"
            >
                <DropzoneComponent onDrop={handleDrop} />

                {loading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
                {error && <p className="text-sm text-red-500 mt-2">Upload failed: {error}</p>}

                <Button onClick={handleUpload} disabled={loading || !selectedFile}>
                    Upload Products
                </Button>
            </CommonModal>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                open={!!deleteProduct}
                onClose={() => setDeleteProduct(null)}
                onConfirm={() => deleteProduct && handleDelete(deleteProduct._id)}
                title="Confirm Delete Product"
                description={`Are you sure you want to delete product ${deleteProduct?.Code}?`}
            />

            {/* Confirm Status Change Modal */}
            <ConfirmModal
                open={!!statusChangeProduct}
                onClose={() => setStatusChangeProduct(null)}
                onConfirm={handleConfirmStatusChange}
                title="Confirm Status Change"
                description={
                    <>
                        Are you sure you want to{" "}
                        <strong>{statusChangeProduct?.isActive ? "deactivate" : "activate"}</strong>{" "}
                        product <strong>{statusChangeProduct?.Code}</strong>?
                    </>
                }
            />
        </div>
    );
}
