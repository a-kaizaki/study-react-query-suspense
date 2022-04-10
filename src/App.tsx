import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import { IssuesContainer } from "./IssuesContainer";

function App() {
  return (
    <div className="App">
      <Link to="/">Home</Link>|<Link to="/issues">Issues</Link>
      <Routes>
        <Route path="/" element={<h1>please click Issues</h1>} />
        <Route path="/issues" element={<IssuesContainer />} />
      </Routes>
    </div>
  );
}

export default App;
