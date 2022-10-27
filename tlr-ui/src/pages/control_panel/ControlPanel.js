import DatabaseConfig from "../../components/database_config/DatabaseConfig";
import Map from "../../components/map/Map";
import Xray from "../../components/xray/Xray";
import Paper from "@material-ui/core/Paper";
import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  return {
    controlPanelWrapper: {
      boxSizing: "border-box",
      margin: "20px 10px",
      maxWidth: "calc(100% - 20px)",
      height: "calc(100% - 40px)",
      maxHeight: "calc(100% - 40px)",
      display: "flex",
      flexDirection: "column",
    },
    xrayGridItem: {
      flex: "1 1 auto",
    },
    xrayPaper: {
      position: "relative",
      minHeight: "400px",
      height: "100%",
    },
  };
});

export default function DisabledTabs() {
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
          <DatabaseConfig />
          <Map />
        </Paper>
      </Grid>
      <Grid item className={classes.xrayGridItem}>
        <Paper className={classes.xrayPaper}>
          <Xray />
        </Paper>
      </Grid>
    </Grid>
  );
}
