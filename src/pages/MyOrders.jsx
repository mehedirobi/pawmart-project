import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast, { Toaster } from "react-hot-toast";


const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.email) return;
    fetch(`https://pawmart-server-six.vercel.app/orders?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, [user]);

  const handleDownloadPDF = () => {
    if (!orders.length) {
      toast.error("No orders found to export!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("My Orders Report", 14, 15);
    doc.setFontSize(11);
    doc.text(`User: ${user?.email}`, 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [["Product", "Price", "Status", "Date"]],
      body: orders.map((o) => [
        o.productName || "N/A",
        o.price ? `Taka: ${o.price}` : "Free",
        o.status || "Pending",
        new Date(o.createdAt).toLocaleDateString(),
      ]),
    });

    doc.save("My_Orders_Report.pdf");
    toast.success("PDF Downloaded Successfully!");
  };

  return (
    <div className="py-16 container mx-auto px-4 min-h-screen">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-600">My Orders</h2>
        <button
          onClick={handleDownloadPDF}
          className="btn btn-sm btn-outline font-bold text-lg btn-primary"
        >
         Download Report
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 text-lg">You have no orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-indigo-100 text-indigo-700">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-500">
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o.productName}</td>
                  <td>{o.price ? `Taka: ${o.price}` : "Free"}</td>
                  <td>{o.status || "Pending"}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
