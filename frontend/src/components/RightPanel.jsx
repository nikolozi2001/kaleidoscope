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
  { code: "1", icon: imgs1, title: "სურსათი და უალკოჰოლო სასმელები", description: "სურსათი, უალკოჰოლო სასმელები", annualGrowth: "40.08%", priceChange: "3.72%" },
  { code: "2", icon: imgs2, title: "ალკოჰოლური სასმელები, თამბაქო", description: "ალკოჰოლური სასმელები, თამბაქოს ნაწარმი", annualGrowth: "2.88%", priceChange: "5.79%" },
  { code: "3", icon: imgs3, title: "ტანსაცმელი და ფეხსაცმელი", description: "ტანსაცმელი და ფეხსაცმელი", annualGrowth: "4.34%", priceChange: "-9.02%" },
  { code: "4", icon: imgs4, title: "საყოფაცხოვრებო ნივთები, ავეჯი და სახლის მოვლა", description: "საყოფაცხოვრებო ნივთები, ავეჯი, საოჯახო ტექნიკა, სახლის მოვლა", annualGrowth: "13.87%", priceChange: "0.52%" },
  { code: "5", icon: imgs5, title: "კომუნალური მომსახურება, წყალმომარაგება, გაზი და საწვავი", description: "ელექტროენერგია, ბუნებრივი გაზი, საწვავი; წყალმომარაგება, სანიტარული მომსახურება", annualGrowth: "3.56%", priceChange: "-2.42%" },
  { code: "6", icon: imgs6, title: "ჯანმრთელობის დაცვა", description: "ჯანმრთელობის მომსახურება, სამედიცინო პროდუქცია", annualGrowth: "8.95%", priceChange: "0.29%" }
];

const categoriesRight = [
  { code: "7", icon: imgs7, title: "ტრანსპორტი", description: "სატრანსპორტო საშუალებების შეძენა და ექსპლუატაცია; სატრანსპორტო მომსახურება", annualGrowth: "10.44%", priceChange: "12.78%" },
  { code: "8", icon: imgs8, title: "კომუნიკაციები", description: "საკომუნიკაციო მომსახურება და ტელეფონები", annualGrowth: "4.24%", priceChange: "0.29%" },
  { code: "9", icon: imgs9, title: "დასვენება, გართობა და კულტურა", description: "დასვენება, კულტურული და გართობის მომსახურება", annualGrowth: "2.21%", priceChange: "-1.01%" },
  { code: "10", icon: imgs10, title: "განათლება", description: "სასწავლო დაწესებულებების საფასური", annualGrowth: "5.16%", priceChange: "4.30%" },
  { code: "11", icon: imgs11, title: "სასტუმროები, კაფეები და რესტორნები", description: "სასტუმროები, კაფეები და რესტორნები", annualGrowth: "1.81%", priceChange: "1.19%" },
  { code: "12", icon: imgs12, title: "სხვა სახის საქონელი და მომსახურება", description: "პერსონალური საქონელი, დაზღვევა, ფინანსური მომსახურება", annualGrowth: "2.34%", priceChange: "0.78%" }
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
  { code: 1, name: "სურსათი", value: 10.39, secondValue: 31.72 },
  { code: 1, name: "უალკოჰოლო სასმელები", value: 10.79, secondValue: 2.75 },
  { code: 2, name: "ალკოჰოლური სასმელები", value: 2.88, secondValue: 3.11 },
  { code: 2, name: "თამბაქოს ნაწარმი", value: 5.79, secondValue: 3.31 },
  { code: 3, name: "ტანსაცმელი", value: -1.92, secondValue: 3.10 },
  { code: 3, name: "ფეხსაცმელი", value: -3.08, secondValue: 1.62 },
  { code: 4, name: "ფაქტიური გადასახადი საცხოვრებელზე", value: 3.56, secondValue: 2.48 },
  { code: 4, name: "დარიცხული ბინის გადასახადი", value: 0, secondValue: 0 },
  { code: 4, name: "საცხოვრებლის მიმდინარე მოვლა და შეკეთება", value: 2.42, secondValue: 0.96 },
  { code: 4, name: "წყალმომარაგება და საცხოვრებელთან დაკავშირებული სხვა მომსახურება", value: 0.29, secondValue: 1.00 },
  { code: 4, name: "ელექტროენერგია, აირი და სათბობის სხვა სახეები", value: 13.87, secondValue: 5.39 },
  { code: 5, name: "ავეჯი, საოჯახო ნივთები, ხალიჩები და სხვა იატაკის საფარი და რემონტი", value: 2.34, secondValue: 0.65 },
  { code: 5, name: "საოჯახო საფეიქრო ნაწარმი", value: 8.95, secondValue: 0.08 },
  { code: 5, name: "გამათბობელი და საჭმლის მოსამზადებელი მოწყობილობა, მაცივრები, საყინულეები, სარეცხი მანქანები და სხვა საყოფაცხოვრებო საგნები, დაყენებისა და რემონტის ჩათვლით", value: -9.02, secondValue: 1.08 },
  { code: 5, name: "მინის ჭურჭელი, მაგიდის და საოჯახო ჭურჭელი", value: 13.87, secondValue: 0.93 },
  { code: 5, name: "ინსტრუმენტები, მოწყობილობა და ტექნიკა სახლისა და ბაღისთვის", value: 3.56, secondValue: 0.05 },
  { code: 5, name: "ყოველდღიური საყოფაცხოვრებო საჭიროების საქონელი და მომსახურება", value: -1.01, secondValue: 1.03 },
  { code: 6, name: "სამედიცინო პროდუქცია, აპარატურა და მოწყობილობა", value: 4, secondValue: 4.57 },
  { code: 6, name: "ამბულატორიული სამედიცინო მომსახურება", value: 12, secondValue: 2.04 },
  { code: 6, name: "საავადმყოფოების მომსახურება", value: 14, secondValue: 1.45 },
  { code: 7, name: "სატრანსპორტო საშუალებების შეძენა", value: 17, secondValue: 0.51 },
  { code: 7, name: "პირადი სატრანსპორტო საშუალებების ექსპლოატაცია", value: 4.24, secondValue: 26.94 },
  { code: 7, name: "სატრანსპორტო მომსახურება", value: 4.24, secondValue: 5.94 },
  { code: 8, name: "საფოსტო მომსახურება", value: 4.24, secondValue: 4.91 },
  { code: 8, name: "სატელეფონო და სატელეფაქსო მოწყობილობები", value: 4.24, secondValue: 5.68 },
  { code: 8, name: "სატელეფონო, სატელეგრაფო და სატელეფაქსო მომსახურება", value: 4.24, secondValue: 5.42 },
  { code: 9, name: "აუდიო ვიზუალური, ფოტოგრაფიული და მონაცემთა დამუშავების მოწყობილობები, რემონტის ჩათვლით", value: 4.24, secondValue: 4.64 },
  { code: 9, name: "დასვენების, გართობისა და კულტურის ხანგრძლივი მოხმარების სხვა საქონელი", value: 4.24, secondValue: 4.39 },
  { code: 9, name: "დასვენებისა და გართობისათვის აუცილებელი სხვა მოწყობილობა; ბაღები, ყვავილები და შინაური ცხოველები", value: 4.24, secondValue: 4.13 },
  { code: 9, name: "გასართობი და კულტურული მომსახურება", value: 4.24, secondValue: 4.13 },
  { code: 9,name: "წიგნები, გაზეთები და საკანცელარიო ნივთები", value: 4.24, secondValue: 3.87 },
  { code: 9, name: "ტურისტული მოგზაურობა", value: 4.24, secondValue: 3.35 },
  { code: 10, name: "სკოლამდელი და დაწყებითი განათლება", value: 4.24, secondValue: 3.10 },
  { code: 10, name: "საშუალო განათლება", value: 4.24, secondValue: 2.84 },
  { code: 10, name: "უმაღლესი განათლება", value: 4.24, secondValue: 2.32 },
  { code: 10, name: "დონით განუსაზღვრელი განათლება", value: 4.24, secondValue: 2.06 },
  { code: 11, name: "საზოგადოებრივი კვება", value: 4.24, secondValue: 1.81 },
  { code: 11, name: "ღამის გასათევით მომსახურება", value: 4.24, secondValue: 1.29 },
  { code: 12, name: "პირადი ჰიგიენა", value: 4.24, secondValue: 1.55 },
  { code: 12, name: "პირადი ნივთები, სხვა კატეგორიებში ჩაურთველი", value: 4.24, secondValue: 1.03 },
  { code: 12, name: "დაზღვევა", value: 4.24, secondValue: 0.77 },
  { code: 12, name: "საფინანსო მომსახურება", value: 4.24, secondValue: 0.26 },
  { code: 12, name: "სხვა სახის მომსახურება", value: 4.24, secondValue: 0.51 }
];


const RightPanel = () => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2 - 10;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Scale distance from center based on secondValue
    const secondValueScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.secondValue)])
      .range([radius * 0.2, radius * 0.9]);

    // evenly distribute points around a circle
    const angleStep = (2 * Math.PI) / data.length;
    const points = data.map((d, i) => {
      const angle = i * angleStep;
      const r = secondValueScale(d.secondValue);
      return [
        width / 2 + r * Math.cos(angle),
        height / 2 + r * Math.sin(angle)
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
          const val = Math.abs(data[i].secondValue);
          return minStroke + (val / d3.max(data, d => d.secondValue)) * (maxStroke - minStroke);
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