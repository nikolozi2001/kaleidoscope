import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
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
  {
    icon: imgs1,
    title: "სურსათი და უალკოჰოლო სასმელები",
    description: "სურსათი, უალკოჰოლო სასმელები",
    annualGrowth: "40.08%",
    priceChange: "3.72%",
  },
  {
    icon: imgs2,
    title: "ალკოჰოლური სასმელები, თამბაქო",
    description: "ალკოჰოლური სასმელები, თამბაქოს ნაწარმი",
    annualGrowth: "2.88%",
    priceChange: "5.79%",
  },
  {
    icon: imgs3,
    title: "ტანსაცმელი და ფეხსაცმელი",
    description: "ტანსაცმელი და ფეხსაცმელი",
    annualGrowth: "4.34%",
    priceChange: "-9.02%",
  },
  {
    icon: imgs4,
    title: "საყოფაცხოვრებო ნივთები, ავეჯი და სახლის მოვლა",
    description: "საყოფაცხოვრებო ნივთები, ავეჯი, საოჯახო ტექნიკა, სახლის მოვლა",
    annualGrowth: "13.87%",
    priceChange: "0.52%",
  },
  {
    icon: imgs5,
    title: "კომუნალური მომსახურება, წყალმომარაგება, გაზი და საწვავი",
    description:
      "ელექტროენერგია, ბუნებრივი გაზი, საწვავი; წყალმომარაგება, სანიტარული მომსახურება",
    annualGrowth: "3.56%",
    priceChange: "-2.42%",
  },
  {
    icon: imgs6,
    title: "ჯანმრთელობის დაცვა",
    description: "ჯანმრთელობის მომსახურება, სამედიცინო პროდუქცია",
    annualGrowth: "8.95%",
    priceChange: "0.29%",
  },
];

const categoriesRight = [
  {
    icon: imgs7,
    title: "ტრანსპორტი",
    description:
      "სატრანსპორტო საშუალებების შეძენა და ექსპლუატაცია; სატრანსპორტო მომსახურება",
    annualGrowth: "10.44%",
    priceChange: "12.78%",
  },
  {
    icon: imgs8,
    title: "კომუნიკაციები",
    description: "საკომუნიკაციო მომსახურება და ტელეფონები",
    annualGrowth: "4.24%",
    priceChange: "0.29%",
  },
  {
    icon: imgs9,
    title: "დასვენება, გართობა და კულტურა",
    description: "დასვენება, კულტურული და გართობის მომსახურება",
    annualGrowth: "2.21%",
    priceChange: "-1.01%",
  },
  {
    icon: imgs10,
    title: "განათლება",
    description: "სასწავლო დაწესებულებების საფასური",
    annualGrowth: "5.16%",
    priceChange: "4.30%",
  },
  {
    icon: imgs11,
    title: "სასტუმროები, კაფეები და რესტორნები",
    description: "სასტუმროები, კაფეები და რესტორნები",
    annualGrowth: "1.81%",
    priceChange: "1.19%",
  },
  {
    icon: imgs12,
    title: "სხვა სახის საქონელი და მომსახურება",
    description: "პერსონალური საქონელი, დაზღვევა, ფინანსური მომსახურება",
    annualGrowth: "2.34%",
    priceChange: "0.78%",
  },
];

const RightPanel = () => {
  const svgRef = useRef();

  const data = [
    { name: "სურსათი", value: 40.08, color: "#FF8C42" },
    { name: "ალკოჰოლი", value: 2.88, color: "#6699CC" },
    { name: "ტანსაცმელი", value: 4.34, color: "#FFD23F" },
    { name: "ავეჯი", value: 13.87, color: "#EE6C4D" },
    { name: "კომუნალური", value: 3.56, color: "#A8DADC" },
    { name: "ჯანმრთელობა", value: 8.95, color: "#457B9D" },
    { name: "ტრანსპორტი", value: 10.44, color: "#F1C0E8" },
    { name: "კომუნიკაცია", value: 4.24, color: "#CFBAF0" },
    { name: "დასვენება", value: 2.21, color: "#A3C4F3" },
    { name: "განათლება", value: 5.16, color: "#90DBF4" },
    { name: "სასტუმროები", value: 1.81, color: "#8EECF5" },
    { name: "სხვა", value: 2.34, color: "#98F5E1" },
  ];

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2 - 10;
    const centerX = width / 2;
    const centerY = height / 2;

    // Generate points based on data values
    const points = [];
    const totalValue = d3.sum(data, (d) => d.value);

    // Generate multiple points for each data item based on its value
    data.forEach((d, i) => {
      const numPoints = Math.max(1, Math.round((d.value / totalValue) * 50));
      for (let j = 0; j < numPoints; j++) {
        const angle = Math.random() * 2 * Math.PI;
        const r = Math.random() * radius * 0.8;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        points.push([x, y, i, d]);
      }
    });

    // Create Voronoi diagram
    const voronoi = d3.Delaunay.from(
      points,
      (d) => d[0],
      (d) => d[1]
    ).voronoi([0, 0, width, height]);

    // Create clip path for circle
    const defs = svg.append("defs");
    defs
      .append("clipPath")
      .attr("id", "circle-clip")
      .append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", radius);

    // Group cells by data index
    const cellsByData = {};
    points.forEach((point, i) => {
      const dataIndex = point[2];
      if (!cellsByData[dataIndex]) {
        cellsByData[dataIndex] = [];
      }
      cellsByData[dataIndex].push(voronoi.renderCell(i));
    });

    // Create SVG
    svg.attr("width", width).attr("height", height);

    // Add outer circle border
    svg
      .append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("stroke", "#999")
      .attr("stroke-width", 3);

    // Add cells
    const g = svg.append("g").attr("clip-path", "url(#circle-clip)");

    Object.entries(cellsByData).forEach(([dataIndex, cells]) => {
      const dataItem = data[dataIndex];

      cells.forEach((cellPath) => {
        if (cellPath) {
          g.append("path")
            .attr("d", cellPath)
            .attr("fill", dataItem.color)
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .attr("opacity", 0.8)
            .on("mouseover", function (event) {
              d3.select(this).attr("opacity", 1);

              // Show tooltip
              const tooltip = d3
                .select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background", "rgba(0,0,0,0.8)")
                .style("color", "white")
                .style("padding", "8px")
                .style("border-radius", "4px")
                .style("font-size", "12px")
                .style("pointer-events", "none")
                .style("z-index", "1000")
                .html(`${dataItem.name}: ${dataItem.value}%`);

              tooltip
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 10 + "px");
            })
            .on("mouseout", function () {
              d3.select(this).attr("opacity", 0.8);
              d3.selectAll(".tooltip").remove();
            });
        }
      });
    });

    // Add center labels for major categories
    const majorCategories = data.filter((d) => d.value > 8);
    majorCategories.forEach((d) => {
      // Find a good position for the label
      const angle = Math.random() * 2 * Math.PI;
      const r = radius * 0.3;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      g.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("fill", "#333")
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .attr("paint-order", "stroke")
        .text(`${d.value}%`);
    });
  }, []);

  return (
    <div className="flex flex-col sm:flex-row flex-1 p-4 gap-4">
      {/* Left Section */}
      <div className="w-full sm:w-1/4 flex flex-col gap-4">
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
              <p className="text-gray-700 text-sm">
                ჯგუფის წონა: {item.annualGrowth}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Center Diagram */}
      <div className="w-full sm:w-1/2 flex items-center justify-center bg-gray-100 rounded min-h-[400px]">
        <svg ref={svgRef}></svg>
      </div>

      {/* Right Section */}
      <div className="w-full sm:w-1/4 flex flex-col gap-4">
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
              <p className="text-gray-700 text-sm">
                ჯგუფის წონა: {item.annualGrowth}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightPanel;
