import { ClassStats, addGamma, calculateByClass } from "../utils";
import WineData from "../data/WineData.json";
import "../index.css";

const flavenoidStats = calculateByClass(WineData, false);
const gammaAddedData = addGamma(WineData);
const gammaStats = calculateByClass(gammaAddedData, true);

const renderTable = (data: Record<number, ClassStats>) => {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th className="header-cell">Measure</th>
          {Object.keys(data).map((className) => (
            <th key={className} className="header-cell">
              Class {className}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr className="row">
          <td className="measure-cell">Flavonoid Mean</td>
          {Object.values(data).map((stats, index) => (
            <td key={index} className="data-cell">
              {stats.mean}
            </td>
          ))}
        </tr>
        <tr className="row">
          <td className="measure-cell">Flavonoid Median</td>
          {Object.values(data).map((stats, index) => (
            <td key={index} className="data-cell">
              {stats.median}
            </td>
          ))}
        </tr>
        <tr className="row">
          <td className="measure-cell">Flavonoid Mode</td>
          {Object.values(data).map((stats, index) => (
            <td key={index} className="data-cell">
              {stats.mode.length === 0 ? "No Mode" : stats.mode[0]}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

function App() {
  return (
    <div className="container">
      <div className="section">
        <h1 className="section-title">Flavonoids Statistics</h1>
        {renderTable(flavenoidStats)}
      </div>
      <div className="section">
        <h1 className="section-title">Gamma Statistics</h1>
        {renderTable(gammaStats)}
      </div>
    </div>
  );
}

export default App;
