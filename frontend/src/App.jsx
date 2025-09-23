// App.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/footer";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.scss";

function App() {
  const [language, setLanguage] = useState("GE");

  return (
    <ErrorBoundary language={language}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header language={language} setLanguage={setLanguage} />

        <div className="flex flex-1">
          <aside className="w-96 bg-white shadow-md">
            <LeftPanel language={language} setLanguage={setLanguage} />
          </aside>

          <main className="flex-grow flex flex-col">
            <Routes>
              {/* pass the function to RightPanel */}
              <Route path="/" element={<RightPanel language={language} />} />
            </Routes>
          </main>
        </div>

        <Footer language={language} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
