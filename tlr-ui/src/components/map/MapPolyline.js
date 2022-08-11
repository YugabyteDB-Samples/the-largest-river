import { useEffect, useRef, useState } from "react";
import { Polyline } from "react-leaflet";
import { makeStyles } from "@material-ui/core";
let pathColor;
const useStyles = makeStyles((theme) => {
  //TODO: better way to set styles which aren't applied via CSS classes?
  pathColor = theme.palette.grey[600];
});
export default function MapPolyLine(props) {
  useStyles();
  const { trafficOriginMarker, databaseNodes, getIntermediatePoint } = props;
  const pathOptions = {
    color: pathColor,
    dashArray: "5,10",
  };
  const [polyline, setPolyline] = useState({
    origin: trafficOriginMarker.coords,
    percentage: 0,
    points: [],
  });

  const intervalRef = useRef();
  useEffect(() => {
    console.log("UseEffect in Map");
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

    const destination = databaseNodes[0].coords;

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

  return <Polyline pathOptions={pathOptions} positions={[polyline.points]} />;
}
