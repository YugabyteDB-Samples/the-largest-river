import "./map.scss";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import AppContext from "../../AppContext";
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

let pathColor;
const useStyles = makeStyles((theme) => {
  //TODO: better way to set styles which aren't applied via CSS classes?
  pathColor = theme.palette.grey[600];

  return {
    map: {
      height: "400px",
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
  const pathOptions = { color: pathColor, dashArray: "5,10" };
  const classes = useStyles();
  const { currentDatabase, trafficLocation, trafficLocations } =
    useContext(AppContext);
  const [trafficOriginMarker, setTrafficOriginMarker] = useState({
    coords: [51.505, -0.09],
    radius: 5,
  });
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [databaseNodes, setDatabaseNodes] = useState([]);
  // const map = useMap(null);
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

  const [polyline, setPolyline] = useState({
    origin: [51.505, -0.09],
    percentage: 0,
    points: [],
  });
  const intervalRef = useRef();
  useEffect(() => {
    if (databaseNodes.length === 0) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setPolyline((prev) => {
        return {
          percentage: 0,
          points: [],
        };
      });
    }
    if (map) map.fitBounds(featureGroupRef.current.getBounds());
    const destination = databaseNodes[0].coords;
    const intermediatePoint = getIntermediatePoint(
      trafficOriginMarker.coords[0],
      trafficOriginMarker.coords[1],
      destination[0],
      destination[1],
      50
    );
    setMapCenter(intermediatePoint);
    intervalRef.current = setInterval(() => {
      setPolyline(({ percentage, points }) => {
        const newCoords = getIntermediatePoint(
          trafficOriginMarker.coords[0],
          trafficOriginMarker.coords[1],
          destination[0],
          destination[1],
          percentage
        );

        points.push(newCoords);

        if (percentage + 5 > 100) {
          points = [];
          percentage = 0;
        } else {
          percentage = percentage + 5;
        }

        return { destination, points, percentage };
      });
    }, 300);
    return () => {
      clearInterval(intervalRef.current);
    };
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
      <Polyline pathOptions={pathOptions} positions={[polyline.points]} />
    </MapContainer>
  );
}
