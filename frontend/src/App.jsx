import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/footer";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import "./App.scss";

function App() {
  const [language, setLanguage] = useState("GE");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Header */}
      <Header language={language} setLanguage={setLanguage} />

      {/* Content area: LeftPanel + Routes */}
      <div className="flex flex-1">
        {/* Left sidebar */}
        <aside className="w-96 bg-white shadow-md">
          <LeftPanel language={language} setLanguage={setLanguage} />
        </aside>

        {/* Main content area */}
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<RightPanel language={language} />} />
          </Routes>
        </main>
      </div>

      {/* Footer outside the flex row, always at bottom */}
      <Footer language={language} />
    </div>
  );
}

export default App;
