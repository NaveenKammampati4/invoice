import { useEffect, useState } from "react";
import {
  PlusCircleIcon,
  TrashIcon,
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon,
  CurrencyRupeeIcon,
  GlobeAltIcon,
} from "@heroicons/react/20/solid";
import Item from "./Item";
import axios from "axios";
import Logo from "../../image/MTL.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const Invoice = () => {
  const today = new Date().toISOString().split("T")[0];
  const [errors, setErrors] = useState({});

  const [country, setCountry] = useState(null);

  const navigate=useNavigate("");

  const [formData, setFormData] = useState({
    invoiceType: "",
    invoiceNumber: "",
    country:"",
    issueDate: today,
    dueDate: "",
    companyName: "Middleware Talents",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    cgst: 0,
    sgst: 0,
    vat: 0,
    tax: 0,
    totalAmount: 0,
    invoiceItems: [
      { description: "", quantity: 0, unitPrice: 0, totalPrice: 0 },
    ],
  });

  const [isInvoice, setIsInvoice] = useState(false);

  const validate = () => {
    const newErrors = {};
    let isError = false;
    if (!formData.invoiceType) {
      newErrors.invoiceType = "Invoice Type is required";
      isError = true;
    }
    if (!formData.invoiceNumber) {
      newErrors.invoiceNumber = "Client is required";
      isError = true;
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
      isError = true;
    }
    setErrors(() => newErrors);

    if (!isError) {
      setTab(() => false);
    }
  };

  const [companyDetails, setCompanyDetails] = useState([]);

  useEffect(() => {
    const fetchCompinies = async () => {
      const response = await axios.get(
        `http://localhost:8085/api/companyDetails/getByCountry/${country}`
      );
      let data = response.data;
      data.unshift({
        companyName: "Select Client",
        companyEmail: "",
        companyCode: "",
        gstNo: "",
        companyAddress: "",
        id: "",
      });

      setCompanyDetails(data);
    };
    fetchCompinies();
  }, [country]);

  const [tab, setTab] = useState(true);

  const filterCompany = (selectedValue) => {
    console.log("Filtering for:", selectedValue);
    console.log("Company details:", companyDetails);

    const filtered = companyDetails.filter(
      (each) => each.id.toString() === selectedValue
    );
    console.log(filtered);
    setFormData((prevData) => ({
      ...prevData,
      clientName: filtered[0].companyName,
    }));
    setFormData((prevData) => ({
      ...prevData,
      clientEmail: filtered[0].companyEmail,
    }));

    setFormData((prevData) => ({
      ...prevData,
      clientAddress: filtered[0].companyAddress,
    }));

    let date = new Date().toLocaleDateString().split("/");
    console.log(date);

    setFormData((prevData) => ({
      ...prevData,
      invoiceNumber: filtered[0].companyCode + "-" + date[2] + date[0],
    }));

    console.log(formData);
  };

  const changeSelected = (event) => {
    const selectedValue = event.target.value;
    console.log("Selected value:", selectedValue);
    setTimeout(() => {
      filterCompany(selectedValue);
    }, 0);
    changeErrors(event);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    changeErrors(e);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.invoiceItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    };

    if (name === "quantity" || name === "unitPrice") {
      updatedItems[index].totalPrice =
        Number(updatedItems[index].quantity) *
        Number(updatedItems[index].unitPrice);
    }
    setFormData({
      ...formData,
      invoiceItems: updatedItems,
    });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      invoiceItems: [
        ...formData.invoiceItems,
        { description: "", quantity: 0, unitPrice: 0, totalPrice: 0 },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.invoiceItems.filter((_, i) => i !== index);
    setFormData({ ...formData, invoiceItems: updatedItems });
  };

  const calculateSubtotal = () => {
    return formData.invoiceItems
      .reduce(
        (total, invoiceItems) =>
          total +
          Number(invoiceItems.quantity) * Number(invoiceItems.unitPrice),
        0
      )
      .toFixed(2);
  };

  const calculateTax = () => {
    if (country === "India") {
      const subtotal = Number.parseFloat(calculateSubtotal());
      const cgstPer = subtotal * ((parseFloat(formData.cgst) || 0) / 100);
      const sgstPer = subtotal * ((parseFloat(formData.sgst) || 0) / 100);
      return cgstPer + sgstPer;
    } else if (country === "UK") {
      const subtotal = Number.parseFloat(calculateSubtotal());
      const vatPer = subtotal * ((parseFloat(formData.vat) || 0) / 100);
      return vatPer;
    }
  };

  const calculateTotal = () => {
    const subtotal = Number.parseFloat(calculateSubtotal());
    return subtotal + calculateTax();
  };

  // const handleSubmit = async () => {

  useEffect(() => {
    if (formData.invoiceType === "Invoice for Product") {
      setIsInvoice(true);
    } else if (formData.invoiceType === "Invoice for Candidate") {
      setIsInvoice(false);
    }
  }, [formData.invoiceType]);

  //   setTab(false);
  //   try {
  //     console.log(formData);

  //     const response = await axios.post(
  //       "http://localhost:8085/api/invoices/submit",
  //       {
  //         invoiceNumber: formData.invoiceNumber,
  //         issueDate: formData.issueDate,
  //         dueDate: formData.dueDate,
  //         companyName: formData.companyName,
  //         client: {
  //           clientName: formData.clientName,
  //           clientEmail: formData.clientEmail,
  //           clientPhone: formData.clientPhone,
  //           clientAddress: formData.clientAddress,
  //         },
  //         invoiceItems: formData.invoiceItems,
  //         subtotal: calculateSubtotal(),
  //         tax: calculateTax(),
  //         totalAmount: calculateTotal(),
  //       }
  //     );

  //     // Replace with your actual API endpoint

  //     setFormData({
  //       invoiceType: "",
  //       invoiceNumber: "",
  //       issueDate: "",
  //       dueDate: "",
  //       companyName: "",
  //       clientName: "",
  //       clientEmail: "",
  //       clientPhone: "",
  //       clientAddress: "",
  //       tax: 0,
  //       totalAmount: 0,
  //       invoiceItems: [
  //         { description: "", quantity: 0, unitPrice: 0, totalPrice: 0 },
  //       ],
  //     });

  //     setTab(true);
  //     console.log("Invoice submitted successfully:", response.data);

  //     const input = document.querySelector(".min-h-screen"); // Select the main container
  //     const canvas = await html2canvas(input);
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save("invoice.pdf");
  //     alert("Invoice submitted successfully!");
  //   } catch (error) {
  //     console.error("Error submitting invoice:", error);
  //     alert("Failed to submit the invoice. Please try again.");
  //   }
  // };

  const handleSubmit = async () => {
    setTab(false);
    try {
      console.log(formData);

      const response = await axios.post(
        "http://localhost:8085/api/invoices/submit",
        {
          invoiceNumber: formData.invoiceNumber,
          issueDate: formData.issueDate,
          dueDate: formData.dueDate,
          country,
          companyName: formData.companyName,
          client: {
            clientName: formData.clientName,
            clientEmail: formData.clientEmail,
            // clientPhone: formData.clientPhone,
            clientAddress: formData.clientAddress,
          },
          invoiceItems: formData.invoiceItems,
          subtotal: calculateSubtotal(),
          tax: calculateTax(),
          totalAmount: calculateTotal(),
        }
        
      );

      const doc = new jsPDF();
      doc.setFont("helvetica", "normal");

      // doc.addImage(Logo,'PNG',14, 10, 50, 20)

      // --- Header Section ---
      // Title
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("INVOICE", 14, 20);

      // Invoice metadata (right-aligned)
      doc.setFontSize(10);
      doc.text(`Invoice : ${formData.invoiceNumber}`, 190, 20, {
        align: "right",
      });
      doc.text(`Date: ${formData.issueDate}`, 190, 26, { align: "right" });
      doc.text(`Due Date: ${formData.dueDate}`, 190, 32, { align: "right" });

      // --- Seller & Buyer Info ---
      // Seller (From)
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.text("From:", 14, 50);
      doc.setFontSize(10);
      doc.text(formData.companyName, 14, 56);

      // Buyer (Bill To)
      doc.setFontSize(12);
      doc.text("Bill To:", 14, 70);
      doc.setFontSize(10);
      doc.text(`Company Name: ${formData.clientName}`, 14, 76);
      doc.text(`Email: ${formData.clientEmail}`, 14, 82);
      // doc.text(`Phone: ${formData.clientPhone}`, 14, 88);
      doc.text(`Address: ${formData.clientAddress}`, 14, 94);

      // --- Invoice Items Table ---
      const headers = [
        {
          title: isInvoice ? "Description" : "Candidate Name",
          dataKey: "description",
        },
        { title: "Hours", dataKey: "quantity" },
        { title: "Price/Per Hour", dataKey: "unitPrice" },
        { title: "Amount", dataKey: "totalPrice" },
      ];

      const data = formData.invoiceItems.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice).toFixed(2),
        totalPrice: Number(item.totalPrice).toFixed(2),
      }));

      autoTable(doc, {
        startY: 110,
        head: [headers.map((h) => h.title)],
        body: data.map((row) => headers.map((h) => row[h.dataKey])),
        headStyles: {
          fillColor: [61, 61, 61],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: "auto" }, // Description
          1: { cellWidth: 30, halign: "left" }, // Qty
          2: { cellWidth: 30, halign: "left" }, // Unit Price
          3: { cellWidth: 30, halign: "left" }, // Amount
        },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: "linebreak",
        },
        margin: { left: 14, right: 14 },
      });

      // --- Summary Section ---
      const finalY = doc.lastAutoTable.finalY + 10;
      const summaryX = 160;

      // Subtotal
      doc.setFontSize(10);
      doc.text("Subtotal:", summaryX, finalY, { align: "right" });
      doc.text(`${Number(calculateSubtotal()).toFixed(2)}`, 190, finalY, {
        align: "right",
      });

      // Tax
      doc.text("Tax:", summaryX, finalY + 6, { align: "right" });
      doc.text(`${Number(calculateTax()).toFixed(2)}`, 190, finalY + 6, {
        align: "right",
      });

      // Total (bold)
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Total:", summaryX, finalY + 16, { align: "right" });
      doc.text(`${Number(calculateTotal()).toFixed(2)}`, 190, finalY + 16, {
        align: "right",
      });
      doc.setFont("helvetica", "normal");

      // Save PDF
      doc.save(`Invoice_${formData.invoiceNumber}.pdf`);

      // Reset form
      setFormData({
        invoiceType: "",
        invoiceNumber: "",
        issueDate: "",
        country:"",
        dueDate: "",
        companyName: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        clientAddress: "",
        tax: 0,
        totalAmount: 0,
        invoiceItems: [
          { description: "", quantity: 0, unitPrice: 0, totalPrice: 0 },
        ],
      });

      navigate("/")
      console.log("Invoice submitted successfully:", response.data);
      alert("Invoice submitted and downloaded successfully!");
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert("Failed to submit the invoice. Please try again.");
    }
  };

  const changeErrors = (e) => {
    const { name, value } = e.target;

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (value.trim() !== "") {
        delete updatedErrors[name];
      }
      return updatedErrors;
    });
  };

  // const handleCheck = async () =>{
  //   try{
  //     const issueDate = new Date(formData.issueDate);
  //     const month = issueDate.getMonth()+1;
  //     const year = issueDate.getFullYear();
  //     if (!formData.clientName) {
  //       alert("Please enter the company name.");
  //       return;
  //     }
  //     const response = await axios.get(`http://localhost:8085/api/invoices/getByMonth/${month}/${year}/${formData.clientName}`);
  //     console.log(response.data);
  //     setTab(false);
  //   }catch(error){
  //     console.log("Error fetching invoices: ", error);

  //   }
  // }

  console.log(formData.invoiceType);

  function form() {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          Invoice Form
        </h2>
        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GlobeAltIcon className="w-6 h-6 text-sky-400" />
              Country
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <select
                  name="country"
                  id="country"
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                  className="w-full px-3 py-2 border text-sm border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="UK">UK</option>
                </select>
                {/* {errors.invoiceType && (
                  <p className="text-xs text-red-600">{errors.invoiceType}</p>
                )} */}
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-6 h-6 text-sky-400" />
              Invoice Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="invoiceType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Invoice Type
                </label>
                <select
                  name="invoiceType"
                  id="invoiceType"
                  onChange={handleChange}
                  value={formData.invoiceType}
                  className="w-full px-3 py-2 border text-sm border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select Type</option>
                  <option value="Invoice for Candidate">
                    Invoice for Candidate
                  </option>
                  <option value="Invoice for Product">
                    Invoice for Product
                  </option>
                </select>
                {errors.invoiceType && (
                  <p className="text-xs text-red-600">{errors.invoiceType}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="invoiceNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Client
                </label>
                {companyDetails.length > 0 && (
                  <select
                    className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    id="invoiceNumber"
                    onChange={changeSelected}
                    name="invoiceNumber"
                  >
                    {companyDetails.map((each) => (
                      <option
                        selected={formData.invoiceNumber === each.id}
                        key={each.id}
                        value={each.id}
                      >
                        {each.companyName}
                      </option>
                    ))}
                  </select>
                )}

                {errors.invoiceNumber && (
                  <p className="text-xs text-red-600">{errors.invoiceNumber}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="issueDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Issue Date
                </label>
                <input
                  id="issueDate"
                  name="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Due Date
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.dueDate && (
                  <p className="text-xs text-red-600">{errors.dueDate}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BuildingOfficeIcon className="w-6 h-6 text-sky-400" />
              Your Company Details
            </h3>
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                From Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserIcon className="w-6 h-6 text-sky-400" />
              Client Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="clientName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    To Company Name
                  </label>
                  <input
                    id="clientName"
                    name="clientName"
                    type="text"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="clientEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    To Company Email
                  </label>
                  <input
                    id="clientEmail"
                    name="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="clientAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  To Company Address
                </label>
                <textarea
                  id="clientAddress"
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {country === "India" && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CurrencyRupeeIcon className="w-6 h-6 text-sky-400" />
                Tax
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="cgst"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CGST %
                  </label>
                  <input
                    id="cgst"
                    name="cgst"
                    type="text"
                    value={formData.cgst}
                    onChange={handleChange}
                    onBlur={changeErrors}
                    className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.cgst && (
                    <p className="text-xs text-red-600">{errors.cgst}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="clientEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    SGST %
                  </label>
                  <input
                    id="sgst"
                    name="sgst"
                    type="text"
                    value={formData.sgst}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.sgst && (
                    <p className="text-xs text-red-600">{errors.sgst}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {country === "UK" && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CurrencyRupeeIcon className="w-6 h-6 text-sky-400" />
                Tax
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="vat"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    VAT %
                  </label>
                  <input
                    id="vat"
                    name="vat"
                    type="text"
                    value={formData.vat}
                    onChange={handleChange}
                    onBlur={changeErrors}
                    className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.invoiceType === "Invoice for Product" && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CurrencyRupeeIcon className="w-6 h-6 text-sky-400" />
                Invoice Items
              </h3>
              <div className="space-y-4">
                {formData.invoiceItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end"
                  >
                    <div>
                      <label
                        htmlFor={`description-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Description
                      </label>
                      <input
                        id={`description-${index}`}
                        name="description"
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`quantity-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Hours
                      </label>
                      <input
                        id={`quantity-${index}`}
                        name="quantity"
                        type="text"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`unitPrice-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Price/Per Hour
                      </label>
                      <input
                        id={`unitPrice-${index}`}
                        name="unitPrice"
                        type="text"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`totalPrice-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Amount
                      </label>
                      <input
                        id={`totalPrice-${index}`}
                        name="totalPrice"
                        type="number"
                        value={item.totalPrice}
                        readOnly
                        className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="inline-flex items-center text-sm justify-center w-8 h-8 text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Add Item
              </button>
            </div>
          )}

          {/* candidate */}
          {formData.invoiceType === "Invoice for Candidate" && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CurrencyRupeeIcon className="w-6 h-6 text-sky-400" />
                Invoice Items
              </h3>
              <div className="space-y-4">
                {formData.invoiceItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end"
                  >
                    <div>
                      <label
                        htmlFor={`description-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Candidate Name
                      </label>
                      <input
                        id={`description-${index}`}
                        name="description"
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`quantity-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Hours
                      </label>
                      <input
                        id={`quantity-${index}`}
                        name="quantity"
                        type="text"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`unitPrice-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Price/Per Hour
                      </label>
                      <input
                        id={`unitPrice-${index}`}
                        name="unitPrice"
                        type="text"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`totalPrice-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Amount
                      </label>
                      <input
                        id={`totalPrice-${index}`}
                        name="totalPrice"
                        type="number"
                        value={item.totalPrice}
                        readOnly
                        className="w-full px-3 py-2 border text-sm border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Add Item
              </button>
            </div>
          )}

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CurrencyRupeeIcon className="w-6 h-6 text-sky-400" />
              Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Subtotal:</span>
                <span className="font-semibold">
                  {country === "UK" ? "£" : "₹"}
                  {calculateSubtotal()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Tax:</span>
                <span className="font-semibold">
                  {country === "UK" ? "£" : "₹"}
                  {calculateTax()}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-gray-700">Total:</span>
                <span className="font-semibold text-blue-600">
                  {country === "UK" ? "£" : "₹"}
                  {calculateTotal()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={validate}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  function displayDetails() {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
          <div className="p-8">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                <div className="flex-shrink-0">
                  <div className="w-44 h-24 rounded-lg flex items-center justify-center">
                    <img
                      src={Logo}
                      alt="logo"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                </div>
                <div className="text-center md:flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">
                    TAX INVOICE
                  </h1>
                </div>
                <div className="text-right">
                  <div className="flex justify-end space-x-4">
                    <div className="text-gray-900 font-semibold text-right">
                      <p>Issue Date:</p>
                      <p>Due Date:</p>
                      <p>Invoice:</p>
                    </div>
                    <div className="text-gray-900 text-right">
                      <p>{formData.issueDate}</p>
                      <p>{formData.dueDate}</p>
                      <p>{formData.invoiceNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-lg font-semibold mb-4">From</h2>
                <h2>{formData.companyName}</h2>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-1">To</h2>
                <p className="w-full mb-1 p-1">
                  <span className="font-semibold">Company Name: </span>
                  {formData.clientName}
                </p>
                <p className="w-full mb-1 p-1">
                  <span className="font-semibold">Company Email: </span>
                  {formData.clientEmail}
                </p>
                {/* <p className="w-full mb-1 p-1">{formData.clientPhone}</p> */}
                <p className="w-full mb-1 p-1">
                  <span className="font-semibold">Company Address: </span>
                  {formData.clientAddress}
                </p>
              </div>
            </div>

            {formData.invoiceType === "Invoice for Product" && (
              <div className="mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-2 text-left">
                          Item Description
                        </th>
                        <th className="px-4 py-2">Hours</th>
                        <th className="px-4 py-2">Price/Per Hour</th>
                        <th className="px-4 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {formData.invoiceItems.map((each) => {
                        return <Item each={each} />;
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* candidate  */}
            {formData.invoiceType === "Invoice for Candidate" && (
              <div className="mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-2 text-left">Candidate Name</th>
                        <th className="px-4 py-2">Hours</th>
                        <th className="px-4 py-2">Price/Per Hour</th>
                        <th className="px-4 py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {formData.invoiceItems.map((each) => {
                        return <Item each={each} />;
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Sub Total</span>
                  <span>
                    {country === "UK" ? "£" : "₹"}
                    {calculateSubtotal()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Tax %</span>
                  <span>
                    {country === "UK" ? "£" : "₹"}
                    {calculateTax()}
                  </span>
                </div>
                <div className="flex justify-between border-t-2 border-gray-900 pt-2">
                  <span className="font-bold">TOTAL</span>
                  <span className="font-bold">
                    {country === "UK" ? "£" : "₹"}
                    {calculateTotal()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                type="submit"
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-start mt-4">
          <button
            className="border p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            onClick={() => setTab(true)}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return <div>{tab ? form() : displayDetails()}</div>;
};

export default Invoice;
