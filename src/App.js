import "./App.css";
import React from "react";
// import InvoiceProduct from './components/Pages/InvoiceProduct';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import InvoiceForm from './Component/Pages/InvoiceForm';
// import InvoiceDisplay from './Component/Pages/InvoiceDisplay';
// import InvoicePage from './Component/Pages/InvoicePage';
import Invoice from "./components/Pages/Invoice";
import CompanyDetails from "./components/Pages/CompanyDetails";
import CompaniesDashboard from "./components/Pages/CompaniesDashboard";
import UpdateCompanies from "./components/Pages/UpdateCompanies";
import InvoicesDashboard from "./components/Pages/InvoicesDashboard";
import InvoiceDetails from "./components/Pages/InvoiceDetails";
import UpdateInvoice from "./components/Pages/UpdateInvoice";
import ConfirmPaidModal from "./components/Pages/ConfirmPaidModal";
// import InvoiceMain from './components/Pages/InvoiceMain';

function App() {
  // const [invoiceData, setInvoiceData] = useState({});
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Invoice" element={<Invoice />} />
          <Route path="/CompanyDetails" element={<CompanyDetails />} />
          <Route path="/CompanyDashboard" element={<CompaniesDashboard />} />
          <Route path="/UpdateCompanies/:id" element={<UpdateCompanies />} />
          <Route path="/" element={<InvoicesDashboard />} />
          <Route path="/UpdateInvoice/:id" element={<UpdateInvoice />} />
          <Route path="/ConfirmPaidModal" element={<ConfirmPaidModal />} />
          <Route path="/InvoiceDetails/:id" element={<InvoiceDetails />} />
        </Routes>
      </BrowserRouter>
    </>
    // <Invoice />
    // <CompanyDetails />
    // <InvoiceProduct />
  );
}

export default App;
