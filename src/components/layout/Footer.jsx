import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#AFC2D5] text-white py-10 px-6 sm:px-10 md:px-16 lg:px-20 mt-10">
      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-8">
        {/*  Left Section */}
        <div>
          <h2 className="text-2xl text-[#02066F] font-bold mb-3">BULKWALA</h2>
          <p className="text-[#02066F] text-sm sm:text-base mb-4 leading-relaxed">
            The best quality electronics accessories <br /> provider for the
            whole world.
          </p>
          <div className="flex items-center gap-4 mt-4">
            {/* ✅ Facebook */}
            <a
              href="https://www.facebook.com/share/1BBdHy5oGh/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="text-[#02066F] hover:text-white cursor-pointer transition" />
            </a>

            {/* ✅ X (Twitter) */}
            <a
              href="https://x.com/bulkwala1?t=iq5EVhmJ9j3iFhru1-WZeQ&s=09"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#02066F"
                className="w-5 h-5 hover:fill-white transition"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26L22.5 21.75h-5.902l-4.622-6.063L6.61 21.75H3.3l7.73-8.839L1.5 2.25h6.086l4.168 5.52 6.49-5.52zM17.21 19.92h1.833L7.845 4.01H5.865L17.21 19.92z" />
              </svg>
            </a>

            {/* ✅ Instagram */}
            <a
              href="https://www.instagram.com/bulkwala01?igsh=ZTk5eXRqOXpidG16&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-[#02066F] hover:text-white cursor-pointer transition" />
            </a>

            {/* ✅ YouTube */}
            <a
              href="https://youtube.com/@bulkwala01?si=r1sSdtnuuRcprTp3"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="text-[#02066F] hover:text-white cursor-pointer transition" />
            </a>
          </div>
        </div>

        {/* Store Links */}
        <div>
          <h3 className="text-lg text-[#02066F] font-semibold mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-[#02066F] text-sm sm:text-base">
            <li className="hover:underline cursor-pointer">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:underline cursor-pointer">
              <Link to="/about-us">About Us</Link>
            </li>
            <li className="hover:underline cursor-pointer">
              <Link to="/contact-us">Contact Us</Link>{" "}
            </li>

            <li className="hover:underline cursor-pointer">
              <Link to="/products">Products</Link>
            </li>
            <Link
              to="/become-seller"
              className="text-[#02066F] hover:underline hover:text-[#04127A]"
            >
              Become a Seller
            </Link>
          </ul>
        </div>

        {/*  Visit Us */}
        <div>
          <h3 className="text-lg text-[#02066F] font-semibold mb-3">
            Visit Us
          </h3>
          <ul className="space-y-2 text-[#02066F] text-sm sm:text-base">
            <li>Upper Ground Floor, Back Side</li>
            <li>Building No. M-77, Block-M, Shyam Park</li>
            <li>Uttam Nagar, New Delhi - 110059</li>
            <a href="tel:+91 9310701078">
              <li className="mt-2"> 📞 +91 9310701078</li>
            </a>

            <a href="mailto:support@bulkwala.com">
              <li>✉ support@bulkwala.com</li>
            </a>
          </ul>
        </div>

        {/* 4️⃣ Policies */}
        <div>
          <h3 className="text-lg text-[#02066F] font-semibold mb-3">
            Policies
          </h3>
          <ul className="space-y-2 text-[#02066F] text-sm sm:text-base">
            <li>
              <Link to="/terms-and-conditions" className="hover:underline">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:underline">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link to="/refund-and-return-policy" className="hover:underline">
                Refund & Return Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-400 my-6" />

      {/* Bottom Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[#02066F] text-xs sm:text-sm gap-4 sm:gap-0">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} Bulkwala.com. All rights reserved.
        </p>

        <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-4">
          <span className="text-[#02066F] font-medium">We accept:</span>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
            alt="Visa"
            className="h-4 sm:h-5"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
            alt="MasterCard"
            className="h-4 sm:h-5"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Rupay-Logo.png/960px-Rupay-Logo.png?20200811062726"
            alt="Rupay"
            className="h-4 sm:h-5 w-10 sm:w-12 object-cover"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6f/UPI_logo.svg"
            alt="UPI"
            className="h-4 sm:h-5"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg"
            alt="Paytm"
            className="h-4 sm:h-5"
          />
        </div>
      </div>
    </footer>
  );
}
