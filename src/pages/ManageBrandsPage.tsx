import { useState } from "react";
import { Frown, Pencil, X } from "lucide-react";
import ImageDropzone from "../components/form/form-elements/ImageDropZone";
import Button from "../components/ui/button/Button";

interface Brand {
    name: string;
    image?: string;
}

export default function ManageBrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([{
        name: "Portwest",
        image: "./images/cards/card-01.jpg"
    }]);
    const [inputValue, setInputValue] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editingOldName, setEditingOldName] = useState<string | null>(null);

    const isEditing = editIndex !== null;

    const handleAddOrEdit = () => {
        if (!inputValue.trim()) return;
        if (!imagePreview && !isEditing) return;

        const brand: Brand = {
            name: inputValue.trim(),
            image: imagePreview || undefined,
        };

        if (isEditing && editingOldName) {
            setBrands((prev) =>
                prev.map((b) => (b.name === editingOldName ? brand : b))
            );
        } else {
            if (!brands.find((b) => b.name === brand.name)) {
                setBrands([...brands, brand]);
            }
        }

        // Reset state
        setInputValue("");
        setImagePreview(null);
        setEditIndex(null);
        setEditingOldName(null);
    };

    const handleDelete = (name: string) => {
        setBrands((prev) => prev.filter((b) => b.name !== name));
    };

    // const [csvModalOpen, setCsvModalOpen] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Manage Brands
                    </h2>
                    <div className="relative ml-4">
                        <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                            <svg
                                className="fill-gray-500 dark:fill-gray-400"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                                    fill=""
                                />
                            </svg>
                        </span>
                        <input

                            type="text"
                            placeholder="Search Brand..."
                            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                        />

                        <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                            <span> ⌘ </span>
                            <span> K </span>
                        </button>
                    </div>
                </div>
                <Button variant="outline" size="sm" 
                
                // onClick={() => setCsvModalOpen(true)}
                
                >
                    Upload CSV
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Add Brand */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-4">
                        {isEditing ? "Edit Brand" : "Add Brand"}
                    </h2>
                    <input
                        type="text"
                        placeholder="Enter brand name"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 mb-4"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <ImageDropzone
                        onImageSelect={(img) => setImagePreview(img)}
                    />
                    <Button className="w-full mt-4" onClick={handleAddOrEdit}>
                        {isEditing ? "Update Brand" : "Add Brand"}
                    </Button>
                </div>

                {/* Brand List */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-4">Brand List</h2>
                    <div className="space-y-3">
                        {brands.length > 0 ? brands.map((brand, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-sm transition"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <img
                                        src={brand.image || "./images/cards/card-01.jpg"}
                                        alt="Brand"
                                        className="rounded-full w-10 h-10 object-cover"
                                    />
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {brand.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 ml-2">
                                    <Pencil
                                        size={16}
                                        className="text-gray-500 hover:text-blue-600 cursor-pointer"
                                        onClick={() => {
                                            setEditIndex(i);
                                            setInputValue(brand.name);
                                            setImagePreview(brand.image || null);
                                            setEditingOldName(brand.name);
                                        }}
                                    />
                                    <X
                                        size={16}
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                        onClick={() => handleDelete(brand.name)}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center text-center p-6 py-10 rounded-2xl bg-gray-50">
                                <div className="mb-3 animate-bounce">
                                    <Frown className="w-5 h-5 text-gray-400" />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-700">No Brands Available</h2>
                                <p className="text-sm text-gray-500 mt-1">Add a brand to begin organizing.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
