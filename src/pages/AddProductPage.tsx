import { useState } from "react";
import { Trash2 } from "lucide-react";
// import DropzoneComponent from "../components/form/form-elements/DropZone";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Select from "../components/form/input/SelectField";


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

const AddProductPage = () => {
    const [products, setProducts] = useState<ProductFormData[]>([emptyProduct]);

    const handleChange = <K extends keyof ProductFormData>(
        index: number,
        field: K,
        value: ProductFormData[K]
    ) => {
        const newProducts = [...products];
        newProducts[index][field] = value;
        setProducts(newProducts);
    };


    const addVariation = (productIndex: number) => {
        const newProducts = [...products];
        newProducts[productIndex].variations.push({
            type: "",
            value: "",
            code: "",
            image: null,
        });
        setProducts(newProducts);
    };

    const updateVariation = (
        productIndex: number,
        variationIndex: number,
        field: keyof Variation,
        value: any
    ) => {
        const newProducts = [...products];
        newProducts[productIndex].variations[variationIndex][field] = value;
        setProducts(newProducts);
    };

    const deleteVariation = (productIndex: number, variationIndex: number) => {
        const newProducts = [...products];
        newProducts[productIndex].variations.splice(variationIndex, 1);
        setProducts(newProducts);
    };


    const handleSubmit = () => {
        console.log("Submitted Products:", products);
        // Add your submit logic here
    };

    return (
        <div className="py-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-5">Add New Product</h1>

            {/* Image Upload */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8">
                <h2 className="text-xl font-medium mb-4 dark:text-white">Upload Product Images</h2>
                {/* <DropzoneComponent /> */}
            </div>

            {/* Variations Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium dark:text-white">Add Product Details</h2>

                </div>

                <div className="space-y-6">
                    {products.map((product, index) => (
                        <div key={index} className="border p-4 rounded-md shadow-sm space-y-6 bg-white dark:bg-gray-900">
                            {/* Product Details */}
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
                                    { label: "VAT", field: "VATCode" },
                                    { label: "Brand", field: "Brand" },
                                    { label: "Style", field: "Style" },
                                ] as { label: string; field: keyof ProductFormData }[]).map(({ label, field }) => (
                                    <div key={field} className="flex flex-col">


                                        <div className="sm:col-span-1">
                                            <Label>
                                                {label}<span className="text-error-500">*</span>
                                            </Label>
                                            <Input
                                                type={typeof product[field] === "number" ? "number" : "text"}
                                                value={String(product[field])}
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        field,
                                                        typeof product[field] === "number"
                                                            ? parseFloat(e.target.value) || 0
                                                            : e.target.value
                                                    )
                                                }

                                                id={label}
                                                name={label}
                                                placeholder="Enter your first name"
                                            />
                                        </div>





                                    </div>
                                ))}

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Category1, Category2, Category3 */}
                                {(["Category1", "Category2", "Category3"] as const).map((catField) => (
                                    <div key={catField} className="flex flex-col">
                                        <Label>{catField.replace("Category", "Category ")}</Label>
                                        <Select
                                            name={catField}
                                            value={product[catField]}
                                            onChange={(e) => handleChange(index, catField, e.target.value)}
                                            placeholder={`Select ${catField.replace("Category", "Category ")}`}
                                            options={[
                                                { label: "Clothing", value: "clothing" },
                                                { label: "Footwear", value: "footwear" },
                                                { label: "Accessories", value: "accessories" },
                                            ]}
                                        />
                                    </div>
                                ))}

                                {/* Brand Dropdown */}
                                <div className="flex flex-col">
                                    <Label>Brand</Label>
                                    <Select
                                        name="Brand"
                                        value={product.Brand}
                                        onChange={(e) => handleChange(index, "Brand", e.target.value)}
                                        placeholder="Select Brand"
                                        options={[
                                            { label: "Nike", value: "Nike" },
                                            { label: "Adidas", value: "Adidas" },
                                            { label: "Puma", value: "Puma" },
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={product.isActive}
                                    onChange={(e) => handleChange(index, "isActive", e.target.checked)}
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                            </div>

                            {/* Variations Section */}
                            <div className="space-y-4 border-t pt-4">
                                <div className="flex justify-between">
                                    <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Variations</h3>
                                    <Button variant="outline" size="sm"

                                    // onClick={() => setCsvModalOpen(true)}

                                    >
                                        Upload CSV
                                    </Button>
                                </div>


                                {product.variations?.map((variation, vIndex) => (
                                    <div key={vIndex} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                                        {/* Variation Type */}
                                        <div className="flex flex-col">
                                            <Label>
                                                Variation Type<span className="text-error-500">*</span>
                                            </Label>
                                            <Input
                                                value={variation.type}
                                                onChange={(e) => updateVariation(index, vIndex, "type", e.target.value)}
                                                type="text"
                                                placeholder="Enter variation type"
                                            />
                                        </div>

                                        {/* Variation Value */}
                                        <div className="flex flex-col">
                                            <Label>Variation</Label>
                                            <Input
                                                value={variation.value}
                                                onChange={(e) => updateVariation(index, vIndex, "value", e.target.value)}
                                                type="text"
                                                placeholder="Enter variation"
                                            />
                                        </div>

                                        {/* Code */}
                                        <div className="flex flex-col">
                                            <Label>Code</Label>
                                            <Input
                                                value={variation.code}
                                                onChange={(e) => updateVariation(index, vIndex, "code", e.target.value)}
                                                type="text"
                                                placeholder="Enter code"
                                            />
                                        </div>

                                        {/* Image Upload */}
                                        <div className="flex flex-col">
                                            <Label>Image</Label>
                                            <Input
                                                type="file"
                                                onChange={(e) => updateVariation(index, vIndex, "image", e.target.files?.[0] || null)}
                                            />
                                        </div>

                                        {/* Delete Button */}
                                        <div className="flex items-center mt-4">
                                            <button
                                                onClick={() => deleteVariation(index, vIndex)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}


                                <button
                                    onClick={() => addVariation(index)}
                                    className="mt-2 text-blue-600 hover:underline text-sm"
                                >
                                    + Add Variation
                                </button>
                            </div>
                        </div>
                    ))}

                </div>

            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
                <Button onClick={handleSubmit} variant="outline">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="primary">
                    Submit Product
                </Button>
            </div>
        </div>
    );
};

export default AddProductPage;
