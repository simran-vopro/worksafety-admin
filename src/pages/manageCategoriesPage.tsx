import { useState } from "react";
import { Frown, Pencil, X } from "lucide-react";
import ImageDropzone from "../components/form/form-elements/ImageDropZone";
import Button from "../components/ui/button/Button";

interface Category {
    name: string;
    image?: string;
}

interface CategoryColumnProps {
    title: string;
    categories: Category[];
    selectedParent?: string;
    onSelect?: (category: string) => void;
    onAdd?: (category: Category) => void;
    onEdit?: (oldCat: string, newCat: Category) => void;
    onDelete?: (cat: string) => void;
}

const CategoryColumn = ({
    title,
    categories,
    selectedParent,
    onSelect,
    onAdd,
    onEdit,
    onDelete,
}: CategoryColumnProps) => {
    const [inputValue, setInputValue] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [editingOldName, setEditingOldName] = useState<string | null>(null); // for tracking original name

    const isEditing = editIndex !== null;

    const handleAddOrEdit = () => {
        if (!inputValue.trim()) return;
        if (!imagePreview && !isEditing) {
            setError("Please select an image first.");
            return;
        }

        const category: Category = {
            name: inputValue.trim(),
            image: imagePreview || undefined,
        };

        if (isEditing && editingOldName) {
            onEdit?.(editingOldName, category);
        } else {
            onAdd?.(category);
        }

        // Reset fields
        setInputValue("");
        setImagePreview(null);
        setEditIndex(null);
        setEditingOldName(null);
        setError(null);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 w-full">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>

            {selectedParent && (
                <div className="text-center text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Add under: <span className="font-semibold text-brand-600">{selectedParent}</span>
                </div>
            )}


            <div className="flex items-center justify-center mb-2">
                <input
                    type="text"
                    placeholder={`Add ${title}`}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 mr-2"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <Button
                    onClick={handleAddOrEdit}
                    size="sm"

                >
                    {isEditing ? "Edit" : "Add"}
                </Button>

            </div>

            <ImageDropzone
                onImageSelect={(img) => {
                    setImagePreview(img);
                    setError(null);
                }}
            />

            {error && <p className="text-red-500 text-sm my-2">{error}</p>}



            <div className="space-y-3 mt-4 pt-4 border-t">
                <p className="text-sm mb-4">Added Categories</p>
                {categories.length > 0 ? categories.map((cat, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-sm transition"
                    >
                        <div
                            className="flex items-center gap-3 flex-1 cursor-pointer"
                            onClick={() => (editIndex === i ? null : onSelect?.(cat.name))}
                        >
                            <img
                                src={cat.image || "./images/cards/card-01.jpg"}
                                alt="Category"
                                className="rounded-full w-10 h-10 object-cover"
                            />
                            <span className="font-medium text-gray-800 dark:text-white">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                            <Pencil
                                size={16}
                                className="text-gray-500 hover:text-blue-600 cursor-pointer"
                                onClick={() => {
                                    setEditIndex(i);
                                    setInputValue(cat.name);
                                    setImagePreview(cat.image || null);
                                    setEditingOldName(cat.name);
                                }}
                            />
                            <X
                                size={16}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                onClick={() => onDelete?.(cat.name)}
                            />
                        </div>
                    </div>
                )) : <div className="flex flex-col items-center justify-center text-center p-6 py-10 rounded-2xl bg-gray-50">
                    <div className="mb-3 animate-bounce"><Frown className="w-5 h-5 text-gray-400" /> </div>
                    <h2 className="text-sm font-semibold text-gray-700">No Categories Available</h2>
                    <p className="text-sm text-gray-500 mt-1">Add a category to begin organizing.</p>
                </div>}
            </div>
        </div>
    );
};


export default function ManageCategoriesPage() {
    const [selectedTopCategory, setSelectedTopCategory] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

    const [topCategories, setTopCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<Record<string, Category[]>>({});
    const [subSubCategories, setSubSubCategories] = useState<Record<string, Category[]>>({});

    const handleAddTop = (cat: Category) => {
        if (!topCategories.find((c) => c.name === cat.name)) {
            setTopCategories([...topCategories, cat]);
        }
    };

    const handleAddSub = (cat: Category) => {
        if (!selectedTopCategory) return;
        const list = subCategories[selectedTopCategory] || [];
        if (!list.find((c) => c.name === cat.name)) {
            setSubCategories({
                ...subCategories,
                [selectedTopCategory]: [...list, cat],
            });
        }
    };

    const handleAddSubSub = (cat: Category) => {
        if (!selectedSubCategory) return;
        const list = subSubCategories[selectedSubCategory] || [];
        if (!list.find((c) => c.name === cat.name)) {
            setSubSubCategories({
                ...subSubCategories,
                [selectedSubCategory]: [...list, cat],
            });
        }
    };

    const handleEditTop = (oldCat: string, newCat: Category) => {
        setTopCategories((prev) => prev.map((c) => c.name === oldCat ? newCat : c));
        setSubCategories((prev) => {
            const updated = { ...prev };
            if (updated[oldCat]) {
                updated[newCat.name] = updated[oldCat];
                delete updated[oldCat];
            }
            return updated;
        });
    };

    const handleDeleteTop = (cat: string) => {
        setTopCategories((prev) => prev.filter((c) => c.name !== cat));
        setSubCategories((prev) => {
            const updated = { ...prev };
            delete updated[cat];
            return updated;
        });
    };

    const handleEditSub = (oldCat: string, newCat: Category) => {
        if (!selectedTopCategory) return;
        setSubCategories((prev) => {
            const updated = { ...prev };
            if (updated[selectedTopCategory]) {
                updated[selectedTopCategory] = updated[selectedTopCategory].map((c) =>
                    c.name === oldCat ? newCat : c
                );
            }
            return updated;
        });

        setSubSubCategories((prev) => {
            const updated = { ...prev };
            if (updated[oldCat]) {
                updated[newCat.name] = updated[oldCat];
                delete updated[oldCat];
            }
            return updated;
        });
    };

    const handleDeleteSub = (cat: string) => {
        if (!selectedTopCategory) return;
        setSubCategories((prev) => {
            const updated = { ...prev };
            updated[selectedTopCategory] = updated[selectedTopCategory].filter((c) => c.name !== cat);
            return updated;
        });
        setSubSubCategories((prev) => {
            const updated = { ...prev };
            delete updated[cat];
            return updated;
        });
    };

    const handleEditSubSub = (oldCat: string, newCat: Category) => {
        if (!selectedSubCategory) return;
        setSubSubCategories((prev) => {
            const updated = { ...prev };
            if (updated[selectedSubCategory]) {
                updated[selectedSubCategory] = updated[selectedSubCategory].map((c) =>
                    c.name === oldCat ? newCat : c
                );
            }
            return updated;
        });
    };

    const handleDeleteSubSub = (cat: string) => {
        if (!selectedSubCategory) return;
        setSubSubCategories((prev) => {
            const updated = { ...prev };
            updated[selectedSubCategory] = updated[selectedSubCategory].filter((c) => c.name !== cat);
            return updated;
        });
    };
    // const [csvModalOpen, setCsvModalOpen] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Manage Categories
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
                            placeholder="Search Category, sub category or child sub category..."
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


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <CategoryColumn
                    title="Top Categories"
                    categories={topCategories}
                    onAdd={handleAddTop}
                    onEdit={handleEditTop}
                    onDelete={handleDeleteTop}
                    onSelect={(cat) => {
                        setSelectedTopCategory(cat);
                        setSelectedSubCategory(null);
                    }}
                />

                <CategoryColumn
                    title="Subcategories"
                    categories={
                        selectedTopCategory
                            ? subCategories[selectedTopCategory] || []
                            : Object.values(subCategories).flat()
                    }
                    selectedParent={selectedTopCategory || undefined}
                    onAdd={handleAddSub}
                    onEdit={handleEditSub}
                    onDelete={handleDeleteSub}
                    onSelect={(cat) => setSelectedSubCategory(cat)}
                />

                <CategoryColumn
                    title="Sub-Subcategories"
                    categories={
                        selectedSubCategory
                            ? subSubCategories[selectedSubCategory] || []
                            : Object.values(subSubCategories).flat()
                    }
                    selectedParent={selectedSubCategory || undefined}
                    onAdd={handleAddSubSub}
                    onEdit={handleEditSubSub}
                    onDelete={handleDeleteSubSub}
                />
            </div>
        </div>
    );
}
