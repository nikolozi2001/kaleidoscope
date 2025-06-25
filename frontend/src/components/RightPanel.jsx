import React from "react";
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
  { icon: imgs6, title: "ჯანმრთელობის დაცვა", description: "ჯანმრთელობის მომსახურება, სამედიცინო პროდუქცია", annualGrowth: "8.95%", priceChange: "0.29%" },
];

const categoriesRight = [
  { icon: imgs7, title: "ტრანსპორტი", description: "სატრანსპორტო საშუალებების შეძენა და ექსპლუატაცია; სატრანსპორტო მომსახურება", annualGrowth: "10.44%", priceChange: "12.78%" },
  { icon: imgs8, title: "კომუნიკაციები", description: "საკომუნიკაციო მომსახურება და ტელეფონები", annualGrowth: "4.24%", priceChange: "0.29%" },
  { icon: imgs9, title: "დასვენება, გართობა და კულტურა", description: "დასვენება, კულტურული და გართობის მომსახურება", annualGrowth: "2.21%", priceChange: "-1.01%" },
  { icon: imgs10, title: "განათლება", description: "სასწავლო დაწესებულებების საფასური", annualGrowth: "5.16%", priceChange: "4.30%" },
  { icon: imgs11, title: "სასტუმროები, კაფეები და რესტორნები", description: "სასტუმროები, კაფეები და რესტორნები", annualGrowth: "1.81%", priceChange: "1.19%" },
  { icon: imgs12, title: "სხვა სახის საქონელი და მომსახურება", description: "პერსონალური საქონელი, დაზღვევა, ფინანსური მომსახურება", annualGrowth: "2.34%", priceChange: "0.78%" },
];

const RightPanel = () => {
  return (
    <div className="flex flex-col sm:flex-row flex-1 p-4 gap-4">
      {/* Left Section */}
      <div className="w-full sm:w-1/4 flex flex-col gap-4 font-bpg-nino">
        {categoriesLeft.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white shadow rounded">
            {/* Icon */}
            <img src={item.icon} alt="icon" className="w-12 h-12 object-contain" />
            {/* Text Block */}
            <div className="flex flex-col">
              <h2 className="font-bold text-gray-800 text-sm sm:text-base">{item.title}</h2>
              <p className="text-gray-600 text-sm mb-1">{item.description}</p>
              <p className="text-gray-700 text-sm">ჯგუფის წონა: {item.annualGrowth}</p>
              <p className="text-gray-700 text-sm">ფასის ცვლილება: {item.priceChange}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Center Diagram Placeholder */}
      <div className="w-full sm:w-1/2 flex items-center justify-center bg-gray-100 rounded min-h-[150px]">
        <span className="text-gray-400 text-sm">Diagram Placeholder</span>
      </div>

      {/* Right Section */}
      <div className="w-full sm:w-1/4 flex flex-col gap-4 font-bpg-nino">
        {categoriesRight.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white shadow rounded">
            {/* Icon */}
            <img src={item.icon} alt="icon" className="w-12 h-12 object-contain" />
            {/* Text Block */}
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
