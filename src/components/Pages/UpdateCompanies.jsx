import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateCompanies = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [updateCompany, setUpdateCompany] = useState({
    companyName: "",
    companyEmail: "",
    companyCode: "",
    gstNo: "",
    country: "",
    companyAddress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/companyDetails/getData/${id}`
        );
        setUpdateCompany(response.data);
      } catch (error) {
        console.error("Error fetching Company details by Id: ", error);
      }
    };
    fetchCompanies();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8085/api/companyDetails/updateById/${id}`,
        updateCompany
      );
      alert("Company updated successfully!");
      navigate("/CompanyDashboard"); // redirect after update
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-500"
          onClick={() => navigate(-1)}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-center">Update Company</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={updateCompany.companyName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="text"
                name="companyEmail"
                value={updateCompany.companyEmail}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Code</label>
              <input
                type="text"
                name="companyCode"
                value={updateCompany.companyCode}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">GST No</label>
              <input
                type="text"
                name="gstNo"
                value={updateCompany.gstNo}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Country</label>
              <input
                type="text"
                name="country"
                value={updateCompany.country}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Address</label>
              <input
                type="text"
                name="companyAddress"
                value={updateCompany.companyAddress}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCompanies;
