import { useState } from "react";
import { ranges } from "../../unicode/constants";
import { getUnicodes } from "../../unicode/utils";
import "./Home.scss";

const Home = () => {
  const [selected, setSelected] = useState<keyof typeof ranges>("arrows");

  const unicodes = getUnicodes(...ranges[selected]);

  return (
    <div className="home">
      <h2 className="home__title">Unicode</h2>

      <select
        className="home__select"
        value={selected}
        onChange={(e) => setSelected(e.target.value as keyof typeof ranges)}
      >
        {Object.keys(ranges).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      <div className="unicode-grid">
        {unicodes.slice(0, 100).map((item) => (
          <button
            key={item.code}
            className="unicode-grid__item"
            title={item.code}
            onClick={() => navigator.clipboard.writeText(item.char)}
          >
            {item.char}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
