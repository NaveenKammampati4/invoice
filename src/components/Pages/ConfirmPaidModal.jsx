

const ConfirmPaidModal = ({setIsUpdateModel, updateInvoice, fetchByInvoiceId}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Payment</h2>
        
        <div className="mb-3">
          <p className="text-gray-700"><strong>Invoice Number:</strong> {updateInvoice.invoiceNumber}</p>
          <p className="text-gray-700"><strong>Client Name:</strong> {updateInvoice.client.clientName}</p>
          <p className="text-gray-700"><strong>Amount: </strong>{updateInvoice.country==="UK"?"£":"₹"}{updateInvoice.totalAmount}</p>
        </div>

        <p className="text-red-600 font-medium mt-4">Are you sure you want to update this invoice as <strong>Paid</strong>?</p>

        <div className="flex justify-end space-x-3 mt-6">
          <button
          onClick={()=>setIsUpdateModel(false)}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
          onClick={()=>fetchByInvoiceId(updateInvoice.id)}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
          >
            Update as Paid
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmPaidModal