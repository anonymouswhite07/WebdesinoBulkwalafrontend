import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ShippingPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-4xl font-bold text-center">
        Bulkwala Shipping Policy
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>1. Order Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Orders are processed within 1–2 business days after payment
            confirmation.
          </p>
          <p>
            For eco-friendly shipping, processing may take up to 3 business
            days.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Delivery Timelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p>
            <strong>Metro Cities:</strong> 2–5 business days (Standard), 1–2
            business days (Express)
          </p>
          <p>
            <strong>Tier 2 & 3 Cities:</strong> 4–7 business days
          </p>
          <p>
            <strong>Other Locations/Rest of India:</strong> 4–8 business days
          </p>
          <p>
            <strong>Eco-Friendly Shipping:</strong> 3–7 business days within
            India
          </p>
          <p>
            <strong>International Orders:</strong> 7–15 business days to select
            countries
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Shipping Charges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p>Free Standard Shipping on orders above ₹999 (India).</p>
          <p>Orders below ₹999: Flat ₹49 shipping charge.</p>
          <p>Express Delivery (Metro Cities): ₹149 additional charge.</p>
          <p>
            International Shipping: Fees calculated at checkout based on
            location and weight.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Same-Day Dispatch</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Orders placed before 12 PM (Mon–Sat) are dispatched the same day.
          </p>
          <p>Orders after 12 PM are dispatched the next business day.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Tracking & Courier Partners</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Tracking links and IDs are provided via email/SMS upon dispatch.
          </p>
          <p>Real-time tracking is available for all orders.</p>
          <p>
            Reliable courier partners: Delhivery, DTDC, Blue Dart, Ecom Express.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Eco-Friendly & Responsible Shipping</CardTitle>
        </CardHeader>
        <CardContent>
          <p>All orders are shipped in recyclable, eco-friendly packaging.</p>
          <p>We partner with couriers offering carbon-neutral delivery.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. International Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Available to select countries.</p>
          <p>
            Customs duties/taxes for international shipments are the
            responsibility of the buyer.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Possible Delays</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            While we strive for timely delivery, shipments may be delayed by
            unforeseen factors such as weather or courier issues.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            For questions or further assistance, please contact our support
            team:
          </p>
          <p>
            Email:{" "}
            <a href="mailto:Bulkwala.info@gmail.com" className="text-blue-600">
              Bulkwala.info@gmail.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingPolicy;
