import { useEffect, useRef, useState } from "react";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Select from "../components/form/input/SelectField";
import { useProductDetail } from "../hooks/useProductDetail";
import { useLocation } from "react-router";

import Quill from "quill";
import "quill/dist/quill.core.css";  // Minimal styling
import "quill/dist/quill.snow.css";


const QuillEditor = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillInstance = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(editorRef.current, {
                theme: "snow", // Or "bubble", or remove for minimal
                placeholder: "Write catalogue copy here...",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link"],
                        ["clean"],
                    ],
                },
            });

            quillInstance.current.on("text-change", () => {
                const html = editorRef.current!.querySelector(".ql-editor")!.innerHTML;
                onChange(html);
            });

            // Set initial value
            quillInstance.current.root.innerHTML = value || "";
        }
    }, []);

    return <div ref={editorRef} style={{ minHeight: "200px" }} />;
};


interface Variation {
    type: string;
    value: string;
    code: string;
    image: File | null;
}

interface ProductFormData {
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
    Brand: string;
    ExtendedCharacterDesc: string;
    CatalogueCopy: string;
    ImageRef: string;
    Category1: string;
    Category2: string;
    Category3: string;
    Style: string;
    isActive: boolean;
    variations: Variation[];
}

const emptyProduct: ProductFormData = {
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
    isActive: true,
    variations: [],
};

const EditProductPage = () => {
    const location = useLocation();
    const { productId } = location.state || {};
    const { product, loading, error } = useProductDetail(productId);
    console.log("product  ==> ", productId, product)

    const [products, setProducts] = useState<ProductFormData[]>([emptyProduct]);

    // Set default form values when product is fetched
    useEffect(() => {
        if (product) {
            const formattedProduct: ProductFormData = {
                ...emptyProduct,
                ...product,
                Brand: product.Brand?.$oid || product.Brand || "",
                Category1: product.Category1?.$oid || product.Category1 || "",
                Category2: product.Category2?.$oid || product.Category2 || "",
                Category3: product.Category3?.$oid || product.Category3 || "",
                variations: product.variations || [],
            };
            setProducts([formattedProduct]);
        }
    }, [product]);

    const handleChange = <K extends keyof ProductFormData>(
        index: number,
        field: K,
        value: ProductFormData[K]
    ) => {
        const updated = [...products];
        updated[index][field] = value;
        setProducts(updated);
    };

    const handleSubmit = () => {
        console.log("Submitted Products:", products);
        // Submit logic here
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-red-500 text-center">Error loading product.</div>;

    return (
        <div className="py-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-5">Edit Product</h1>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8">
                <h2 className="text-xl font-medium mb-4 dark:text-white">Edit Product Details</h2>

                <div className="space-y-6">
                    {products.map((product, index) => (
                        <div key={index} className="border p-4 rounded-md shadow-sm space-y-6 bg-white dark:bg-gray-900">
                            {/* Product Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {([
                                    { label: "Code", field: "Code" },
                                    { label: "Description", field: "Description" },
                                    { label: "Pack", field: "Pack" },
                                    { label: "RRP", field: "rrp" },
                                    { label: "Supplier", field: "GrpSupplier" },
                                    { label: "Supplier Code", field: "GrpSupplierCode" },
                                    { label: "Manufacturer", field: "Manufacturer" },
                                    { label: "Manufacturer Code", field: "ManufacturerCode" },
                                    { label: "ISPCCombined", field: "ISPCCombined" },
                                    { label: "VAT", field: "VATCode" },
                                    { label: "Style", field: "Style" },
                                    { label: "Catalogue Copy", field: "CatalogueCopy" },
                                    { label: "Extended Desc", field: "ExtendedCharacterDesc" },
                                    { label: "ImageRef", field: "ImageRef" },
                                ] as const).map(({ label, field }) => (
                                    <>

                                        {
                                            field === "CatalogueCopy" ? (
                                                <div className="col-span-full mb-20">
                                                    <Label>Catalogue Copy</Label>
                                                    <QuillEditor
                                                        value={product.CatalogueCopy}
                                                        onChange={(val) => handleChange(index, "CatalogueCopy", val)}
                                                    />
                                                </div>
                                            ) : (
                                                <div key={field}>
                                                    <Label>{label}</Label>
                                                    <Input
                                                        type={typeof product[field] === "number" ? "number" : "text"}
                                                        value={
                                                            typeof product[field] === "number"
                                                                ? product[field].toString()
                                                                : (product[field] as string)
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                index,
                                                                field,
                                                                typeof product[field] === "number"
                                                                    ? parseFloat(e.target.value) || 0
                                                                    : e.target.value
                                                            )
                                                        }
                                                        placeholder={`Enter ${label}`}
                                                    />
                                                </div>
                                            )
                                        }
                                    </>


                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Category1, Category2, Category3 */}
                                {(["Category1", "Category2", "Category3"] as const).map((catField) => (
                                    <div key={catField}>
                                        <Label>{catField.replace("Category", "Category ")}</Label>
                                        <Select
                                            name={catField}
                                            value={product[catField]}
                                            onChange={(e) => handleChange(index, catField, e.target.value)}
                                            placeholder={`Select ${catField}`}
                                            options={[
                                                { label: "Clothing", value: "6838214f4c63544c39712f9d" },
                                                { label: "Footwear", value: "683823f34c63544c39717427" },
                                                { label: "Accessories", value: "683824cd4c63544c3971b8a0" },
                                            ]}
                                        />
                                    </div>
                                ))}

                                {/* Brand Dropdown */}
                                <div>
                                    <Label>Brand</Label>
                                    <Select
                                        name="Brand"
                                        value={product.Brand}
                                        onChange={(e) => handleChange(index, "Brand", e.target.value)}
                                        placeholder="Select Brand"
                                        options={[
                                            { label: "Portwest", value: "683eaf764e4683f2e2925b06" },
                                            { label: "Nike", value: "nike_id" },
                                            { label: "Adidas", value: "adidas_id" },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default EditProductPage;
