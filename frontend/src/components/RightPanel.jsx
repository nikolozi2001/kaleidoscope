import React, { useEffect, useRef } from "react";
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

const categoriesLeft = [
  { icon: imgs1, title: "სურსათი და უალკოჰოლო სასმელები", description: "სურსათი, უალკოჰოლო სასმელები", annualGrowth: "40.08%", priceChange: "3.72%" },
  { icon: imgs2, title: "ალკოჰოლური სასმელები, თამბაქო", description: "ალკოჰოლური სასმელები, თამბაქოს ნაწარმი", annualGrowth: "2.88%", priceChange: "5.79%" },
  { icon: imgs3, title: "ტანსაცმელი და ფეხსაცმელი", description: "ტანსაცმელი და ფეხსაცმელი", annualGrowth: "4.34%", priceChange: "-9.02%" },
  { icon: imgs4, title: "საყოფაცხოვრებო ნივთები, ავეჯი და სახლის მოვლა", description: "საყოფაცხოვრებო ნივთები, ავეჯი, საოჯახო ტექნიკა, სახლის მოვლა", annualGrowth: "13.87%", priceChange: "0.52%" },
  { icon: imgs5, title: "კომუნალური მომსახურება, წყალმომარაგება, გაზი და საწვავი", description: "ელექტროენერგია, ბუნებრივი გაზი, საწვავი; წყალმომარაგება, სანიტარული მომსახურება", annualGrowth: "3.56%", priceChange: "-2.42%" },
  { icon: imgs6, title: "ჯანმრთელობის დაცვა", description: "ჯანმრთელობის მომსახურება, სამედიცინო პროდუქცია", annualGrowth: "8.95%", priceChange: "0.29%" }
];

const categoriesRight = [
  { icon: imgs7, title: "ტრანსპორტი", description: "სატრანსპორტო საშუალებების შეძენა და ექსპლუატაცია; სატრანსპორტო მომსახურება", annualGrowth: "10.44%", priceChange: "12.78%" },
  { icon: imgs8, title: "კომუნიკაციები", description: "საკომუნიკაციო მომსახურება და ტელეფონები", annualGrowth: "4.24%", priceChange: "0.29%" },
  { icon: imgs9, title: "დასვენება, გართობა და კულტურა", description: "დასვენება, კულტურული და გართობის მომსახურება", annualGrowth: "2.21%", priceChange: "-1.01%" },
  { icon: imgs10, title: "განათლება", description: "სასწავლო დაწესებულებების საფასური", annualGrowth: "5.16%", priceChange: "4.30%" },
  { icon: imgs11, title: "სასტუმროები, კაფეები და რესტორნები", description: "სასტუმროები, კაფეები და რესტორნები", annualGrowth: "1.81%", priceChange: "1.19%" },
  { icon: imgs12, title: "სხვა სახის საქონელი და მომსახურება", description: "პერსონალური საქონელი, დაზღვევა, ფინანსური მომსახურება", annualGrowth: "2.34%", priceChange: "0.78%" }
];

const legendRanges = [
  { value: -24, fill: "rgb(51, 51, 102)", fillOpacity: 0.7 },
  { value: -12, fill: "rgb(51, 102, 204)", fillOpacity: 0.7 },
  { value: -6, fill: "#66ccff", fillOpacity: 0.7 },
  { value: -2, fill: "#c1eaff", fillOpacity: 0.7 },
  { value: 0, fill: "#d8e3e8", fillOpacity: 0.7 },
  { value: 2, fill: "#fffadf", fillOpacity: 0.7 },
  { value: 6, fill: "#ffcc33", fillOpacity: 0.7 },
  { value: 12, fill: "#ff9900", fillOpacity: 0.7 },
  { value: 24, fill: "#ff6600", fillOpacity: 0.7 }
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

const data = [
  { name: "სურსათი", value: -21.1, secondValue: 31.72 },
  { name: "უალკოჰოლო სასმელები", value: 3.72, secondValue: 5.0 },
  { name: "თამბაქო", value: 2.88, secondValue: 4.0 },
  { name: "ტანსაცმელი", value: 5.79, secondValue: 6.5 },
  { name: "ფეხსაცმელი", value: 4.34, secondValue: 5.2 },
  { name: "ალკოჰოლი1", value: 9.02, secondValue: 10.0 },
  { name: "ალკოჰოლი2", value: 13.87, secondValue: 15.0 },
  { name: "ალკოჰოლი3", value: 3.56, secondValue: 4.2 },
  { name: "ალკოჰოლი4", value: 2.42, secondValue: 3.1 },
  { name: "ალკოჰოლი5", value: 0.29, secondValue: 0.5 },
  { name: "ალკოჰოლი6", value: -1.01, secondValue: 25.0 },
  { name: "ალკოჰოლი6", value: 2.34, secondValue: 25.0 },
  { name: "ალკოჰოლი6", value: 8.95, secondValue: 25.0 },
  { name: "ალკოჰოლი6", value: -9.02, secondValue: 25.0 },
  { name: "ალკოჰოლი6", value: 13.87, secondValue: 25.0 },
  { name: "ალკოჰოლი6", value: 3.56, secondValue: 25.0 },
  { name: "ალკოჰოლი6", value: 2.21, secondValue: 25.0 },
  { name: "ალკოჰოლი7", value: 4.24, secondValue: 60.0 }
];

const RightPanel = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2 - 10;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const points = d3.range(data.length).map(() => {
      const angle = Math.random() * 2 * Math.PI;
      const r = Math.random() * radius * 0.9;
      return [width / 2 + r * Math.cos(angle), height / 2 + r * Math.sin(angle)];
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

    svg
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", 21);

      svg
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 5);

    svg
      .append("clipPath")
      .attr("id", "circle-clip")
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", radius);

    const g = svg.append("g").attr("clip-path", "url(#circle-clip)");

    const maxValue = d3.max(data, (d) => Math.abs(d.value));
    const minStroke = 3;
    const maxStroke = 8;

    points.forEach((point, i) => {
      const cell = voronoi.cellPolygon(i);
      if (!cell) return;

      const { fill, fillOpacity } = getColorForValue(data[i].value);

      g.append("path")
        .attr("d", "M" + cell.join("L") + "Z")
        .attr("fill", fill)
        .attr("fill-opacity", fillOpacity)
        .attr("stroke", "#fff")
        .attr("stroke-width", () => {
          const val = Math.abs(data[i].value);
          return minStroke + (val / maxValue) * (maxStroke - minStroke);
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
            .html(`${data[i].name}<br/>ფასების ცვლილება: ${data[i].value}%<br/>წონა: ${data[i].secondValue}%`);

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
  }, []);

  return (
    <div className="flex flex-col sm:flex-row flex-1 p-4 gap-4">
      <div className="w-full sm:w-1/4 flex flex-col gap-4 font-bpg-nino">
        {categoriesLeft.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white shadow rounded">
            <img src={item.icon} alt="icon" className="w-12 h-12 object-contain" />
            <div className="flex flex-col">
              <h2 className="font-bold text-gray-800 text-sm sm:text-base">{item.title}</h2>
              <p className="text-gray-600 text-sm mb-1">{item.description}</p>
              <p className="text-gray-700 text-sm">ჯგუფის წონა: {item.annualGrowth}</p>
              <p className="text-gray-700 text-sm">ფასის ცვლილება: {item.priceChange}</p>
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
                <span className="text-xs text-gray-600 mt-1">{range.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full sm:w-1/4 flex flex-col gap-4 font-bpg-nino">
        {categoriesRight.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white shadow rounded">
            <img src={item.icon} alt="icon" className="w-12 h-12 object-contain" />
            <div className="flex flex-col">
              <h2 className="font-bold text-gray-800 text-sm sm:text-base">{item.title}</h2>
              <p className="text-gray-600 text-sm mb-1">{item.description}</p>
              <p className="text-gray-700 text-sm">ჯგუფის წონა: {item.annualGrowth}</p>
              <p className="text-gray-700 text-sm">ფასის ცვლილება: {item.priceChange}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightPanel;