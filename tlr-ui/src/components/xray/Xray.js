import { useRef, useEffect, useContext } from "react";
import AppContext from "../../contexts/AppContext";
import { v4 as uuidv4 } from "uuid";
import { makeStyles, Typography } from "@material-ui/core";
import { YBToggle } from "../../yugabyted-ui/components/YBToggle/YBToggle";

const useStyles = makeStyles((theme) => {
  return {
    xrayWrapper: {},
    headingWrapper: {
      color: theme.palette.grey[700],
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      padding: theme.spacing(2),
      display: "flex",
      justifyContent: "space-between",
    },
    heading: {
      marginTop: 0,
    },
    xrayContent: {
      padding: "10px",
      marginTop: "10px",
      maxHeight: "300px",
      overflow: "auto",
      fontFamily: "Menlo-Regular, Courier, monospace",
      color: theme.palette.grey[900],
    },
  };
});
export default function Xray() {
  const classes = useStyles();
  const { queryLogs, showExecutionPlan, setShowExecutionPlan } =
    useContext(AppContext);
  const xrayRef = useRef();

  useEffect(() => {
    xrayRef.current.scrollTop = xrayRef.current.scrollHeight;
    console.log(xrayRef.current.scrollTop);
  }, [queryLogs]);
  return (
    <div className={classes.xrayWrapper}>
      <div className={classes.headingWrapper}>
        <Typography variant="h5" className={classes.heading}>
          X-Ray Panel
        </Typography>
        <YBToggle
          label="Show Execution Plan"
          checked={showExecutionPlan}
          onChange={(e) => {
            setShowExecutionPlan(e.target.checked);
          }}
        ></YBToggle>
      </div>
      <div className={classes.xrayContent} ref={xrayRef}>
        {queryLogs.map((log, i) => {
          return (
            <div key={i}>
              <div>
                {"\u003E"}
                {"       "}
                {log.logs}
              </div>
              {log.explainAnalyzeResults.map((result) => {
                return <div key={uuidv4()}>{result}</div>;
              })}
              {log.latency ? <div>Total Latency: {log.latency} ms</div> : ""}
              <br />
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
}
