import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Delaunay } from "d3-delaunay";

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

const legendRanges = [
  { value: -24, fill: "rgb(51, 51, 102)", fillOpacity: 0.7 },
  { value: -12, fill: "rgb(51, 102, 204)", fillOpacity: 0.7 },
  { value: -6, fill: "#66ccff", fillOpacity: 0.7 },
  { value: -2, fill: "#c1eaff", fillOpacity: 0.7 },
  { value: 0, fill: "#d8e3e8", fillOpacity: 0.7 },
  { value: 2, fill: "#fffadf", fillOpacity: 0.7 },
  { value: 6, fill: "#ffcc33", fillOpacity: 0.7 },
  { value: 12, fill: "#ff9900", fillOpacity: 0.7 },
  { value: 24, fill: "#ff6600", fillOpacity: 0.7 },
];

const getColorForValue = (value) => {
  for (let i = 0; i < legendRanges.length - 1; i++) {
    if (value >= legendRanges[i].value && value < legendRanges[i + 1].value) {
      return legendRanges[i];
    }
  }
  if (value >= legendRanges[legendRanges.length - 1].value) {
    return legendRanges[legendRanges.length - 1];
  }
  return legendRanges[0];
};

const RightPanel = ({ language }) => {
  const [parsed, setParsed] = useState([]);
  const [parsed2, setParsed2] = useState([]);
  const [parsed3, setParsed3] = useState([]); // groupweightchart
  const [parsed4, setParsed4] = useState([]); // groupindexchart

  const svgRef = useRef();

  // Load data initially + on event
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

      // merge index values into parsed3Data
      parsed3Data.forEach((item1) => {
        const match = parsed4Data.find((item2) => item2.code === item1.code);
        if (match) {
          item1.index = match.index;
        }
      });

      setParsed3(parsed3Data);
      setParsed4(parsed4Data);

      console.log(parsed3Data);
    };

    loadData();

    window.addEventListener("localStorageUpdated", loadData);
    return () => window.removeEventListener("localStorageUpdated", loadData);
  }, []);

  // weights
  let cl1 = parsed[0]?.weight;
  cl1 = cl1 ? `${(Number(cl1) * 100).toFixed(2)}%` : "N/A";

  let cl2 = parsed[1]?.weight;
  cl2 = cl2 ? `${(Number(cl2) * 100).toFixed(2)}%` : "N/A";

  let cl3 = parsed[2]?.weight;
  cl3 = cl3 ? `${(Number(cl3) * 100).toFixed(2)}%` : "N/A";

  let cl4 = parsed[3]?.weight;
  cl4 = cl4 ? `${(Number(cl4) * 100).toFixed(2)}%` : "N/A";

  let cl5 = parsed[4]?.weight;
  cl5 = cl5 ? `${(Number(cl5) * 100).toFixed(2)}%` : "N/A";

  let cl6 = parsed[5]?.weight;
  cl6 = cl6 ? `${(Number(cl6) * 100).toFixed(2)}%` : "N/A";

  const categoriesLeft = [
    {
      code: "1",
      icon: imgs1,
      title: "სურსათი და უალკოჰოლო სასმელები",
      description: "სურსათი, უალკოჰოლო სასმელები",
      annualGrowth: cl1,
    },
    {
      code: "2",
      icon: imgs2,
      title: "ალკოჰოლური სასმელები, თამბაქო",
      description: "ალკოჰოლური სასმელები, თამბაქოს ნაწარმი",
      annualGrowth: cl2,
    },
    {
      code: "3",
      icon: imgs3,
      title: "ტანსაცმელი და ფეხსაცმელი",
      description: "ტანსაცმელი და ფეხსაცმელი",
      annualGrowth: cl3,
    },
    {
      code: "4",
      icon: imgs4,
      title: "საყოფაცხოვრებო ნივთები, ავეჯი და სახლის მოვლა",
      description:
        "საყოფაცხოვრებო ნივთები, ავეჯი, საოჯახო ტექნიკა, სახლის მოვლა",
      annualGrowth: cl4,
    },
    {
      code: "5",
      icon: imgs5,
      title: "კომუნალური მომსახურება, წყალმომარაგება, გაზი და საწვავი",
      description:
        "ელექტროენერგია, ბუნებრივი გაზი, საწვავი; წყალმომარაგება, სანიტარული მომსახურება",
      annualGrowth: cl5,
    },
    {
      code: "6",
      icon: imgs6,
      title: "ჯანმრთელობის დაცვა",
      description: "ჯანმრთელობის მომსახურება, სამედიცინო პროდუქცია",
      annualGrowth: cl6,
    },
  ];

  categoriesLeft.forEach((item, index) => {
    item.priceChange = parsed2[index] ? `${parsed2[index]}%` : "N/A";
  });

  let cr7 = parsed[6]?.weight;
  cr7 = cr7 ? `${(Number(cr7) * 100).toFixed(2)}%` : "N/A";

  let cr8 = parsed[7]?.weight;
  cr8 = cr8 ? `${(Number(cr8) * 100).toFixed(2)}%` : "N/A";

  let cr9 = parsed[8]?.weight;
  cr9 = cr9 ? `${(Number(cr9) * 100).toFixed(2)}%` : "N/A";

  let cr10 = parsed[9]?.weight;
  cr10 = cr10 ? `${(Number(cr10) * 100).toFixed(2)}%` : "N/A";

  let cr11 = parsed[10]?.weight;
  cr11 = cr11 ? `${(Number(cr11) * 100).toFixed(2)}%` : "N/A";

  let cr12 = parsed[11]?.weight;
  cr12 = cr12 ? `${(Number(cr12) * 100).toFixed(2)}%` : "N/A";

  const categoriesRight = [
    {
      code: "7",
      icon: imgs7,
      title: language === "GE" ? "ტრანსპორტი" : "TRANSPORT",
      description:
        language === "GE"
          ? "სატრანსპორტო საშუალებების შეძენა და ექსპლუატაცია; სატრანსპორტო მომსახურება"
          : "Purchase and operation of transport vehicles; transport services",
      annualGrowth: cr7,
    },
    {
      code: "8",
      icon: imgs8,
      title: "კომუნიკაციები",
      description: "საკომუნიკაციო მომსახურება და ტელეფონები",
      annualGrowth: cr8,
    },
    {
      code: "9",
      icon: imgs9,
      title: "დასვენება, გართობა და კულტურა",
      description: "დასვენება, კულტურული და გართობის მომსახურება",
      annualGrowth: cr9,
    },
    {
      code: "10",
      icon: imgs10,
      title: "განათლება",
      description: "სასწავლო დაწესებულებების საფასური",
      annualGrowth: cr10,
    },
    {
      code: "11",
      icon: imgs11,
      title: "სასტუმროები, კაფეები და რესტორნები",
      description: "სასტუმროები, კაფეები და რესტორნები",
      annualGrowth: cr11,
    },
    {
      code: "12",
      icon: imgs12,
      title: "სხვა სახის საქონელი და მომსახურება",
      description: "პერსონალური საქონელი, დაზღვევა, ფინანსური მომსახურება",
      annualGrowth: cr12,
    },
  ];

  categoriesRight.forEach((item, index) => {
    item.priceChange = parsed2[index + 6] ? `${parsed2[index + 6]}%` : "N/A";
  });

  // D3 chart
  useEffect(() => {
    if (!parsed3 || parsed3.length === 0) return;

    const width = 500;
    const height = 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Scale radius based on weight
    const maxWeight = d3.max(parsed3, (d) => Number(d.weight)) || 1;
    const baseRadius = d3.scaleLinear().domain([0, maxWeight]).range([50, 220]); // chart size per weight

    const angleStep = (2 * Math.PI) / parsed3.length;
    const points = parsed3.map((d, i) => {
      const angle = i * angleStep;
      const r = baseRadius(Number(d.weight));
      return [
        width / 2 + r * Math.cos(angle),
        height / 2 + r * Math.sin(angle),
      ];
    });

    const delaunay = Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    svg
      .attr("width", width)
      .attr("height", height)
      .append("defs")
      .append("filter")
      .attr("id", "drop-shadow")
      .append("feDropShadow")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("stdDeviation", 2)
      .attr("flood-color", "rgba(0, 0, 0, 0.2)");

    // Draw max circle outline
    svg
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", baseRadius(maxWeight))
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", 21);

    svg
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", baseRadius(maxWeight))
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 5);

    svg
      .append("clipPath")
      .attr("id", "circle-clip")
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", baseRadius(maxWeight));

    const g = svg.append("g").attr("clip-path", "url(#circle-clip)");

    const minStroke = 3;
    const maxStroke = 8;
    const maxVal = d3.max(parsed3, (d) => Math.abs(Number(d.index))) || 1;

    points.forEach((point, i) => {
      const cell = voronoi.cellPolygon(i);
      if (!cell) return;

      const { fill, fillOpacity } = getColorForValue(Number(parsed3[i].index));

      g.append("path")
        .attr("d", "M" + cell.join("L") + "Z")
        .attr("fill", fill)
        .attr("fill-opacity", fillOpacity)
        .attr("stroke", "#fff")
        .attr("stroke-width", () => {
          const val = Math.abs(Number(parsed3[i].index));
          return minStroke + (val / maxVal) * (maxStroke - minStroke);
        })
        .attr("opacity", 0.9)
        .style("filter", "url(#drop-shadow)")
        .on("mouseover", function (event) {
          d3.select(this)
            .attr("opacity", 1)
            .attr("stroke-width", 7)
            .attr("stroke", "white");

          const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "rgba(255,255,255)")
            .style("color", "black")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("font-family", "BPG Nino Mtavruli")
            .style("pointer-events", "none")
            .style("z-index", "1000")
            .html(
              `${parsed3[i].title_geo}<br/>ფასების ცვლილება: ${parsed3[i].index}%<br/>წონა: ${parsed3[i].weight}%`
            );

          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px");
        })
        .on("mouseout", function () {
          d3.select(this)
            .attr("opacity", 0.9)
            .attr("stroke-width", 3)
            .attr("stroke", "#fff");

          d3.selectAll(".tooltip").remove();
        });
    });
  }, [parsed3]);

  return (
    <div className="flex flex-col sm:flex-row flex-1 p-4 gap-4">
      <div className="w-full sm:w-1/4 flex flex-col gap-4 font-bpg-nino">
        {categoriesLeft.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-white shadow rounded"
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
              <p className="text-gray-600 text-sm mb-1">{item.description}</p>
              <p className="text-gray-700 text-sm">
                ჯგუფის წონა: {item.annualGrowth}
              </p>
              <p className="text-gray-700 text-sm">
                ფასის ცვლილება: {item.priceChange}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full sm:w-1/2 flex flex-col items-center justify-center bg-gray-100 rounded min-h-[400px] p-4 max-w-full overflow-x-auto cursor-pointer">
        <svg
          ref={svgRef}
          className="w-full max-w-[500px] h-auto"
          viewBox="0 0 500 500"
          preserveAspectRatio="xMidYMid meet"
        ></svg>

        <div className="mt-20 flex flex-col items-center w-full max-w-[320px]">
          <div className="text-sm font-medium text-gray-700 mb-2 text-center">
            ფასების პროცენტული ცვლილება
          </div>
          <div className="flex items-center justify-center flex-wrap gap-1">
            {legendRanges.map((range, idx) => (
              <div key={idx} className="flex flex-col items-center mx-1">
                <div
                  className="w-6 h-4"
                  style={{
                    backgroundColor: range.fill,
                    opacity: range.fillOpacity,
                    border: "1px solid #999",
                  }}
                ></div>
                <span className="text-xs text-gray-600 mt-1">
                  {range.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full sm:w-1/4 flex flex-col gap-4 font-bpg-nino">
        {categoriesRight.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-white shadow rounded"
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
              <p className="text-gray-600 text-sm mb-1">{item.description}</p>
              <p className="text-gray-700 text-sm">
                ჯგუფის წონა: {item.annualGrowth}
              </p>
              <p className="text-gray-700 text-sm">
                ფასის ცვლილება: {item.priceChange}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightPanel;