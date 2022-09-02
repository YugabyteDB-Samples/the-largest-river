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
      // fontFamily: "Menlo-Regular, Courier, monospace",
      fontFamily: "Andale Mono",
      color: "#031541",
    },
    logMessage: {
      lineHeight: "150%",
    },
    prefix: {
      color: "#5D5FEF",
    },
    result: {
      color: "#0A2972",
    },
  };
});

function ExplainAnalyzeResult({ message }) {
  const classes = useStyles();

  let prefix, result;

  if (message.indexOf("Planning Time:") > -1) {
    prefix = "Planning Time:";
    result = message.split("Planning Time:")[1];
  } else if (message.indexOf("Execution Time:") > -1) {
    prefix = "Execution Time:";
    result = message.split("Execution Time:")[1];
  } else if (message.indexOf("Peak Memory Usage:") > -1) {
    prefix = "Peak Memory Usage:";
    result = message.split("Peak Memory Usage:")[1];
  } else if (message.indexOf("Total Latency:") > -1) {
    prefix = "Total Latency:";
    result = message.split("Total Latency:")[1];
  }

  return (
    <div className={classes.logMessage}>
      {prefix ? (
        <>
          <span className={classes.prefix}>{prefix}</span>
          <span className={classes.result}>{result}</span>
        </>
      ) : (
        message
      )}
    </div>
  );
}
export default function Xray() {
  const classes = useStyles();
  const { queryLogs, showExecutionPlan, setShowExecutionPlan } =
    useContext(AppContext);
  const xrayRef = useRef();

  useEffect(() => {
    xrayRef.current.scrollTop = xrayRef.current.scrollHeight;
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
            <div key={uuidv4()}>
              <div>
                {"\u003E"}
                {"       "}
                {log.logs}
              </div>
              {log.explainAnalyzeResults.map((result) => {
                return <ExplainAnalyzeResult message={result} key={uuidv4()} />;
              })}
              {log.latency ? (
                <ExplainAnalyzeResult
                  message={`Total Latency: ${log.latency} ms`}
                  key={uuidv4()}
                />
              ) : (
                ""
              )}
              <br />
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
}
