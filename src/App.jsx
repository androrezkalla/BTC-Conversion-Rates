import "./App.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";
import { ConversionRates } from "./components/Pages/ConversionRates";
import { Conversions } from "./components/Pages/Conversions";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<ConversionRates />} />
            <Route path="/conversions" element={<Conversions />} />
          </Routes>
        </div>
      </Router>
  </>
  );
}

export default App;
