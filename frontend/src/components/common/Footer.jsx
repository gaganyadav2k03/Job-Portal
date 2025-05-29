import { SiGamedeveloper } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white text-center p-4 mt-auto">
      <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
      <p className="flex justify-center items-center space-x-2">
        <SiGamedeveloper className="text-orange-500" />
        Developer :<span className="text-orange-500 ml-2">Ranjan Chauhan</span>
      </p>
    </footer>
  );
};

export default Footer;
