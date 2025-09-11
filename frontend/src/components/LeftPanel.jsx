import React, { useState, useEffect } from "react";
import imgs from "../assets/images/personaluri-inplacia.png";
import imgskalk from "../assets/images/spi-kalkulatori.jpg";
import basketImg from "../assets/images/bascket.svg";
import pressImg from "../assets/images/icon.svg";
import InfoModal from "./InfoModal";
import axios from "axios";

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
  const today = new Date();
  const prevMonth = today.getMonth() === 0 ? 12 : today.getMonth(); // 1–12
  const prevMonthYear =
    today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

  const [year, setYear] = useState(prevMonthYear.toString());
  const [month, setMonth] = useState(prevMonth.toString());
  const [compareTo, setCompareTo] = useState("prevYear");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultText, setResultText] = useState("");

  const handleCalculate = async () => {
    if (!month) return;

    let calculated = null;

    try {
      // Left Panel
      if (compareTo === "prevMonth") {
        const response = await axios.get(
          `http://localhost:5000/api/groupindex/${year}/${month}/0/0`
        );
        const index_now = response.data[0].index;

        const month_old = month == 1 ? 12 : month - 1;
        const year_old = month_old == 12 ? year - 1 : year;

        const response2 = await axios.get(
          `http://localhost:5000/api/groupindex/${year_old}/${month_old}/0/0`
        );
        const index_now2 = response2.data[0].index;

        calculated = ((index_now / index_now2) * 100 - 100).toFixed(2);
      }

      if (compareTo === "prevYear") {
        const response = await axios.get(
          `http://localhost:5000/api/groupindex/${year}/${month}/0/0`
        );
        const index_now = response.data[0].index;

        const year_old = parseInt(year) - 1;
        const month_old = parseInt(month);

        const response2 = await axios.get(
          `http://localhost:5000/api/groupindex/${year_old}/${month_old}/0/0`
        );
        const index_now2 = response2.data[0].index;

        calculated = ((index_now / index_now2) * 100 - 100).toFixed(2);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResultText(
        language === "GE"
          ? "დაფიქსირდა შეცდომა მონაცემების მიღებისას"
          : "Error fetching data"
      );
      return;
    }

    const level = 1;

    const response = await axios.get(
      `http://localhost:5000/api/groupweight/${year}/${level}`
    );

    // Save in localStorage
    localStorage.setItem("result", JSON.stringify(response.data));

    // Also update state (if you need it immediately in the UI)
    window.dispatchEvent(new Event("storage")); // notify other components

    // Right Panel
    const response_groupindex = await axios.get(
      `http://localhost:5000/api/groupindexrightpanel/${year}/${month}/1`
    );
    const groupindex_now = response_groupindex.data;

    let groupindex_year_old = 0;
    let groupindex_month_old = 0;

    if (compareTo === "prevMonth") {
      groupindex_month_old = month == 1 ? 12 : month - 1;
      groupindex_year_old = groupindex_month_old == 12 ? year - 1 : year;
    } else if (compareTo === "prevYear") {
      groupindex_year_old = parseInt(year) - 1;
      groupindex_month_old = parseInt(month);
    }

    const response_groupindex_old = await axios.get(
      `http://localhost:5000/api/groupindexrightpanel/${groupindex_year_old}/${groupindex_month_old}/1`
    );
    const groupindex_old = response_groupindex_old.data;

    let groupindex_calculated = [];
    groupindex_now.forEach((_, i) => {
      groupindex_calculated.push(
        (
          (groupindex_now[i].index / groupindex_old[i].index) * 100 -
          100
        ).toFixed(2)
      );
    });

    // Save in localStorage
    localStorage.setItem(
      "groupindex_pricechanges",
      JSON.stringify(groupindex_calculated)
    );

    // Also update state (if you need it immediately in the UI)
    window.dispatchEvent(new Event("storage")); // notify other components

    // Chart
    const response_groupweightchart = await axios.get(
      `http://localhost:5000/api/groupweightchart/${year}`
    );

    // Save in localStorage
    localStorage.setItem(
      "groupweightchart",
      JSON.stringify(response_groupweightchart.data)
    );

    // Also update state (if you need it immediately in the UI)
    window.dispatchEvent(new Event("storage")); // notify other components


    // Chart
    const response_groupindex2 = await axios.get(
      `http://localhost:5000/api/groupindexrightpanel/${year}/${month}/2`
    );
    const groupindex2_now = response_groupindex2.data;

    let groupindex2_year_old = 0;
    let groupindex2_month_old = 0;

    if (compareTo === "prevMonth") {
      groupindex2_month_old = month == 1 ? 12 : month - 1;
      groupindex2_year_old = groupindex2_month_old == 12 ? year - 1 : year;
    } else if (compareTo === "prevYear") {
      groupindex2_year_old = parseInt(year) - 1;
      groupindex2_month_old = parseInt(month);
    }

    const response_groupindex2_old = await axios.get(
      `http://localhost:5000/api/groupindexrightpanel/${groupindex2_year_old}/${groupindex2_month_old}/2`
    );
    const groupindex2_old = response_groupindex2_old.data;

    groupindex2_now.forEach((_, i) => {
      groupindex2_now[i].index = ((groupindex2_now[i].index / groupindex2_old[i].index) * 100 - 100).toFixed(2)
    });

    // Save in localStorage
    localStorage.setItem(
      "groupindexchart",
      JSON.stringify(groupindex2_now)
    );

    // Also update state (if you need it immediately in the UI)
    window.dispatchEvent(new Event("storage")); // notify other components

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
        `${year} წლის ${selectedMonthNameLocative} ინფლაციის დონემ ${comparison} შედარებით შეადგინა ${calculated}%`
      );
    } else {
      const comparison =
        compareTo === "prevYear"
          ? "compared to the same month last year"
          : "compared to previous month";
      setResultText(
        `In ${selectedMonthName} ${year} the inflation rate ${comparison} amounted to ${calculated}%`
      );
    }
  };

  // Run calculation only on first mount
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty dependency array ensures it runs only once

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* Title + Info Icon */}
      <div className="flex flex-col items-center gap-2">
        {/* Title with info button */}
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-lg sm:text-xl text-gray-800 font-bpg-nino text-center whitespace-nowrap">
            {language === "GE"
              ? "გაანგარიშების ინსტრუქცია"
              : "CALCULATION INSTRUCTION"}
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
        {/* Subtitle below */}
        <p className="text-md sm:text-lg text-gray-700 font-bpg-nino text-center">
          {language === "GE" ? "დროის პერიოდი" : "TIME PERIOD"}
        </p>
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
          <option value="" disabled>
            {language === "GE" ? "თვე" : "Month"}
          </option>
          {months[language === "GE" ? "GE" : "EN"].map((monthName, index) => {
            const monthValue = index + 1;
            const isCurrentYear = parseInt(year) === today.getFullYear();

            return (
              <option
                key={index}
                value={monthValue}
                disabled={isCurrentYear && monthValue > prevMonth} // ⬅ block only in current year
              >
                {monthName}
              </option>
            );
          })}
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
          <img src={pressImg} alt="Press" className="w-5 h-5 object-contain" />
          <span>{language === "GE" ? "პრეს რელიზი" : "Press Release"}</span>
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <div className="w-full bg-[#e9e7e7] hover:bg-[#0080be] hover:text-white cursor-pointer transition duration-200 rounded-md overflow-hidden">
          <img src={imgs} alt="icon" className="w-full h-auto object-cover" />
          <a href="https://www.geostat.ge/personalinflation/" target="_blank">
            <p className="text-center text-sm sm:text-base py-3 font-bpg-nino">
              {language === "GE"
                ? "პერსონალური ინფლაციის კალკულატორი"
                : "PERSONAL INFLATION CALCULATOR"}
            </p>
          </a>
        </div>

        <div className="w-full bg-[#e9e7e7] hover:bg-[#0080be] hover:text-white cursor-pointer transition duration-200 rounded-md overflow-hidden">
          <img
            src={imgskalk}
            alt="icon"
            className="w-full h-auto object-cover"
          />
          <a href="https://www.geostat.ge/cpi/" target="_blank">
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
