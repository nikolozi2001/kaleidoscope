import React, { useState } from "react";
import imgs from "../assets/images/personaluri-inplacia.png";
import imgskalk from "../assets/images/spi-kalkulatori.jpg";
import basketImg from "../assets/images/bascket.svg";
import pressImg from "../assets/images/icon.svg";
import InfoModal from "./InfoModal";

const months = {
  GE: [
    "იანვარი",
    "თებერვალი",
    "მარტი",
    "აპრილი",
    "მაისი",
    "ივნისი",
    "ივლისი",
    "აგვისტო",
    "სექტემბერი",
    "ოქტომბერი",
    "ნოემბერი",
    "დეკემბერი",
  ],
  GE_LOCATIVE: [
    "იანვარში",
    "თებერვალში",
    "მარტში",
    "აპრილში",
    "მაისში",
    "ივნისში",
    "ივლისში",
    "აგვისტოში",
    "სექტემბერში",
    "ოქტომბერში",
    "ნოემბერში",
    "დეკემბერში",
  ],
  EN: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

const LeftPanel = ({ language }) => {
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("");
  const [compareTo, setCompareTo] = useState("prevMonth");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultText, setResultText] = useState("");

  const handleCalculate = () => {
    if (!month) return;

    const selectedMonthName =
      months[language === "GE" ? "GE" : "EN"][parseInt(month) - 1] || "";

    const selectedMonthNameLocative =
      months["GE_LOCATIVE"][parseInt(month) - 1] || "";

    if (language === "GE") {
      const comparison =
        compareTo === "prevYear"
          ? "წინა წლის შესაბამის თვესთან"
          : "წინა თვესთან";
      setResultText(
        `${year} წლის ${selectedMonthNameLocative} ${comparison} ინდექსი გაიზარდა 0.43%`
      );
    } else {
      const comparison =
        compareTo === "prevYear"
          ? "compared to the same month last year"
          : "compared to previous month";
      setResultText(
        `Index increased by 0.43% in ${selectedMonthName} ${year}, ${comparison}`
      );
    }
  };

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* Title + Info Icon */}
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-lg sm:text-xl text-gray-800 font-bpg-nino text-center">
          {language === "GE"
            ? "გაანგარიშების ინსტრუქცია"
            : "CALCULATION INSTRUCTION "}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-black hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Information"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm font-bpg-nino w-full"
        >
          {Array.from({ length: 2025 - 2004 + 1 }, (_, i) => {
            const y = 2025 - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm font-bpg-nino w-full"
        >
          <option value="">{language === "GE" ? "თვე" : "Month"}</option>
          {months[language === "GE" ? "GE" : "EN"].map((monthName, index) => (
            <option key={index} value={index + 1}>
              {monthName}
            </option>
          ))}
        </select>

        <select
          value={compareTo}
          onChange={(e) => setCompareTo(e.target.value)}
          className="col-span-1 sm:col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm font-bpg-nino w-full"
        >
          <option value="prevYear">
            {language === "GE"
              ? "წინა წლის შესაბამის თვესთან შედარებით"
              : "Compared to same month last year"}
          </option>
          <option value="prevMonth">
            {language === "GE"
              ? "წინა თვესთან შედარებით"
              : "Compared to previous month"}
          </option>
        </select>
      </div>

      {/* Button */}
      <div>
        <button
          onClick={handleCalculate}
          className="w-full bg-gray-300 text-gray-700 py-3 rounded-md hover:bg-[#0080be] hover:text-white cursor-pointer transition duration-200 font-bpg-nino text-base"
        >
          {language === "GE" ? "განახლება" : "Update"}
        </button>
      </div>

      {/* Result message */}
      {resultText && (
        <div className="text-center text-sm sm:text-base text-gray-700 font-bpg-nino">
          {resultText}
        </div>
      )}

      {/* Accordion-style buttons */}
      <div className="space-y-3">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-[#0080be] hover:text-white cursor-pointer transition duration-200 text-sm sm:text-base rounded-md font-bpg-nino">
          {/* Basket Icon */}
          <img
            src={basketImg}
            alt="Basket"
            className="w-5 h-5 object-contain"
          />
          <span>
            {language === "GE" ? "სამომხმარებლო კალათა" : "Consumer Basket"}
          </span>
        </button>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-[#0080be] hover:text-white cursor-pointer transition duration-200 text-sm sm:text-base rounded-md font-bpg-nino">
          {/* Press Icon */}
          <img src={pressImg} alt="Press" className="w-5 h-5 object-contain" />
          <span>{language === "GE" ? "პრეს რელიზი" : "Press Release"}</span>
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {/* Card 1 */}
        <div className="w-full bg-[#e9e7e7] hover:bg-[#0080be] hover:text-white cursor-pointer transition duration-200 rounded-md overflow-hidden">
          <img src={imgs} alt="icon" className="w-full h-auto object-cover" />
          <a href="https://www.geostat.ge/personalinflation/" target="blank">
            <p className="text-center text-sm sm:text-base py-3 font-bpg-nino">
              {language === "GE"
                ? "პერსონალური ინფლაციის კალკულატორი"
                : "PERSONAL INFLATION CALCULATOR"}
            </p>
          </a>
        </div>

        {/* Card 2 */}
        <div className="w-full bg-[#e9e7e7] hover:bg-[#0080be] hover:text-white cursor-pointer transition duration-200 rounded-md overflow-hidden">
          <img
            src={imgskalk}
            alt="icon"
            className="w-full h-auto object-cover"
          />
          <a href="https://www.geostat.ge/cpi/" target="blank">
            <p className="text-center text-sm sm:text-base py-3 font-bpg-nino">
              {language === "GE" ? "სფი კალკულატორი" : "CPI CALCULATOR"}
            </p>
          </a>
        </div>
      </div>

      {/* Modal rendering */}
      {isModalOpen && (
        <InfoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          language={language}
        />
      )}
    </div>
  );
};

export default LeftPanel;
