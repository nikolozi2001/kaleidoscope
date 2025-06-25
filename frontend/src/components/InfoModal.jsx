import React, { useEffect } from "react";

const InfoModal = ({ isOpen, onClose, language }) => {
  const handlePrint = () => {
    // Create a new hidden iframe
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "absolute";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";
    document.body.appendChild(printFrame);

    // Get the content to print
    const contentToPrint = document
      .getElementById("modal-content")
      .cloneNode(true);

    // Remove the buttons from the clone
    const buttons = contentToPrint.querySelectorAll("button, .print\\:hidden");
    buttons.forEach((button) => button.remove());

    // Write the content to the iframe
    const frameDoc = printFrame.contentWindow.document;
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${
            language === "GE" ? "ფასების კალეიდოსკოპი" : "SPRICE KALEIDOSCOPE"
          }</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            p { margin-bottom: 1em; line-height: 1.5; }
            .font-bold { font-weight: bold; }
            .mt-4 { margin-top: 1.5em; }
            a { color: #2563eb; text-decoration: underline; }
          </style>
        </head>
        <body>
          ${contentToPrint.innerHTML}
        </body>
      </html>
    `);
    frameDoc.close();

    // Print and remove the iframe
    printFrame.contentWindow.onafterprint = () => {
      document.body.removeChild(printFrame);
    };

    printFrame.contentWindow.print();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (event.target.classList.contains("modal-backdrop")) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div id="modal-content">
          <div className="border-b p-4 flex justify-between items-center">
            <h5 className="text-xl font-bold bpg_mrgvlovani_caps">
              {language === "GE"
                ? "როგორ მუშაობს ფასების კალეიდოსკოპი"
                : "How Does the Salary Calculator Work"}
            </h5>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl print:hidden cursor-pointer font-bpg-nino"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="p-6 bpg_mrgvlovani_caps">
            {language === "GE" ? (
              <>
                <p>
                  ფასების კალეიდოსკოპი წარმოადგენს დიაგრამას, რომელიც ასახავს
                  ინფლაციის მაჩვენებელს საქონლისა და მომსახურების ჯგუფების და
                  ქვეჯგუფების მიხედვით („დანიშნულების მიხედვით ინდივიდუალური
                  მოხმარების კლასიფიკაციის“, COICOP-ის შესაბამისად), ასევე მათ
                  წონებს სამომხმარებლო კალათაში.
                </p>
                <p className="font-bold mt-4">
                  ფასების კალეიდოსკოპის გამოყენებით შესაძლებელია:
                </p>
                <ul>
                  <li>
                    საქონლისა და მომსახურების სხვადასხვა ქვეჯგუფზე ფასების
                    ცვლილების მაჩვენებლის შედარება;
                  </li>
                  <li>
                    ინფლაციის მაჩვენებლის ფორმირებაში საქონლისა და მომსახურების
                    ცალკეული ქვეჯგუფების შედარებითი მნიშვნელობის - სამომხმარებლო
                    კალათაში მათი წონების შედარება.
                  </li>
                </ul>
                <p className="font-bold mt-4">გამოყენების ინსტრუქცია</p>
                <p className="font-bold mt-4">1. აირჩიეთ დროითი პერიოდი</p>
                <p>
                  აირჩიეთ სასურველი წელი და თვე, რა პერიოდისთვისაც გსურთ
                  ინფლაციის მაჩვენებლის გაანალიზება.
                </p>
                <p className="font-bold mt-4">2. მიუთითეთ საბაზო პერიოდი</p>
                <p>
                  მიუთითეთ ორი საბაზო პერიოდიდან ერთ-ერთი (ინლაციის მაჩვენებელი
                  წინა თვესთან ან წინა წლის შესაბამის თვესთან შედარებით).
                </p>
                <p className="font-bold mt-4">
                  3. მიღებული შედეგების ინტერპრეტაცია
                </p>
                <p>
                  დიაგრამის თოთოეული სეგმენტი ასახავს საქონლისა და მომსახურების
                  კონკრეტული ქვეჯგუფის წონას სამომხმარებლო კალათაში და ამ
                  ქვეჯგუფზე ფასების პროცენტულ ცვლილებას მითითებულ საბაზო
                  პერიოდთან შედარებით. სეგმენტზე კურსორის მიტანის დროს ჩნდება
                  შესაბამისი ქვეჯგუფის შესახებ შემდეგი ინფორმაცია:
                </p>
                <br />
                <ul>
                  <li>ქვეჯგუფის დასახელება</li>
                  <li>ქვეჯგუფზე ფასების ცვლილების პროცენტული მაჩვენებელი</li>
                  <li>ქვეჯგუფის წონა სამომხმარებლო კალათაში.</li>
                </ul>
                <br />
                <p>
                  სეგმენტის ფართობი ასახავს შესაბამისი ქვეჯგუფის წონას
                  სამომხმარებლო კალათაში. რაც დიდია მოცემული სექტორის ფართობი,
                  მით უფრო დიდია შესაბამისი ქვეჯგუფის მნიშნვნელობა ინფლაციის
                  მაჩვენებლის ფორმირების პროცესში. სეგმენტების ფერადი ინდიკაცია
                  ასახავს შესაბამის ქვეჯგუფზე ფასების ცვლილების ოდენობას,
                  დიაგრამის ქვემოთ მოცემული სკალის შესაბამისად.
                </p>
              </>
            ) : (
              <>
                <p>
                  ფასების კალეიდოსკოპი წარმოადგენს დიაგრამას, რომელიც ასახავს
                  ინფლაციის მაჩვენებელს საქონლისა და მომსახურების ჯგუფების და
                  ქვეჯგუფების მიხედვით („დანიშნულების მიხედვით ინდივიდუალური
                  მოხმარების კლასიფიკაციის“, COICOP-ის შესაბამისად), ასევე მათ
                  წონებს სამომხმარებლო კალათაში.
                </p>
                <p className="font-bold mt-4">
                  ფასების კალეიდოსკოპის გამოყენებით შესაძლებელია:
                </p>
                <ul>
                  <li>
                    საქონლისა და მომსახურების სხვადასხვა ქვეჯგუფზე ფასების
                    ცვლილების მაჩვენებლის შედარება;
                  </li>
                  <li>
                    ინფლაციის მაჩვენებლის ფორმირებაში საქონლისა და მომსახურების
                    ცალკეული ქვეჯგუფების შედარებითი მნიშვნელობის - სამომხმარებლო
                    კალათაში მათი წონების შედარება.
                  </li>
                </ul>
                <p className="font-bold mt-4">გამოყენების ინსტრუქცია</p>
                <p className="font-bold mt-4">1. აირჩიეთ დროითი პერიოდი</p>
                <p>
                  აირჩიეთ სასურველი წელი და თვე, რა პერიოდისთვისაც გსურთ
                  ინფლაციის მაჩვენებლის გაანალიზება.
                </p>
                <p className="font-bold mt-4">2. მიუთითეთ საბაზო პერიოდი</p>
                <p>
                  მიუთითეთ ორი საბაზო პერიოდიდან ერთ-ერთი (ინლაციის მაჩვენებელი
                  წინა თვესთან ან წინა წლის შესაბამის თვესთან შედარებით).
                </p>
                <p className="font-bold mt-4">
                  3. მიღებული შედეგების ინტერპრეტაცია
                </p>
                <p>
                  დიაგრამის თოთოეული სეგმენტი ასახავს საქონლისა და მომსახურების
                  კონკრეტული ქვეჯგუფის წონას სამომხმარებლო კალათაში და ამ
                  ქვეჯგუფზე ფასების პროცენტულ ცვლილებას მითითებულ საბაზო
                  პერიოდთან შედარებით. სეგმენტზე კურსორის მიტანის დროს ჩნდება
                  შესაბამისი ქვეჯგუფის შესახებ შემდეგი ინფორმაცია:
                </p>
                <br />
                <ul>
                  <li>ქვეჯგუფის დასახელება</li>
                  <li>ქვეჯგუფზე ფასების ცვლილების პროცენტული მაჩვენებელი</li>
                  <li>ქვეჯგუფის წონა სამომხმარებლო კალათაში.</li>
                </ul>
                <br />
                <p>
                  სეგმენტის ფართობი ასახავს შესაბამისი ქვეჯგუფის წონას
                  სამომხმარებლო კალათაში. რაც დიდია მოცემული სექტორის ფართობი,
                  მით უფრო დიდია შესაბამისი ქვეჯგუფის მნიშნვნელობა ინფლაციის
                  მაჩვენებლის ფორმირების პროცესში. სეგმენტების ფერადი ინდიკაცია
                  ასახავს შესაბამის ქვეჯგუფზე ფასების ცვლილების ოდენობას,
                  დიაგრამის ქვემოთ მოცემული სკალის შესაბამისად.
                </p>
              </>
            )}
          </div>
          <div className="border-t p-4 flex justify-end gap-2 print:hidden">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-bpg-nino cursor-pointer"
              onClick={handlePrint}
            >
              {language === "GE" ? "ბეჭდვა" : "Print"}
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-bpg-nino cursor-pointer"
              onClick={onClose}
            >
              {language === "GE" ? "დახურვა" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
