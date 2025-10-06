import React, { useState, useEffect } from "react";
import imgs from "../assets/images/personaluri-inplacia.png";
import imgskalk from "../assets/images/spi-kalkulatori.jpg";
import basketImg from "../assets/images/bascket.svg";
import pressImg from "../assets/images/icon.svg";
import InfoModal from "./InfoModal";
import ErrorDisplay from "./ErrorDisplay";
import { LoadingButton } from "./LoadingSpinner";
import api, { withLoading } from "../api";

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
  const prevMonth = today.getMonth() === 0 ? 12 : today.getMonth();
  const prevMonthYear =
    today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

  const [year, setYear] = useState(prevMonthYear.toString());
  const [month, setMonth] = useState(prevMonth.toString());
  const [compareTo, setCompareTo] = useState("prevYear");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultText, setResultText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    if (!month) return;

    let calculated = null;

    try {
      await withLoading(
        async () => {
          // Left Panel
          if (compareTo === "prevMonth") {
            const response = await api.get(`/groupindex/${year}/${month}/0/0`);
            const index_now = response.data[0].index;

            const month_old = month == 1 ? 12 : month - 1;
            const year_old = month_old == 12 ? year - 1 : year;

            const response2 = await api.get(
              `/groupindex/${year_old}/${month_old}/0/0`
            );
            const index_now2 = response2.data[0].index;

            calculated = ((index_now / index_now2) * 100 - 100).toFixed(2);
          } else if (compareTo === "prevYear") {
            const response = await api.get(`/groupindex/${year}/${month}/0/0`);
            const index_now = response.data[0].index;

            const year_old = parseInt(year) - 1;
            const month_old = parseInt(month);

            const response2 = await api.get(
              `/groupindex/${year_old}/${month_old}/0/0`
            );
            const index_now2 = response2.data[0].index;

            calculated = ((index_now / index_now2) * 100 - 100).toFixed(2);
          }

          // Group weight
          const response = await api.get(`/groupweight/${year}/1`);
          localStorage.setItem("result", JSON.stringify(response.data));
          window.dispatchEvent(new Event("storage"));

          // Right Panel
          const groupindex_now = (
            await api.get(`/groupindexrightpanel/${year}/${month}/1`)
          ).data;
          let groupindex_year_old =
            compareTo === "prevYear"
              ? parseInt(year) - 1
              : month == 1
              ? year - 1
              : year;
          let groupindex_month_old =
            compareTo === "prevYear"
              ? parseInt(month)
              : month == 1
              ? 12
              : month - 1;

          const groupindex_old = (
            await api.get(
              `/groupindexrightpanel/${groupindex_year_old}/${groupindex_month_old}/1`
            )
          ).data;
          const groupindex_calculated = groupindex_now.map((g, i) =>
            ((g.index / groupindex_old[i].index) * 100 - 100).toFixed(2)
          );
          localStorage.setItem(
            "groupindex_pricechanges",
            JSON.stringify(groupindex_calculated)
          );
          window.dispatchEvent(new Event("storage"));

          // Charts
          const groupweightchart = (await api.get(`/groupweightchart/${year}`))
            .data;
          localStorage.setItem(
            "groupweightchart",
            JSON.stringify(groupweightchart)
          );
          window.dispatchEvent(new Event("storage"));

          const groupindex2_now = (
            await api.get(`/groupindexrightpanel/${year}/${month}/2`)
          ).data;
          const groupindex2_old = (
            await api.get(
              `/groupindexrightpanel/${groupindex_year_old}/${groupindex_month_old}/2`
            )
          ).data;

          groupindex2_now.forEach((_, i) => {
            groupindex2_now[i].index = (
              (groupindex2_now[i].index / groupindex2_old[i].index) * 100 -
              100
            ).toFixed(2);
          });
          localStorage.setItem(
            "groupindexchart",
            JSON.stringify(groupindex2_now)
          );
          window.dispatchEvent(new Event("localStorageUpdated"));

          // Result text
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
        },
        setLoading,
        setError
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setResultText(
        language === "GE"
          ? "დაფიქსირდა შეცდომა მონაცემების მიღებისას"
          : "Error fetching data"
      );
    }
  };

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* Title + Info Icon */}
      <div className="flex flex-col items-center gap-2">
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
        <p className="text-md sm:text-lg text-gray-700 font-bpg-nino text-center">
          {language === "GE" ? "დროის პერიოდი" : "TIME PERIOD"}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorDisplay
          error={error}
          onRetry={handleCalculate}
          language={language}
        />
      )}

      {/* Dropdown filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm font-bpg-nino w-full cursor-pointer"
        >
          {Array.from({ length: 2025 - 2004 + 1 }, (_, i) => 2025 - i).map(
            (y) => (
              <option key={y} value={y}>
                {y}
              </option>
            )
          )}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm font-bpg-nino w-full cursor-pointer"
        >
          <option value="" disabled>
            {language === "GE" ? "თვე" : "Month"}
          </option>
          {months[language === "GE" ? "GE" : "EN"].map((m, i) => {
            const monthValue = i + 1;
            const isCurrentYear = parseInt(year) === today.getFullYear();
            return (
              <option
                key={i}
                value={monthValue}
                disabled={isCurrentYear && monthValue > prevMonth}
              >
                {m}
              </option>
            );
          })}
        </select>

        <select
          value={compareTo}
          onChange={(e) => setCompareTo(e.target.value)}
          className="col-span-1 sm:col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm font-bpg-nino w-full cursor-pointer"
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

      <div>
        <LoadingButton
          loading={loading}
          onClick={handleCalculate}
          language={language}
          className="w-full bg-gray-300 text-gray-700 py-3 rounded-md hover:bg-[#0080be] hover:text-white cursor-pointer transition duration-200 font-bpg-nino text-base"
        >
          {language === "GE" ? "განახლება" : "Update"}
        </LoadingButton>
      </div>

      {resultText && (
        <div className="text-center text-sm sm:text-base text-gray-700 font-bpg-nino">
          {resultText}
        </div>
      )}

      <div className="space-y-3">
        <a
          href="https://www.geostat.ge/ka/relationsOfCategory/25/post"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-[#0080be] hover:text-white cursor-pointer transition duration-200 text-sm sm:text-sm rounded-md font-bpg-nino">
            <img
              src={basketImg}
              alt="Basket"
              className="w-5 h-5 object-contain"
            />
            <span>
              {language === "GE" ? "სამომხმარებლო კალათა" : "Consumer Basket"}
            </span>
          </button>
        </a>

        <a
          href="https://www.geostat.ge/media/68233/%E1%83%98%E1%83%9C%E1%83%A4%E1%83%9A%E1%83%90%E1%83%AA%E1%83%98%E1%83%98%E1%83%A1-%E1%83%92%E1%83%90%E1%83%90%E1%83%9C%E1%83%92%E1%83%90%E1%83%A0%E1%83%98%E1%83%A8%E1%83%94%E1%83%91%E1%83%98%E1%83%A1-%E1%83%9B%E1%83%94%E1%83%97%E1%83%9D%E1%83%93%E1%83%9D%E1%83%9A%E1%83%9D%E1%83%92%E1%83%98%E1%83%98%E1%83%A1-%E1%83%A8%E1%83%94%E1%83%A1%E1%83%90%E1%83%AE%E1%83%94%E1%83%91_2025.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-[#0080be] hover:text-white cursor-pointer transition duration-200 text-sm sm:text-sm rounded-md font-bpg-nino">
            <img
              src={pressImg}
              alt="Press"
              className="w-5 h-5 object-contain"
            />
            <span>{language === "GE" ? "პრეს რელიზი" : "Press Release"}</span>
          </button>
        </a>
      </div>

      <div className="space-y-4">
        <div className="w-full bg-[#e9e7e7] hover:bg-[#0080be] hover:text-white cursor-pointer transition duration-200 rounded-md overflow-hidden">
          <img src={imgs} alt="icon" className="w-full h-auto object-cover" />
          <a
            href="https://www.geostat.ge/personalinflation/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-center text-sm sm:text-xs py-3 font-bpg-nino">
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
          <a
            href="https://www.geostat.ge/cpi/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-center text-sm sm:text-xs py-3 font-bpg-nino">
              {language === "GE" ? "სფი კალკულატორი" : "CPI CALCULATOR"}
            </p>
          </a>
        </div>
      </div>

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
