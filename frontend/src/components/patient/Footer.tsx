import logo from "../../assets/icon/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#007E85] text-white py-10">
      <div className="container mx-auto flex flex-wrap md:justify-evenly">
        <div className="w-full md:w-auto mb-6 md:mb-0 mx-auto">
          <img src={logo} alt="" className="w-48" />
          <p>
            &copy; 2024 HelthCare
            <br />
            All Rights Reserved
          </p>
        </div>
        <div className="w-full md:w-auto mb-6 md:mb-0">
          <h3 className="text-xl mb-2">Product</h3>
          <ul>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Features
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Pricing
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Case studies
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Reviews
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Updates
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-auto mb-6 md:mb-0">
          <h3 className="text-xl mb-2">Company</h3>
          <ul>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                About
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Contact us
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Careers
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Culture
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Blog
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-auto mb-6 md:mb-0">
          <h3 className="text-xl mb-2">Support</h3>
          <ul>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Getting started
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Help center
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Server status
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Report a bug
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Chat support
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-auto mb-6 md:mb-0">
          <h3 className="text-xl mb-2">Follow us</h3>
          <ul>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Facebook
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Twitter
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                Instagram
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                LinkedIn
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:underline">
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
