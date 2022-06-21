import "./xRay.scss";
import { useRef, useEffect, useContext } from "react";
import AppContext from "../../AppContext";
export default function Xray() {
  const { queryLogs } = useContext(AppContext);
  const xrayRef = useRef();
  useEffect(() => {
    xrayRef.current.scrollTop = xrayRef.current.scrollHeight;
  }, [queryLogs]);
  return (
    <div ref={xrayRef} className="xray-container">
      {queryLogs.map((query, i) => {
        return (
          <div key={i}>
            {"\u003E"}
            {"       "}
            {query}
            <br />
            <br />
          </div>
        );
      })}
    </div>
  );
}
