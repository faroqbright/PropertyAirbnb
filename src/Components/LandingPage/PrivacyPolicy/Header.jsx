import React from "react";
import { Circle, Dot } from "lucide-react";

const terms = [
  {
    title: "Privacy Policy",

    content:
      "HondaPartsNow.com (we, us, our, site, or HondaPartsNow.com) is the sole owner of the information collected on this site. HondaPartsNow.com takes every precaution necessary to protect your privacy and personal information. Below is a description of how we collect information from you online when you visit HondaPartsNow.com",
  },
  {
    title: "Online Security",

    content:
      "Whenever you submit sensitive information (such as a credit card number) via our website, that information is collected, encrypted, and protected by the best industry standard SSL encryption technology available. Any time you send data to our web server, it will be encrypted and our server will encrypt any data sent back to your web browser.",
  },
  {
    title: "Cookies and Information Collected",

    content:
      "Information collected by or submitted to our site may be used to help us customize web content and better serve you with pertinent information, such as order confirmations and order status updates. We will not sell, share, or rent this information to any outside parties, except as outlined in this policy. If you choose to turn off your cookies, your website experience may be limited and you may be unable to use some of the features of the site.",
  },
  {
    title: "Email Collection",

    content:
      "If you provide your email address to us or register for an account, we may use it to respond or update you on parts inquiries. If you receive a marketing email from HondaPartsNow.com and would prefer not to receive these types of emails, you can easily click the unsubscribe link in the email footer to remove your email address from our list.",
  },
  {
    title: "Notice of Changes",

    content:
      "HondaPartsNow.com reserves the right, at its discretion, to change, modify, add, or remove portions of this Privacy Policy at any time. You should check this page periodically for changes. Your continued use of this Site following the posting of changes to this Privacy Policy will mean that you have accepted those changes.",
  },
];
export default function Header() {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg">
      <div className="text-[24px] sm:text-[28px] mb-14">
        <h1 className="text-[#1C1C1C] font-bold text-center mb-6">
          Privacy Policy
        </h1>
      </div>
      <div className="relative space-y-6 mb-16">
        {terms.map((term, index) => (
          <div key={index} className="relative flex items-start gap-4">
            {index !== terms.length - 1 && (
              <div className="absolute left-[5px] top-7 w-[2px] h-full bg-gray-200"></div>
            )}
            <div className="w-7 h-7 -ml-2 rounded-full bg-bluebutton flex items-center justify-center">
              <Dot className="text-white w-8" />
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
