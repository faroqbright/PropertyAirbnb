import React from "react";
import { DollarSign, Tag, Clock, AlertTriangle, Shield } from "lucide-react";

const terms = [
  {
    title: "Pricing",
    icon: DollarSign,
    content:
      "Although we try our best to maintain an error-free website, a small number of the parts on our catalog may be mispriced. If the correct price is lower than the listed price, we will charge you the lower amount and ship out the order. If the part's correct price is higher than our listed price, we will inform you first to see whether the order should be proceed or canceled.",
  },
  {
    title: "Lowest Price Guarantee",
    icon: Tag,
    content:
      "Prior to placing your order, contact us by Phone, Live Chat, or Email and provide us a link to the online retailer we are matching. We will verify the item eligibility by reviewing the online retailer. HondaPartsNow.com will match the price from an online retailer only and has the final decision for matching an online price. If we match an online retailer’s price, it must include shipping charges in the price of the item. The item must be identical and must have the same manufacturer part number. Price matching is not available on previously placed orders and only applies to orders shipped in the United States.",
  },
  {
    title: "Backorders",
    icon: Clock,
    content:
      "In the event of a backorder part (less < 1% ), we will inform the customer and provide him/her with the option to cancel the part or the entire order. If customer is willing to wait, the customer's credit card will not be charged and invoiced until the parts arrive at our warehouse and the order is ready for shipment.",
  },
  {
    title: "Disclaimer",
    icon: AlertTriangle,
    content: (
      <>
        Some parts on your order may have updated replacement information. Our
        parts specialists will verify and ship out the updated replacement at
        our discretion.
        <br />
        In the meantime, the updated replacement part number will usually be
        provided on the packing list and invoice. Vehicle diagrams displayed on
        this website are for general illustration purposes only.
        <br />
        Vehicles depicted are shown as a sample vehicle of the same model only.
        Details of a selected vehicle may vary from the vehicle shown, depending
        on the selected features.
        <br />
        The diagrams are used as a point of reference and should not be used as
        the primary resource when ordering a part. The catalog is provided as a
        convenience to our customers.
        <br />
        <br />
        We do not guarantee the accuracy of the information provided within this
        catalog. While we try to maintain a near-perfect catalog, a small number
        of parts may be listed incorrectly.
        <br />
        Our website is a general catalog and does not reflect our actual
        inventory, please contact us for inventory information. We reserve the
        right to refuse to process an order for any reason.
        <br />
        Your order confirmation is an offer to buy, not a completed sales
        contract. Order acceptance and the completion of the contract between
        both the purchasing and seller parties will take place on the shipment
        of the products ordered.
        <br />
        <br />
        Your receipt of an electronic or other form of order confirmation does
        not mean our acceptance of your order, nor does it constitute a
        confirmation of our offer to sell. We reserve the right at any time
        after the receipt of your order to cancel your order for any reason.
        <br />
        <br />
        If the order is cancelled, the authorization on your card will be voided
        and no money will be charged. If your card was charged, a full refund
        will be issued to your credit card.
      </>
    ),
  },

  {
    title: "Limitation of liability",
    icon: Shield,
    content:
      "HondaPartsNow.com and its affiliates will not be liable for any direct, indirect, incidental, punitive, consequential, or any other damages whatsoever that result from the use or performance of, or the inability to use, the site, the products, or information, or functions on such site, even if HondaPartsNow.com has been advised of the possibility of such damages. In no events will HondaPartsNow.com and its affiliate's total liability to you for all damages, losses, and causes of action, whether arising out of contract, tort, or otherwise, exceed the amount paid by you, if any, for accessing the site or purchasing the products.",
  },
];
export default function Header() {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg">
      <div className="text-[24px] sm:text-[28px] mb-14">
        <h1 className="text-[#1C1C1C] font-bold text-center mb-6">
          Terms and Conditions
        </h1>
      </div>
      <div className="space-y-6 mb-16">
        {terms.map((term, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-7 h-7 rounded-full bg-bluebutton flex items-center justify-center">
              <term.icon className="text-white w-9 p-1"/>
            </div>
            <div>
              <h2 className="text-[#121212] font-medium mb-2 text-[17px] sm:text-[17px]">
                {term.title}
              </h2>
              <p className="text-[#868686] mt-1 text-[13px] sm:text-[14px]">
                {term.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
