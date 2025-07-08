import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmPaidModal from "./ConfirmPaidModal";

const InvoicesDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [totalInvoices, setTotalInvoices]=useState([]);

  const [isUpdateModelOpen, setIsUpdateModel] = useState(false);
  const [updateInvoice, setUpdateInvoice] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/invoices");
        setInvoices(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching invoices", error);
      }
    };

    const fetchAllInvoicesData= async()=>{
      try{
        const response =await axios.get("http://localhost:8085/api/invoices/getInvoiceData");
        setTotalInvoices(response.data);
        console.log("Invoice Data", response);
        
      }catch(error){
        console.error("Error fetching invoice data: ", error);
        
      }
    }
    fetchInvoices();
    fetchAllInvoicesData();
  }, []);

  const paymentUpdate = (id) => {
    const data = invoices.filter((each) => each.id === id);

    setUpdateInvoice(data[0]);
    setIsUpdateModel(!isUpdateModelOpen);
  };

  const fetchByInvoiceId = async (updateId) => {
    try {
      const response = await axios.put(
        `http://localhost:8085/api/invoices/paid/${updateId}`
      );
      console.log("Invoice Data: ", response);
    } catch (error) {
      console.error("Error fetching By Id: ", error);
    }

    const fetchInvoices = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/invoices");
        setInvoices(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching invoices", error);
      }
    };
    fetchInvoices();

    setIsUpdateModel(!isUpdateModelOpen);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Invoices</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage and track all your business invoices
                </p>
              </div>

              <button
                onClick={() => navigate("/Invoice")} // replace with your route
                className="mt-4 sm:mt-0 bg-gray-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-500 transition"
              >
                Create Invoice
              </button>
            </div>
          </div>

          {totalInvoices.length>0 && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-sm text-gray-500 mb-1">Total Invoices</p>
              <p className="text-2xl font-semibold text-gray-800">{totalInvoices[2].count+totalInvoices[0].count+totalInvoices[1].count}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl shadow text-center">
              <p className="text-sm text-blue-700 mb-1">Pending</p>
              <p className="text-2xl font-semibold text-blue-700">{totalInvoices[2].count}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl shadow text-center">
              <p className="text-sm text-yellow-700 mb-1">Overdue</p>
              <p className="text-2xl font-semibold text-yellow-700">
                {totalInvoices[0].count}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow text-center">
              <p className="text-sm text-green-700 mb-1">Paid</p>
              <p className="text-2xl font-semibold text-green-700">{totalInvoices[1].count}</p>
            </div>
          </div>}

          <div className="overflow-auto bg-white rounded-2xl shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length > 0 ? (
                  invoices.map((invoiceData, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {invoiceData.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {invoiceData.companyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {invoiceData.client?.clientName || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {invoiceData.issueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {invoiceData.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {invoiceData.country}
                      </td>
                      <td
                        className={
                          invoiceData.invoiceStatus === "PAID"
                            ? "px-6 py-4 whitespace-nowrap font-semibold text-sm text-green-700"
                            : invoiceData.invoiceStatus === "PENDING"
                            ? "px-6 py-4 whitespace-nowrap font-semibold text-sm text-blue-700"
                            : "px-6 py-4 whitespace-nowrap font-semibold text-sm text-red-700"
                        }
                      >
                        {invoiceData.invoiceStatus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {invoiceData.country === "UK" ? "£" : "₹"}{" "}
                        {invoiceData.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex flex-row space-x-2 items-center">
                          {invoiceData.invoiceStatus !== "PAID" ? (
                            <button
                              className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition"
                              onClick={() => paymentUpdate(invoiceData.id)}
                            >
                              Pay
                            </button>
                          ) : (
                            <span className="text-gray-600 text-center mr-11 text-sm">
                              -
                            </span>
                          )}
                          <button
                            className="bg-gray-500 text-white px-2 py-1 rounded-md text-sm hover:bg-gray-400 transition"
                            onClick={() =>
                              navigate(`/InvoiceDetails/${invoiceData.id}`)
                            }
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500 text-sm"
                    >
                      No invoices data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isUpdateModelOpen && (
        <ConfirmPaidModal
          fetchByInvoiceId={fetchByInvoiceId}
          setIsUpdateModel={setIsUpdateModel}
          updateInvoice={updateInvoice}
        />
      )}
    </>
  );
};

export default InvoicesDashboard;
