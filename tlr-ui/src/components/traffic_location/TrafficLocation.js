import { MenuItem } from "@material-ui/core";
import { YBSelect } from "../../yugabyted-ui/components/YBSelect/YBSelect";
import { useContext, useState } from "react";
import AppContext from "../../AppContext";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => {
  return {
    headingWrapper: {
      color: theme.palette.grey[600],
    },
    heading: {
      marginBottom: 0,
    },
    trafficLocationSelect: {
      minWidth: "250px",
      marginBottom: theme.spacing(1),
    },
  };
});
export default function TrafficLocation() {
  const classes = useStyles();
  const { trafficLocation, setTrafficLocation, trafficLocations } =
    useContext(AppContext);
  const handleTrafficLocationChanged = async (e) => {
    e.preventDefault();
    try {
      setTrafficLocation(e.target.value);
    } catch (e) {
      console.log("error updating traffic location", e);
    }
  };

  return (
    <div className={classes.headingWrapper}>
      <h4 className={classes.heading}>Your Location</h4>
      <YBSelect
        value={trafficLocation}
        onChange={handleTrafficLocationChanged}
        className={classes.trafficLocationSelect}
      >
        {trafficLocations.map(({ id, label }) => (
          <MenuItem value={id} key={id}>
            {label}
          </MenuItem>
        ))}
      </YBSelect>
    </div>
  );
}
