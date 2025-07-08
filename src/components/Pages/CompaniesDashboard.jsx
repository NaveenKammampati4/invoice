import axios from "axios";
import React, { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const CompaniesDashboard = () => {
  const [companies, setCompanies] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8085/api/companyDetails/all"
        );
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8085/api/companyDetails/deleteById/${id}`
      );
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">
            Companies Dashboard
          </h2>
          <button
            onClick={() => navigate("/CompanyDetails")}
            className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition"
          >
            Register Company
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-sm text-gray-700 font-medium">
              <tr>
                <th className="px-4 py-3 text-left">Company Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left min-w-[100px]">Code</th>
                <th className="px-4 py-3 text-left min-w-[90px]">GST No</th>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
              {companies.length > 0 ? (
                companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{company.companyName}</td>
                    <td className="px-4 py-3">{company.companyEmail}</td>
                    <td className="px-4 py-3">{company.companyCode}</td>
                    <td className="px-4 py-3">{company.gstNo}</td>
                    <td className="px-4 py-3">{company.country}</td>
                    <td className="px-4 py-3">{company.companyAddress}</td>
                    <td className="px-2 py-3 text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() =>
                            navigate(`/UpdateCompanies/${company.id}`)
                          }
                          className="flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs shadow-md transition"
                        >
                          <PencilIcon className="w-4 h-4 mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs shadow-md transition"
                        >
                          <TrashIcon className="w-4 h-4 mr-1" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No company data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompaniesDashboard;
