import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RefundAndReturnPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-4xl font-bold text-center">
        Return, Refund & Cancellation Policy
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>1. Eligibility for Returns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>You may request a return if:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>The item is defective, damaged, or incorrect upon delivery.</li>
            <li>You received a product with missing parts/accessories.</li>
            <li>
              The product is unused, in original packaging, and in the same
              condition as received.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Non-Returnable Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            For hygiene, safety, and compatibility reasons, the following items
            are not eligible for return unless defective:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Screen protectors (once packaging is opened).</li>
            <li>Tempered glass, earphones, earbuds.</li>
            <li>
              Charging cables, chargers, or power banks that show signs of use.
            </li>
            <li>Customized or special-order products.</li>
            <li>Clearance or “Final Sale” items.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Return Request Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            You must initiate a return request within 7 days of delivery.
            Requests made after this period may not be accepted.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Return Process</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Contact Us:</strong> Email{" "}
            <a href="mailto:support@bulkwala.com" className="text-blue-600">
              support@bulkwala.com
            </a>{" "}
            or call 9220234727 with:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Order ID</li>
            <li>Reason for return</li>
            <li>Photos/videos showing the defect or wrong item</li>
          </ul>
          <p>
            <strong>Approval & Instructions:</strong> Once approved, you will
            receive return instructions and the return address.
          </p>
          <p>
            <strong>Shipping the Return:</strong> Defective/wrong items: We
            arrange free reverse pickup (where available). Other cases: Customer
            bears return shipping costs.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Refunds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p>
            <strong>Mode:</strong> Refunds are processed to your original
            payment method (or as store credit if you prefer).
          </p>
          <p>
            <strong>Processing Time:</strong> Within 5–7 business days after we
            receive and inspect the returned product.
          </p>
          <p>
            <strong>Deductions:</strong> Partial refunds may apply if items are
            not in original condition.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Replacement Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            A replacement will be shipped once we receive and verify the
            returned product. If a replacement is unavailable, a full refund
            will be issued.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Damaged or Wrong Item on Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Please report any damaged, defective, or incorrect item within 48
            hours of delivery with proof (photos/videos). Failure to report
            within this period may affect eligibility for free
            replacement/refund.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Cancellation Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Customers can cancel an order anytime before it’s dispatched for a
            full refund. Once the order is out for delivery, it cannot be
            canceled. However, customers may choose to reject it at the
            doorstep.
          </p>
          <p>
            The time window for cancellation varies by category, and once the
            specified window has passed, cancellation may not be allowed. In
            some cases, cancellation after the time window may incur a fee. The
            cancellation fee and time frame mentioned on the product page or
            order confirmation page will be considered final.
          </p>
          <p>
            If Bulkwala cancels an order due to unforeseen circumstances, a full
            refund will be initiated for all prepaid transactions.
          </p>
          <p>
            Bulkwala reserves the right to accept or decline any cancellation,
            as well as waive or modify the cancellation window or fees from time
            to time.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p>
            Email:{" "}
            <a href="mailto:bulkwala.info@gamail.com" className="text-blue-600">
              bulkwala.info@gamail.com
            </a>
          </p>
          <p>Phone: 9220234727</p>
          <p>
            Address: U33D, Khanna Market Rd, near SBI ATM, Block U, West Patel
            Nagar, Patel Nagar, Delhi, 110008
          </p>
          <p>
            Google Map:{" "}
            <a
              href="https://share.google/CAJVeYoJ3hZjbiWWx"
              target="_blank"
              className="text-blue-600"
            >
              View Location
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefundAndReturnPolicy;
