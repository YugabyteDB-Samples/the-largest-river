import DatabaseConfig from "../../components/database_config/DatabaseConfig";
import Map from "../../components/map/Map";
import Xray from "../../components/xray/Xray";
import { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  return {
    controlPanelWrapper: {
      // height: "100vh",
      boxSizing: "border-box",
      margin: "20px 10px",
      maxWidth: "calc(100% - 20px)",

      // alignItems: "center",
      // alignItems: "center",
    },
    controlPanelPaper: {},
  };
});

export default function DisabledTabs() {
  const [databases, setDatabases] = useState([]);
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      spacing={2}
      className={classes.controlPanelWrapper}
    >
      <Grid item>
        <Paper className={classes.controlPanelPaper}>
          <DatabaseConfig databases={databases} setDatabases={setDatabases} />
          <Map databases={databases} />
        </Paper>
      </Grid>
      <Grid item>
        <Paper className={classes.controlPanelPaper}>
          <Xray />
        </Paper>
      </Grid>
    </Grid>
  );
}
