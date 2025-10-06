import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { voronoiTreemap } from "d3-voronoi-treemap";

import imgs1 from "../assets/images/food.png";
import imgs2 from "../assets/images/alcohol.png";
import imgs3 from "../assets/images/clothes.png";
import imgs4 from "../assets/images/home.png";
import imgs5 from "../assets/images/fridge.png";
import imgs6 from "../assets/images/health.png";
import imgs7 from "../assets/images/transport.png";
import imgs8 from "../assets/images/mobile.png";
import imgs9 from "../assets/images/vacation.png";
import imgs10 from "../assets/images/education.png";
import imgs11 from "../assets/images/hotel.png";
import imgs12 from "../assets/images/goods.png";

const legendValues = [-24, -12, -6, -2, 0, 2, 6, 12, 24];
const legendColors = [
  "rgb(51, 51, 102)",
  "rgb(51, 102, 204)",
  "#66ccff",
  "#c1eaff",
  "#d8e3e8",
  "#fffadf",
  "#ffcc33",
  "#ff9900",
  "#ff6600",
  "rgb(204, 0, 51)",
];

const categoryCollapsesMap = {
  1: ["11", "12"],
  2: ["21", "22"],
  3: ["31", "32"],
  4: ["41", "43", "44", "45"],
  5: ["51", "52", "53", "54", "55", "56"],
  6: ["61", "62", "63"],
  7: ["71", "72", "73"],
  8: ["82", "83"],
  9: ["91", "92", "93", "94", "95", "96"],
  10: ["101", "102", "103", "105"],
  11: ["111", "112"],
  12: ["121", "123", "125", "126", "127"],
};

//  build hierarchy from parsed3 using categoryCollapsesMap
const buildHierarchy = (data) => {
  return {
    children: Object.entries(categoryCollapsesMap).map(([cat, subCodes]) => {
      return {
        code: cat,
        children: data
          .filter((d) => subCodes.includes(String(d.code)))
          .map((d) => ({ ...d })),
      };
    }),
  };
};

const RightPanel = ({ language }) => {
  const svgRef = useRef();
  const [parsed, setParsed] = useState([]);
  const [parsed2, setParsed2] = useState([]);
  const [parsed3, setParsed3] = useState([]);
  const [parsed4, setParsed4] = useState([]);
  const allCellsRef = useRef();
  const rootRef = useRef(); // keep hierarchy root for highlighting

  // Load data
  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem("result");
      if (saved) setParsed(JSON.parse(saved));

      const saved2 = localStorage.getItem("groupindex_pricechanges");
      if (saved2) setParsed2(JSON.parse(saved2));

      const saved3 = localStorage.getItem("groupweightchart");
      const saved4 = localStorage.getItem("groupindexchart");

      let parsed3Data = saved3 ? JSON.parse(saved3) : [];
      let parsed4Data = saved4 ? JSON.parse(saved4) : [];

      parsed3Data.forEach((item1) => {
        const match = parsed4Data.find((item2) => item2.code === item1.code);
        if (match) item1.index = match.index;
      });

      setParsed3(parsed3Data);
      setParsed4(parsed4Data);
    };

    loadData();
    window.addEventListener("localStorageUpdated", loadData);
    return () => window.removeEventListener("localStorageUpdated", loadData);
  }, []);

  // Prepare left and right categories with weight & priceChange
  const prepareCategories = () => {
    const left = parsed.slice(0, 6).map((item, i) => ({
      code: `${i + 1}`,
      icon: [imgs1, imgs2, imgs3, imgs4, imgs5, imgs6][i],
      title: [
        language === "GE"
          ? "სურსათი და უალკოჰოლო სასმელები"
          : "FOOD AND NON-ALCOHOLIC BEVERAGES",
        language === "GE"
          ? "ალკოჰოლური სასმელები, თამბაქო"
          : "ALCOHOLIC BEVERAGES AND TOBACCO",
        language === "GE"
          ? "ტანსაცმელი და ფეხსაცმელი"
          : "CLOTHING AND FOOTWEAR",
        language === "GE"
          ? "საცხოვრებელი სახლი, წყალი,ელექტროენერგია, აირი და სათბობის სხვა სახეები"
          : "Housing, water, electricity, gas and other fuels",
        language === "GE"
          ? "ავეჯი, საოჯახო ნივთებიდა მორთულობა, სახლის მოვლა-შეკეთება"
          : "Furnishings, household equipment and routine maintenance",
        language === "GE" ? "ჯანმრთელობის დაცვა" : "HEALTHCARE",
      ][i],
      description: [
        language === "GE"
          ? "სურსათი, უალკოჰოლო სასმელები"
          : "Food, Non-Alcoholic Beverages",
        language === "GE"
          ? "ალკოჰოლური სასმელები, თამბაქოს ნაწარმი"
          : "Alcoholic Beverages, Tobacco",
        language === "GE" ? "ტანსაცმელი,ფეხსაცმელი" : "Clothing,Footwear",
        language === "GE"
          ? "გადასახადი საცხოვრებელზე; ელექტროენერგია, აირი და სათბობის სხვა სახეები; წყალმომარაგება; საცხოვრებლის მოვლა-შეკეთება და სხვა"
          : "Actual rentals for housing; Maintenance and repair of the dwelling; Water supply and miscellaneous services relating to the dwelling; Electricity, gas and other fuels",
        language === "GE"
          ? "ავეჯი და საოჯახო ნივთები; საყოფაცხოვრებო საქონელი; მაცივრები, სარეცხი მანქანები; ჭურჭელი, და სხვა."
          : "Furniture, furnishings, etc.; Household textiles; Household appliances; Glassware, tableware and household utensils;Tools and equipment for house and garden; Goods and services for routine household maintenance",
        language === "GE"
          ? "მედიკამენტები, სამედიცინო პროდუქცია; სამედიცინო მომსახურება"
          : "Medical products, appliances and equipment; Out-patient services;Hospital services",
      ][i],
      annualGrowth: item?.weight
        ? `${(Number(item.weight) * 100).toFixed(2)}%`
        : "N/A",
      priceChange: parsed2[i] ? `${parsed2[i]}%` : "N/A",
    }));

    const right = parsed.slice(6, 12).map((item, i) => ({
      code: `${i + 7}`,
      icon: [imgs7, imgs8, imgs9, imgs10, imgs11, imgs12][i],
      title: [
        language === "GE" ? "ტრანსპორტი" : "TRANSPORT",
        language === "GE" ? "კავშირგაბმულობა" : "COMMUNICATION",
        language === "GE"
          ? "დასვენება, გართობა და კულტურა"
          : "RECREATION AND CULTURE",
        language === "GE" ? "განათლება" : "EDUCATION",
        language === "GE"
          ? "სასტუმროები, კაფეები და რესტორნები"
          : "HOTELS, CAFES AND RESTAURANTS",
        language === "GE"
          ? "სხვადასხვა საქონელი და მომსახურება"
          : "MISCELLANEOUS GOODS AND SERVICES",
      ][i],
      description: [
        language === "GE"
          ? "სატრანსპორტო საშუალებების შეძენა და ექსპლუატაცია; სატრანსპორტო მომსახურება"
          : "Purchase and operation of transport vehicles; transport services",
        language === "GE"
          ? "სატელეფონო მოწყობილობები და საკომუნიკაციო მომსახურება"
          : "Telephone and telefax equipment; Telephone and telefax services",
        language === "GE"
          ? "ფოტოგრაფიული და კომპიუტერული მოწყობილობები; გასართობი და კულტურული მომსახურება; ტურისტული მოგზაურობა; დასვენების, გართობისა და კულტურის სფეროს საქონელი და სხვა"
          : "Audio-visual and information processing equipment; Other major durables for recreation and culture;Other recreational items and equipment, gardens and pets;Recreational and cultural services;Newspapers, books and stationery; journey",
        language === "GE"
          ? "სკოლამდელი, დაწყებითი, საშუალო და უმაღლესი განათლება, დონით განუსაზღვრელი განათლება"
          : "Pre-primary and primary education; Secondary education;Post-secondary non-tertiary education; Education not definable by level",
        language === "GE"
          ? "რესტორნების, კაფეებისა და სასტუმროების მომსახურება"
          : "Catering services;Accommodation services",
        language === "GE"
          ? "პირადი ჰიგიენა; პირადი ნივთები; ჯანმრთელობის დაზღვევა; საფინანსო მომსახურება"
          : "Personal care;Personal effects n.e.c.; Insurance;Financial services n.e.c.; Other services n.e.c.",
      ][i],
      annualGrowth: item?.weight
        ? `${(Number(item.weight) * 100).toFixed(2)}%`
        : "N/A",
      priceChange: parsed2[i + 6] ? `${parsed2[i + 6]}%` : "N/A",
    }));

    return { left, right };
  };

  const { left: categoriesLeft, right: categoriesRight } = prepareCategories();

  // Highlight functions
  const highlightCategory = (code) => {
    const root = rootRef.current;
    if (!root) return;

    const categoryNode = root.children.find(
      (c) => c.data.code === String(code)
    );
    if (!categoryNode) return;

    const leafCodes = categoryNode.leaves().map((d) => String(d.data.code));

    allCellsRef.current
      .attr("stroke", "#9ca3af")
      .attr("stroke-width", 3)
      .attr("opacity", 0.7);

    allCellsRef.current
      .filter((d) => leafCodes.includes(String(d.data.code)))
      .attr("stroke", "white")
      .attr("stroke-width", 7)
      .attr("opacity", 1);
  };

  const resetHighlight = () => {
    allCellsRef.current
      .attr("stroke", "#9ca3af")
      .attr("stroke-width", 3)
      .attr("opacity", 0.7);
  };

  // Voronoi Treemap
  useEffect(() => {
    if (!parsed3 || parsed3.length === 0) return;

    const hierarchyData = buildHierarchy(parsed3);

    const w = 500;
    const h = 500;
    const padding = 20;
    const radius = Math.min(w, h) / 2 - padding;

    const circleClip = d3.range(80).map((i) => {
      const angle = (i / 80) * 2 * Math.PI;
      return [
        w / 2 + radius * Math.cos(angle),
        h / 2 + radius * Math.sin(angle),
      ];
    });

    const radiusWhite = Math.min(w, h) / 2.03 - padding;

    const root = d3
      .hierarchy(hierarchyData)
      .sum((d) => +d.weight || 0)
      .sort((a, b) => b.value - a.value);

    rootRef.current = root;

    const vt = voronoiTreemap().clip(circleClip);
    vt(root);

    const nodes = root.leaves();
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", w).attr("height", h).attr("viewBox", `0 0 ${w} ${h}`);

    const g = svg.append("g");

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "rgba(255,255,255,0.9)")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("font-family", "BPG Nino Mtavruli")
      .style("pointer-events", "none")
      .style("display", "none")
      .style("z-index", 1000);

    const allCells = g
      .selectAll("path")
      .data(nodes)
      .enter()
      .append("path")
      .attr("d", (d) => "M" + d.polygon.join("L") + "Z")
      .attr("fill", (d) => {
        let val = d.data.index || 0;
        if (val <= legendValues[0]) return legendColors[0];
        if (val >= legendValues[legendValues.length - 1])
          return legendColors[legendColors.length - 1];
        for (let i = 0; i < legendValues.length - 1; i++) {
          if (val >= legendValues[i] && val < legendValues[i + 1]) {
            return legendColors[i + 1];
          }
        }
        return "#ccc";
      })
      .attr("opacity", 0.7)
      .attr("stroke", "#9ca3af") // gray outer border always visible
      .attr("stroke-width", 3)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke", "white").attr("stroke-width", 7);
        tooltip.style("display", "block").html(`
          ${language === "GE" ? d.data.title_geo : d.data.title_en}<br/>
          ${
            language === "GE"
              ? `ფასების ცვლილება: ${d.data.index || 0}%`
              : `Price change: ${d.data.index || 0}%`
          }<br/>
          ${
            language === "GE"
              ? `წონა: ${d.data.weight}%`
              : `Weight: ${d.data.weight}%`
          }
        `);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("stroke", "#9ca3af")
          .attr("stroke-width", 3)
          .attr("opacity", 0.7);
        tooltip.style("display", "none");
      });

    // add white inner border
    allCells
      .clone(true)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 2);

    allCellsRef.current = allCells;

    g.append("circle")
      .attr("cx", w / 2)
      .attr("cy", h / 2)
      .attr("r", radiusWhite)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 7);

    g.append("circle")
      .attr("cx", w / 2)
      .attr("cy", h / 2)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("stroke-width", 6);
  }, [parsed3]);

  return (
    <div className="flex flex-col sm:flex-row flex-1 p-4 gap-4">
      {/* LEFT PANEL */}
      <div className="w-full sm:w-1/4 flex flex-col gap-4 font-bpg-nino cursor-pointer">
        {categoriesLeft.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-white shadow rounded"
            onMouseEnter={() => highlightCategory(item.code)}
            onMouseLeave={resetHighlight}
          >
            <img
              src={item.icon}
              alt="icon"
              className="w-12 h-12 object-contain"
            />
            <div className="flex flex-col">
              <h2 className="font-bold text-gray-800 text-sm sm:text-base">
                {item.title}
              </h2>
              <div className="border-b border-dark gray-300 my-1"></div>
              <p className="text-gray-600 text-xs mb-1">{item.description}</p>
              <p className="text-gray-700 text-base font-poppins">
                {language === "GE"
                  ? `ჯგუფის წონა: ${item.annualGrowth}`
                  : `Group Weight: ${item.annualGrowth}`}
              </p>
              <p className="text-gray-700 text-base font-poppins">
                {language === "GE"
                  ? `ფასის ცვლილება: ${item.priceChange}`
                  : `Price Change: ${item.priceChange}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CHART + LEGEND */}
      <div className="w-full sm:w-1/2 flex flex-col items-center bg-gray-100 rounded min-h-[400px] p-4 max-w-full overflow-x-auto cursor-pointer">
        <svg ref={svgRef} className="w-full max-w-[550px] h-auto" />
        <div className="mt-4 flex flex-col items-center w-full max-w-[320px]">
          <div className="text-sm font-medium text-gray-700 mb-6 text-center">
            {language === "GE"
              ? `ფასების პროცენტული ცვლილება`
              : `Price Percentage Change`}
          </div>
          <div className="relative w-full max-w-[320px] h-4 rounded overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${legendColors.join(
                  ", "
                )})`,
                opacity: 0.7,
              }}
            ></div>
          </div>
          <div className="flex justify-between w-full max-w-[320px] mt-1 text-xs text-gray-600">
            {legendValues.map((val, idx) => (
              <span key={idx}>{val}</span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full sm:w-1/4 flex flex-col gap-4 font-bpg-nino cursor-pointer">
        {categoriesRight.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-white shadow rounded"
            onMouseEnter={() => highlightCategory(item.code)}
            onMouseLeave={resetHighlight}
          >
            <img
              src={item.icon}
              alt="icon"
              className="w-12 h-12 object-contain"
            />
            <div className="flex flex-col">
              <h2 className="font-bold text-gray-800 text-sm sm:text-base">
                {item.title}
              </h2>
              <div className="border-b border-dark gray-300 my-1"></div>
              <p className="text-gray-600 text-xs mb-1 ">{item.description}</p>
              <p className="text-gray-700 text-base font-poppins">
                {language === "GE"
                  ? `ჯგუფის წონა: ${item.annualGrowth}`
                  : `Group Weight: ${item.annualGrowth}`}
              </p>
              <p className="text-gray-700 text-base font-poppins">
                {language === "GE"
                  ? `ფასის ცვლილება: ${item.priceChange}`
                  : `Price Change: ${item.priceChange}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightPanel;
