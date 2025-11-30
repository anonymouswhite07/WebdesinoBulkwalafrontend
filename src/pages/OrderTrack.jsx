import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useOrderStore from "@/store/order.store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const OrderTrack = () => {
  const { orderId } = useParams();
  const { trackingData, fetchTrackingData, isLoading, error } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrackingData(orderId);
  }, [orderId]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500 text-sm sm:text-base px-4 text-center">
        Fetching tracking details...
      </div>
    );

  if (!trackingData)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-600 px-4 text-center">
        <p className="text-base sm:text-lg">No tracking data available.</p>
        <Button
          className="mt-4 bg-[#02066F] w-full sm:w-auto"
          onClick={() => navigate("/my-orders")}
        >
          Back to Orders
        </Button>
      </div>
    );

  const shipmentData = trackingData?.ShipmentData?.[0];
  const waybill = shipmentData?.Shipment?.AWB || "N/A";
  const currentStatus =
    shipmentData?.Shipment?.Status?.Status || "Not Available";
  const scans = shipmentData?.Shipment?.Scans || [];

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-10 px-4 sm:px-6 font-inter">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
        Shipment Tracking
      </h1>

      {/* === Summary Card === */}
      <div className="bg-white border rounded-lg p-5 sm:p-6 shadow-sm">
        <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
          <p className="text-gray-700">
            <strong>Tracking ID:</strong> {waybill}
          </p>
          <p className="text-gray-700">
            <strong>Current Status:</strong> {currentStatus}
          </p>
          <p className="text-gray-700">
            <strong>Courier:</strong> Delhivery
          </p>

          {/* Optional external link */}
          {waybill !== "N/A" && (
            <a
              href={`https://www.delhivery.com/tracking?waybill=${waybill}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#02066F] underline text-xs sm:text-sm block mt-2"
            >
              Track on Delhivery Website →
            </a>
          )}
        </div>
      </div>

      {/* === Tracking History === */}
      <div className="mt-6 bg-white border rounded-lg p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 text-center sm:text-left">
          Tracking Updates
        </h2>

        {scans.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {scans.map((scan, index) => (
              <li
                key={index}
                className="py-3 text-sm sm:text-base flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-3"
              >
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">
                    {scan?.ScanDetail?.Scan || "Update"}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    {scan?.ScanDetail?.ScanDateTime
                      ? new Date(scan.ScanDetail.ScanDateTime).toLocaleString()
                      : ""}
                    {scan?.ScanDetail?.ScannedLocation
                      ? ` - ${scan.ScanDetail.ScannedLocation}`
                      : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic text-center text-sm sm:text-base">
            No scans available yet.
          </p>
        )}
      </div>

      {/* === Back Button === */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end items-center gap-3">
        <Button
          className="bg-[#02066F] w-full sm:w-auto text-sm sm:text-base"
          onClick={() => navigate("/my-orders")}
        >
          Back to My Orders
        </Button>
      </div>
    </div>
  );
};

export default OrderTrack;
