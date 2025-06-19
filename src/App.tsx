import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import CustomerPage from "./pages/customer";
import ProductManagement from "./pages/products";
import AgentsPage from "./pages/agents";
import OrdersPage from "./pages/ordersPage";
import QuotationDetailsPage from "./pages/QuotationDetails";
import ReceivedOrders from "./pages/receivedOrders";
import CreateNewOrderPage from "./pages/CreateNewOrderPage";
import ManageCategoriesPage from "./pages/manageCategoriesPage";
import ManageBrandsPage from "./pages/ManageBrandsPage";
import AddProductPage from "./pages/AddProductPage";
import QueriesPage from "./pages/UserQueries";
import PrivateRoute from "./components/routes/PrivateRoute";

export default function App() {
  return (
    <Router basename="/admin/">
      <ScrollToTop />
      <Routes>
        {/* Protected Admin Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/addProduct" element={<AddProductPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/quotations" element={<OrdersPage />} />
            <Route path="/quotation-details" element={<QuotationDetailsPage />} />
            <Route path="/received-orders" element={<ReceivedOrders />} />
            <Route path="/create-order" element={<CreateNewOrderPage />} />
            <Route path="/categories" element={<ManageCategoriesPage />} />
            <Route path="/brands" element={<ManageBrandsPage />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/queries" element={<QueriesPage />} />
          </Route>
        </Route>

        {/* Auth Page */}
        <Route path="/signin" element={<SignIn />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
