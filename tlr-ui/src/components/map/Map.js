import { useContext, useEffect, useMemo, useRef, useState } from "react";
import AppContext from "../../contexts/AppContext";
import { v4 as uuidv4 } from "uuid";
import {
  FeatureGroup,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { makeStyles } from "@material-ui/core";
import MapPolyLine from "./MapPolyline";

import OriginLocationLegendIcon from "./ellipse.svg";
import OriginLocationIcon from "./origin-location.svg";

const useStyles = makeStyles((theme) => {
  return {
    mapWrapper: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "0 0 10px 10px",

      "& .leaflet-div-icon": {
        background: "none",
        border: "none",
        pointerEvents: "none",
      },
    },
    map: {
      height: "350px",
      flex: "1 1 auto",
    },
    snapToZoom: {
      position: "absolute",
      top: "10px",
      right: "10px",
      zIndex: 999,
      border: "2px solid rgba(0,0,0,0.2)",
      borderRadius: "4px",
      boxShadow: "none",

      "& a": {
        height: "30px",
        width: "30px",
      },
    },
    legend: {
      display: "flex",
      position: "absolute",
      bottom: "-1px",
      left: "-1px",
      zIndex: 9999,
      gap: "5px",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255, 0.7)",
      borderTop: "1px solid #E9EEF2",
      borderRight: "1px solid #E9EEF2",
      padding: "5px",
      fontFamily: '"Inter", sans-serif',
      fontStyle: "normal",
      fontSize: "11px",
      fontWeight: 500,
      lineHeight: "7px",
      letterSpacing: "0px",
      border: "1px solid #D7DEE4",
      borderRadius: "0 0 0 10px",
    },
  };
});

// mathematical simplification, should be using radians if precision is required
function getIntermediatePoint(lat1, long1, lat2, long2, per) {
  per = per / 100;
  return [lat1 + (lat2 - lat1) * per, long1 + (long2 - long1) * per];
}
export default function Map() {
  console.log("rendering map");

  const classes = useStyles();
  const {
    currentDatabase,
    databases,
    databaseNodes,
    trafficLocation,
    trafficLocations,
  } = useContext(AppContext);
  const [trafficOriginMarker, setTrafficOriginMarker] = useState({
    coords: [51.505, -0.09],
    radius: 5,
  });
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [map, setMap] = useState(null);
  const connectionRef = useRef();
  const allNodesRef = useRef();

  const MarkerWithText = ({ text, position, textColor }) => {
    const html = `<div style="width: 100px; background: none; position: relative; left: 20px; bottom: 5px; color: ${textColor}; display:${
      text ? "" : "none"
    };">${text}</div>`;
    const textIcon = L.divIcon({ html: html });

    return <Marker position={position} icon={textIcon} />;
  };
  useEffect(() => {
    if (map) {
      map.fitBounds(allNodesRef.current.getBounds().pad(0.1));
    }
  }, [map]);

  useEffect(() => {
    setTrafficOriginMarker((prev) => {
      const location = trafficLocations.find(
        (loc) => loc.value === trafficLocation
      );

      return { ...prev, coords: location.coords, label: location.label };
    });
  }, [trafficLocation]);

  useEffect(() => {
    if (databaseNodes?.nodes?.length === undefined) return;
    if (map) {
      map.fitBounds(allNodesRef.current.getBounds().pad(0.1));
    }

    const destination =
      databaseNodes.nodes[databaseNodes.connectedNodeIndex].coords;
    const intermediatePoint = getIntermediatePoint(
      trafficOriginMarker.coords[0],
      trafficOriginMarker.coords[1],
      destination[0],
      destination[1],
      50
    );
    setMapCenter(intermediatePoint);
  }, [databaseNodes, trafficOriginMarker]);

  const originLocationIcon = useMemo(() =>
    L.icon({
      iconSize: [19, 25],
      iconAnchor: [12, 12],
      iconUrl: OriginLocationIcon,
    })
  );

  const handleSnapToZoom = (e) => {
    e.preventDefault();
    if (map) map.fitBounds(connectionRef.current.getBounds().pad(0.1));
  };

  return (
    <div className={classes.mapWrapper}>
      <MapContainer
        center={mapCenter}
        zoom={1}
        zoomControl={false}
        scrollWheelZoom={true}
        className={classes.map}
        whenCreated={setMap}
      >
        <ZoomControl position="bottomright"></ZoomControl>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <FeatureGroup ref={allNodesRef}>
          <FeatureGroup ref={connectionRef} key={"connectionRefKey"}>
            {trafficOriginMarker && (
              <div key={uuidv4()}>
                <Marker
                  key={uuidv4()}
                  position={trafficOriginMarker.coords}
                  icon={originLocationIcon}
                >
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
                <MarkerWithText
                  key={uuidv4()}
                  text={trafficOriginMarker.label}
                  position={trafficOriginMarker.coords}
                  textColor={"#5D5FEF"}
                />
              </div>
            )}

            {databaseNodes &&
              databaseNodes.nodes &&
              databaseNodes.nodes
                .filter((node, idx) => idx === databaseNodes.connectedNodeIndex)
                .map((node) => {
                  return (
                    <div key={uuidv4()}>
                      <CircleMarker
                        center={node.coords}
                        radius={5}
                        color={node.type === "replica" ? "#ED35C5" : "#13A868"}
                        opacity="0.2"
                        weight="10"
                        fill="true"
                        fillColor={
                          node.type === "replica" ? "#ED35C5" : "#13A868"
                        }
                        fillOpacity="1"
                      >
                        <Popup>
                          A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                      </CircleMarker>
                      <MarkerWithText
                        text={node.label}
                        position={node.coords}
                        textColor={
                          node.type === "replica" ? "#ED35C5" : "#13A868"
                        }
                      />
                    </div>
                  );
                })}
          </FeatureGroup>
          {databaseNodes &&
            databaseNodes.nodes &&
            databaseNodes.nodes
              .filter((node, idx) => idx != databaseNodes.connectedNodeIndex)
              .map((node) => {
                return (
                  <div key={uuidv4()}>
                    <CircleMarker
                      center={node.coords}
                      radius={5}
                      color={node.type === "replica" ? "#ED35C5" : "#13A868"}
                      opacity="0.2"
                      weight="10"
                      fill="true"
                      fillColor={
                        node.type === "replica" ? "#ED35C5" : "#13A868"
                      }
                      fillOpacity="1"
                    >
                      <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup>
                    </CircleMarker>
                    <MarkerWithText
                      text={node.label}
                      position={node.coords}
                      textColor={
                        node.type === "replica" ? "#ED35C5" : "#13A868"
                      }
                    />
                  </div>
                );
              })}
        </FeatureGroup>
        <MapPolyLine
          databaseNodes={databaseNodes}
          trafficOriginMarker={trafficOriginMarker}
          getIntermediatePoint={getIntermediatePoint}
        />
      </MapContainer>
      <div className={classes.snapToZoom}>
        <div className="leaflet-control leaflet-bar">
          <a
            href="#"
            onClick={(e) => {
              handleSnapToZoom(e);
            }}
          ></a>
        </div>
      </div>
      <div className={classes.legend}>
        <img src={OriginLocationLegendIcon} height={15} width={10} />
        <div>Phone Location</div>
        <div
          style={{
            height: "10px",
            width: "10px",
            borderRadius: "20px",
            backgroundColor: "#13a868",
          }}
        ></div>
        <div>Primary Node</div>
        <div
          style={{
            height: "10px",
            width: "10px",
            borderRadius: "20px",
            backgroundColor: "#ED35C5",
          }}
        ></div>
        <div>Read Replica</div>
      </div>
    </div>
  );
}
