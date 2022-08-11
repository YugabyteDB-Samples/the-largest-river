import { useContext, useEffect, useMemo, useRef, useState } from "react";
import AppContext from "../../contexts/AppContext";
import { v4 as uuidv4 } from "uuid";
import {
  FeatureGroup,
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
  CircleMarker,
  Circle,
} from "react-leaflet";
import L, { point } from "leaflet";
import { makeStyles } from "@material-ui/core";
import MapPolyLine from "./MapPolyline";
import ReturnButton from "../return_button/ReturnButton";

let pathColor;
const useStyles = makeStyles((theme) => {
  //TODO: better way to set styles which aren't applied via CSS classes?
  pathColor = theme.palette.grey[600];

  return {
    map: {
      height: "350px",
      flex: "1 1 auto",
    },
  };
});

// mathematical simplification, should be using radians if precision is required
function getIntermediatePoint(lat1, long1, lat2, long2, per) {
  per = per / 100;
  return [lat1 + (lat2 - lat1) * per, long1 + (long2 - long1) * per];
}
export default function Map({ databases }) {
  console.log("rendering map");

  const classes = useStyles();
  const { currentDatabase, trafficLocation, trafficLocations } =
    useContext(AppContext);
  const [trafficOriginMarker, setTrafficOriginMarker] = useState({
    coords: [51.505, -0.09],
    radius: 5,
  });
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [databaseNodes, setDatabaseNodes] = useState([]);
  const [map, setMap] = useState(null);
  const featureGroupRef = useRef();

  useEffect(() => {
    if (databases.length === 0) return;
    const currentdb = databases[currentDatabase - 1];
    const coords = currentdb.coords.split("/").map((coord) => parseInt(coord));
    setDatabaseNodes([{ coords: coords, id: currentdb.id }]);
    setTrafficOriginMarker((prev) => {
      const location = trafficLocations.find(
        (loc) => loc.id === trafficLocation
      );
      return { ...prev, coords: location.coords };
    });
  }, [currentDatabase, databases, trafficLocation]);
  useEffect(() => {
    if (databaseNodes.length === 0) return;
    if (map) {
      map.fitBounds(featureGroupRef.current.getBounds());
      const legend = L.control({ position: "bottomleft" });

      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        div.style.margin = "0";
        div.innerHTML = `<div style='display: flex; gap: 5px; align-items: center; background-color: #FFFFFF; opacity: 0.7; border-top: 1px solid #E9EEF2; border-right: 1px solid #E9EEF2; padding: 5px; font-family: ${"Inter"}, sans-serif; font-style: normal; font-size: 11px; font-weight: 500; line-height: 7px; letter-spacing: 0px;'><div style='height: 10px; width: 10px; border-radius: 20px; background-color: green;'></div><div>Primary Node</div><div style='height: 10px; width: 10px; border-radius: 20px; background-color: purple;'></div><div>Phone Location</div><div style='height: 10px; width: 10px; border-radius: 20px; background-color: yellow;'></div><div>Read Replica</div></div>`;
        return div;
      };

      legend.addTo(map);
    }
    const destination = databaseNodes[0].coords;
    const intermediatePoint = getIntermediatePoint(
      trafficOriginMarker.coords[0],
      trafficOriginMarker.coords[1],
      destination[0],
      destination[1],
      50
    );
    setMapCenter(intermediatePoint);
  }, [databaseNodes, trafficOriginMarker]);
  // useMemo prevents gif from rerendering
  // const logoIcon = useMemo(
  //   () =>
  //     L.icon({
  //       iconSize: [48, 80],
  //       iconAnchor: [24, 40],
  //       iconUrl: require("./elmo-fire.gif"),
  //       // iconUrl: "https://c.tenor.com/DXh9ij18IJ0AAAAM/hell-flame.gif",
  //     }),
  //   []
  // );

  const dbIcon = useMemo(() =>
    L.icon({
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      iconUrl: require("./pngegg.png"),
    })
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
  //   var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  // maxZoom: 20,
  // attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  // });
  return (
    <MapContainer
      center={mapCenter}
      zoom={1}
      scrollWheelZoom={true}
      className={classes.map}
      whenCreated={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FeatureGroup ref={featureGroupRef}>
        {trafficOriginMarker && (
          <CircleMarker
            key={uuidv4()}
            center={trafficOriginMarker.coords}
            radius={trafficOriginMarker.radius}
            color="navy"
            opacity="0.5"
            weight="10"
            fill="true"
            fillColor="navy"
            fillOpacity="1"
          >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
              {trafficOriginMarker.radius}
            </Popup>
          </CircleMarker>
        )}
        {/* <Marker position={[1.29027, 103.851959]} icon={logoIcon}>
        <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}

        {databaseNodes &&
          databaseNodes.map((node) => {
            return (
              <CircleMarker
                key={uuidv4()}
                center={node.coords}
                radius={5}
                color="green"
                opacity="0.5"
                weight="10"
                fill="true"
                fillColor="green"
                fillOpacity="1"
              >
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </CircleMarker>
              // <Marker position={node.coords} icon={dbIcon} key={node.id}>
              //   <Popup>
              //     A pretty CSS3 popup. <br /> Easily customizable.
              //   </Popup>
              // </Marker>
            );
          })}
      </FeatureGroup>
      <MapPolyLine
        databaseNodes={databaseNodes}
        trafficOriginMarker={trafficOriginMarker}
        getIntermediatePoint={getIntermediatePoint}
      />
    </MapContainer>
  );
}
