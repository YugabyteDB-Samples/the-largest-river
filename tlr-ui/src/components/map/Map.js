import "./map.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
export default function Map() {
  //   console.log("rerendering map");
  const [radius, setRadius] = useState({ val: 10, direction: "out" });
  const intervalRef = useRef();
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRadius(({ val, direction }) => {
        if (direction === "out" && val < 25) {
          return { val: val + 1, direction };
        } else if (val > 10) {
          return { val: val - 1, direction: "in" };
        } else {
          return { val: val + 1, direction: "out" };
        }
      });
    }, 100);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  // useMemo prevents gif from rerendering
  const logoIcon = useMemo(
    () =>
      L.icon({
        iconSize: [48, 80],
        iconAnchor: [24, 40],
        iconUrl: require("./elmo-fire.gif"),
        // iconUrl: "https://c.tenor.com/DXh9ij18IJ0AAAAM/hell-flame.gif",
      }),
    []
  );

  // DivIcons are lightweight
  //   const svgIcon = L.divIcon({
  //     html: `
  //       <svg
  //         width="24"
  //         height="40"
  //         viewBox="0 0 100 100"
  //         version="1.1"
  //         preserveAspectRatio="none"
  //         xmlns="http://www.w3.org/2000/svg"
  //       >
  //         <path d="M0 0 L50 100 L100 0 Z" fill="#7A8BE7"></path>
  //       </svg>`,
  //     className: "",
  //     iconSize: [24, 40],
  //     iconAnchor: [12, 40],
  //   });
  return (
    <div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={1}
        scrollWheelZoom={true}
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker center={[51.505, -0.09]} radius={radius.val} color="red">
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
            {radius.val}
          </Popup>
        </CircleMarker>
        <Marker position={[1.29027, 103.851959]} icon={logoIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
            {radius.val}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
