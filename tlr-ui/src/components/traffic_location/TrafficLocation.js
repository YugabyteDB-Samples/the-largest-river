import { MenuItem, Typography } from "@material-ui/core";
import { YBSelect } from "../../yugabyted-ui/components/YBSelect/YBSelect";
import { useContext, useState } from "react";
import AppContext from "../../contexts/AppContext";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => {
  return {
    headingWrapper: {
      padding: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
      color: theme.palette.grey[600],
    },
    heading: {
      marginBottom: 0,
    },
    trafficLocationSelect: {
      minWidth: "250px",
      marginBottom: theme.spacing(2),
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
      localStorage.setItem("trafficLocation", e.target.value);
    } catch (e) {
      console.log("error updating traffic location", e);
    }
  };

  return (
    <div className={classes.headingWrapper}>
      <Typography variant="button" className={classes.heading}>
        Phone Location
      </Typography>
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
