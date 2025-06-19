import { useState } from "react";
import Button from "../components/ui/button/Button";
import { Customer, Product } from "../types/order";
import { IconButton } from "@mui/material";
import { GridAddIcon } from "@mui/x-data-grid";
import { Delete } from "lucide-react";

export default function CreateNewOrderPage() {
    const COMMISSION_RATE = 0.175;

    const [customer, setCustomer] = useState<Customer>({
        id: "cust123",
        name: "Simran Kaur",
        email: "simran@example.com",
        phone: "9876543210",
        address: "123 Main Street, Mumbai, India",
    });

    const [editableProducts, setEditableProducts] = useState<Product[]>([]);

    const handleProductFieldChange = (id: string, field: string, value: any) => {
        setEditableProducts((prev) =>
            prev.map((p) => {
                if (p._id !== id) return p;
                const updated = { ...p, [field]: value };
                updated.totalPrice = (updated.quantity ?? 0) * (updated.unitPrice ?? 0);
                updated.grossProfit = (updated.unitPrice ?? 0) - (updated.buyPrice ?? 0);
                updated.commission = updated.grossProfit * COMMISSION_RATE;
                return updated;
            })
        );
    };

    const handleDeleteProduct = (id: string) => {
        setEditableProducts((prev) => prev.filter((p) => p._id !== id));
    };


    const addProduct = () => {
        setEditableProducts((prev) => [
            ...prev,
            {
                _id: `prod_${Date.now()}`,
                code: "",
                description: "",
                quantity: 1,
                unitPrice: 0,
                buyPrice: 0,
                totalPrice: 0,
                grossProfit: 0,
                commission: 0,
            },
        ]);
    };

    const calculateSubtotal = () => editableProducts.reduce((sum, p) => sum + (p.totalPrice ?? 0), 0);
    const [deliveryCharges, setDeliveryCharges] = useState(100);
    // const [tax, setTax] = useState(20);


    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal * 20) / 100;
    const total = subtotal + taxAmount + deliveryCharges;

    const handleSendOrder = () => {
        console.log("Order submitted:", { customer, editableProducts });
        alert("Order submitted successfully!");
    };

    return (
        <div className="space-y-4">

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Create New Order
            </h2>



            {/* Customer Info */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8">
                <h2 className="text-xl font-medium mb-4">Customer Information</h2>
                <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700">
                    <tbody>
                        {['name', 'email', 'phone', 'address'].map((field) => (
                            <tr key={field} className="border-b dark:border-gray-700">
                                <th className="p-2 font-medium bg-gray-50 dark:bg-gray-800 capitalize w-40">{field}</th>
                                <td className="p-2">
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        value={customer[field as keyof Customer]}
                                        onChange={(e) => setCustomer({ ...customer, [field]: e.target.value })}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white ">
                        Products
                    </h2>
                    <IconButton
                        className="bg-purple-50 hover:bg-purple-100"
                        color="primary"
                        size="small"
                        onClick={addProduct}
                    >
                        <GridAddIcon />
                    </IconButton>


                </div>


                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="p-2 w-30">Code</th>
                                <th className="p-2 w-80">Description</th>
                                <th className="p-2 w-30">Buy Price</th>
                                <th className="p-2 w-30">Unit Price</th>
                                <th className="p-2 w-30">Quantity</th>
                                <th className="p-2">Gross Profit</th>
                                <th className="p-2">Commission (17.5%)</th>
                                <th className="p-2">Total Price</th>
                                <th className="p-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {editableProducts.map((product) => (
                                <tr key={product._id} className="border-b dark:border-gray-700">
                                    <td className="p-2 w-30">
                                        <input
                                            type="text"
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            value={product.code}
                                            onChange={(e) => handleProductFieldChange(product._id, "code", e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2 w-80">
                                        <input
                                            type="text"
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            value={product.description}
                                            onChange={(e) => handleProductFieldChange(product._id, "description", e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2 w-30">
                                        <input
                                            type="number"
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            value={product.buyPrice}
                                            onChange={(e) => handleProductFieldChange(product._id, "buyPrice", parseFloat(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td className="p-2 w-30">
                                        <input
                                            type="number"
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            value={product.unitPrice}
                                            onChange={(e) => handleProductFieldChange(product._id, "unitPrice", parseFloat(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td className="p-2 w-30">
                                        <input
                                            type="number"
                                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            value={product.quantity}
                                            onChange={(e) => handleProductFieldChange(product._id, "quantity", parseFloat(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td className="p-2">£{product.grossProfit?.toFixed(2)}</td>
                                    <td className="p-2">£{product.commission?.toFixed(2)}</td>
                                    <td className="p-2 font-medium text-gray-800 dark:text-white">£{product.totalPrice?.toFixed(2)}</td>
                                    <td className="p-2 w-10">
                                        <IconButton
                                            onClick={() => handleDeleteProduct(product._id)}
                                            size="small"
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                </div>
            </div>

            {/* Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8">
                <h2 className="text-xl font-medium mb-4">Price Summary</h2>
                <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700 mb-4">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            <th className="p-2 w-1/4">Subtotal</th>
                            <th className="p-2 w-1/4">Delivery Charges</th>
                            <th className="p-2 w-1/4">Tax</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-gray-900 dark:text-white">
                            <td className="p-2">£{subtotal.toFixed(2)}</td>
                            <td className="p-2">
                                <input
                                    type="number"
                                    value={deliveryCharges}
                                    onChange={(e) => setDeliveryCharges(parseFloat(e.target.value) || 0)}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                                />
                            </td>
                            <td className="p-2">
                                £{taxAmount}
                                {/* <input
                                    type="number"
                                    value={tax}
                                    onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                                /> */}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="grid grid-cols-3 gap-4 text-sm text-gray-800 dark:text-gray-200">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 shadow-sm">
                        <p className="font-medium">Total Gross Profit</p>
                        <p className="text-green-600 font-semibold">
                            £{editableProducts.reduce((acc, p) => acc + (p.grossProfit ?? 0) * (p.quantity ?? 0), 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 shadow-sm">
                        <p className="font-medium">Total Commission</p>
                        <p className="text-blue-600 font-semibold">
                            £{editableProducts.reduce((acc, p) => acc + (p.commission ?? 0) * (p.quantity ?? 0), 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 shadow-sm">
                        <p className="font-medium">Total Invoice Amount</p>
                        <p className="text-purple-600 font-semibold">£{total.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-start gap-3 mt-4">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleSendOrder}>Send Quotation</Button>
            </div>
        </div>
    );
}