import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const InvoiceDetails = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/invoices/${id}`
        );
        setInvoiceData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Invoice Details: ", error);
      }
    };
    fetchInvoices();
  }, [id]);

  return (
    <div>
      {invoiceData !== null && (
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Invoice Details
              </h1>
              <button
                onClick={() => navigate("/")}
                className="mt-4 md:mt-0 bg-gray-600 text-center items-center hover:bg-gray-500 text-white px-5 py-2 rounded-xl font-semibold text-sm shadow-md transition-all"
              >
                Back to Dashboard
              </button>
            </div>
            {/* Invoice Block */}
            <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Invoice
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="font-medium">Invoice Number</p>
                  <p>{invoiceData?.invoiceNumber}</p>
                </div>
                <div>
                  <p className="font-medium">From Company</p>
                  <p>{invoiceData?.companyName}</p>
                </div>
                <div>
                  <p className="font-medium">Issue Date</p>
                  <p>{invoiceData?.issueDate}</p>
                </div>
                <div>
                  <p className="font-medium">Due Date</p>
                  <p>{invoiceData?.dueDate}</p>
                </div>
                <div>
                  <p className="font-medium">Tax Amount</p>
                  <p>{invoiceData?.tax?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-medium">Total Amount</p>
                  <p className="text-green-600 font-bold">
                    {invoiceData.country === "UK" ? "£" : "₹"}
                    {invoiceData?.totalAmount?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Client Details Block */}
            <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Client Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="font-medium">To Company</p>
                  <p>{invoiceData?.client?.clientName}</p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p>{invoiceData?.client?.clientEmail}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-medium">Address</p>
                  <p>{invoiceData?.client?.clientAddress}</p>
                </div>
              </div>
            </div>

            {/* Invoice Items Block */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Invoice Items
              </h2>
              {invoiceData?.invoiceItems?.length > 0 ? (
                <div className="overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {invoiceData.invoiceItems.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {item.description}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {invoiceData.country === "UK" ? "£" : "₹"}
                            {item.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700 font-medium">
                            {invoiceData.country === "UK" ? "£" : "₹"}
                            {(item.quantity * item.unitPrice).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No invoice items available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;
