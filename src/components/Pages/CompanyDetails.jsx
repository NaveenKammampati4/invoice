import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CompanyDetails = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyCode: "",
    gstNo: "",
    country: "",
    companyAddress: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const navigate=useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const emailPattern = /^[^@]+\.[a-zA-Z]{2,}$/;
    // if (!emailPattern.test(formData.companyEmail)) {
    //   alert("Please enter a valid commercial email (e.g., example.com)");
    //   return;
    // }
    try {
      const response = await axios.post(
        "http://localhost:8085/api/companyDetails",
        formData
      );
      console.log(response);
      setFormData({
        companyName: "",
        companyEmail: "",
        companyCode: "",
        gstNo: "",
        country: "",
        companyAddress: "",
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting invoice:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Company Details</h2>
          <button
            onClick={() => navigate("/CompanyDashboard")}
            className="text-gray-500 hover:text-red-600 text-2xl font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {submitted ? (
          <div className="text-center text-green-600 font-semibold text-lg">
            Your company details have been submitted successfully.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter Company Name"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-600">
                  Company Email
                </label>
                <input
                  type="text"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  placeholder="Company Email"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-600">
                  Company Code
                </label>
                <input
                  type="text"
                  name="companyCode"
                  value={formData.companyCode}
                  onChange={handleChange}
                  placeholder="Company Code"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-600">
                  GST NO
                </label>
                <input
                  type="text"
                  name="gstNo"
                  value={formData.gstNo}
                  onChange={handleChange}
                  placeholder="GST NO"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-600">
                  Country
                </label>
                {/* <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                /> */}
                <select
                  name="country"
                  id="country"
                  onChange={handleChange}
                  value={formData.country}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="">Select Coutry</option>
                  <option value="India">India</option>
                  <option value="UK">UK</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-600">
                Company Address
              </label>
              <textarea
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="Enter Company Address"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none h-28 resize-none"
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;
