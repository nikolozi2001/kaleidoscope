import React from "react";
import { Link } from "react-router-dom";
import sakstatLogoGe from "../assets/images/sakstat-logo.svg";
import sakstatLogoEn from "../assets/images/sakstat-logo-en.png";
import georgianFlag from "../assets/images/georgian-flag.svg";
import britishFlag from "../assets/images/british-flag.png";
import headerBg from "../assets/images/header-bg.jpg";

const Header = (props) => {
  const language = props.language || "GE";
  const setLanguage = props.setLanguage || (() => {});
  const page = props.page;

  const fontClass = language === "GE" ? "font-bpg-nino" : "font-poppins";

  const toggleLanguage = () => {
    setLanguage(language === "GE" ? "EN" : "GE");
  };

  return (
    <header
      className={`sticky top-0 z-50 shadow-md px-2 md:px-8 py-2 md:py-5 flex flex-col md:flex-row items-center gap-2 md:gap-4 ${fontClass}`}
      style={{
        backgroundImage: `url(${headerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center">
        <Link to="https://www.geostat.ge/ka" aria-label="Home">
          <img
            src={language === "GE" ? sakstatLogoGe : sakstatLogoEn}
            alt="Logo"
            className="h-8 md:h-20 hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </Link>
      </div>

      <div className="flex-1 flex justify-center">
        <h1 className="text-lg md:text-2xl font-semibold text-white text-center transition-colors duration-300 [letter-spacing:4px]">
          {language === "GE" ? 'ფასების კალეიდოსკოპი' : 'PRICE KALEIDOSCOPE'}
        </h1>
      </div>

      <div className="flex flex-col items-center md:items-end gap-2 md:gap-3 w-full md:w-auto">
        <div className="flex items-center justify-center md:justify-end gap-2 w-full md:w-auto">
          <button
            onClick={toggleLanguage}
            className={`flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-md transition-all duration-300 ${
              language === "GE" ? "bg-gray-400" : "bg-gray-400"
            } hover:bg-gray-400/50 hover:shadow-sm`}
            aria-label="Toggle language"
          >
            <img
              src={language === "GE" ? britishFlag : georgianFlag}
              alt="Language flag"
              className="h-5 w-5 md:h-6 md:w-6"
            />
            <span className="text-xs md:text-sm text-white cursor-pointer bpg_mrgvlovani_caps">
              {language === "GE" ? "English" : "ქართული"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
