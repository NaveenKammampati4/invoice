import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmPaidModal from "./ConfirmPaidModal";

const InvoicesDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState([]);
  const [status, setStatus] = useState("all");

  const [isUpdateModelOpen, setIsUpdateModel] = useState(false);
  const [updateInvoice, setUpdateInvoice] = useState(null);

  const [createdDate, setCreatedDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchInvoices = async () => {
      let url = "http://localhost:8085/api/invoices";
      if (status === "PENDING") {
        url = "http://localhost:8085/api/invoices/pendingInvoices";
      } else if (status === "OVERDUE") {
        url = "http://localhost:8085/api/invoices/overDueInvoices";
      } else if (status === "PAID") {
        url = "http://localhost:8085/api/invoices/paidInvoices";
      }
      try {
        const response = await axios.get(url);
        setInvoices(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching invoices", error);
      }
    };

    const fetchAllInvoicesData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8085/api/invoices/getInvoiceData"
        );
        setTotalInvoices(response.data);
        console.log("Invoice Data", response);
      } catch (error) {
        console.error("Error fetching invoice data: ", error);
      }
    };
    fetchInvoices();
    fetchAllInvoicesData();
  }, [status]);

  const paymentUpdate = (id) => {
    const data = invoices.filter((each) => each.id === id);

    setUpdateInvoice(data[0]);
    setIsUpdateModel(!isUpdateModelOpen);
  };

  const searchingData = (v) => {
    setSearchData(() => v);
    const filterData = invoices.filter((p) => p.invoiceNumber.includes(v));
    setInvoices(filterData);
    console.log(searchData);
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8085/api/invoices/fetchByDate",
        {
          params: {
            issueDate: createdDate,
            dueDate: dueDate,
          },
        }
      );
      setInvoices(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching filter dates", error);
    }
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
                onClick={() => navigate("/Invoice")}
                className="mt-4 sm:mt-0 bg-gray-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-500 transition"
              >
                Create Invoice
              </button>
            </div>
          </div>

          {totalInvoices.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div
                className="bg-white p-3 cursor-pointer rounded-lg shadow-sm hover:shadow-md transition text-center"
                onClick={() => setStatus("all")}
              >
                <p className="text-xs text-gray-500 mb-1">Total Invoices</p>
                <p className="text-xl font-semibold text-gray-800">
                  {totalInvoices[2].count +
                    totalInvoices[0].count +
                    totalInvoices[1].count}
                </p>
              </div>
              <div
                className="bg-blue-50 p-3 cursor-pointer rounded-lg shadow-sm hover:shadow-md transition text-center"
                onClick={() => setStatus("PENDING")}
              >
                <p className="text-xs text-blue-700 mb-1">Pending</p>
                <p className="text-xl font-semibold text-blue-700">
                  {totalInvoices[2].count}
                </p>
              </div>
              <div
                className="bg-yellow-50 p-3 cursor-pointer rounded-lg shadow-sm hover:shadow-md transition text-center"
                onClick={() => setStatus("OVERDUE")}
              >
                <p className="text-xs text-yellow-700 mb-1">Overdue</p>
                <p className="text-xl font-semibold text-yellow-700">
                  {totalInvoices[0].count}
                </p>
              </div>
              <div
                className="bg-green-50 p-3 cursor-pointer rounded-lg shadow-sm hover:shadow-md transition text-center"
                onClick={() => setStatus("PAID")}
              >
                <p className="text-xs text-green-700 mb-1">Paid</p>
                <p className="text-xl font-semibold text-green-700">
                  {totalInvoices[1].count}
                </p>
              </div>
            </div>
          )}

          {/* Filter Form */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-end gap-4 mb-6">
            <input
              type="text"
              onChange={(e) => {
                searchingData(e.target.value);
                setCurrentPage(1); // reset to page 1
              }}
              value={searchData}
              placeholder="Search By Invoice Number"
              className="border px-3 py-2 rounded-md text-sm w-full sm:w-60"
            />
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Created Date</label>
              <input
                type="date"
                onChange={(e) => {
                  setCreatedDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="border px-3 py-2 rounded-md text-sm w-full sm:w-44"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Due Date</label>
              <input
                type="date"
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="border px-3 py-2 rounded-md text-sm w-full sm:w-44"
              />
            </div>
            <button
              onClick={() => {
                handleFilter();
                setCurrentPage(1);
              }}
              className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition w-full sm:w-auto"
            >
              Filter
            </button>
          </div>

          {/* Invoice Table */}
          <div className="overflow-auto bg-white rounded-2xl shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Invoice Number",
                    "From Company",
                    "To Company",
                    "Issue Date",
                    "Due Date",
                    "Country",
                    "Status",
                    "Total Amount",
                    "Actions",
                  ].map((header, i) => (
                    <th
                      key={i}
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInvoices.length > 0 ? (
                  currentInvoices.map((invoiceData, index) => (
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
                        className={`px-6 py-4 whitespace-nowrap font-semibold text-sm ${
                          invoiceData.invoiceStatus === "PAID"
                            ? "text-green-700"
                            : invoiceData.invoiceStatus === "PENDING"
                            ? "text-blue-700"
                            : "text-red-700"
                        }`}
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
                      colSpan="9"
                      className="px-6 py-4 text-center text-gray-500 text-sm"
                    >
                      No invoices data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-end items-center gap-2 px-4 py-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                {[...Array(totalPages).keys()].map((pageNum) => (
                  <button
                    key={pageNum + 1}
                    onClick={() => setCurrentPage(pageNum + 1)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === pageNum + 1
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
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
