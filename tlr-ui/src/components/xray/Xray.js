import React, { useRef, useEffect, useContext } from "react";
import AppContext from "../../AppContext";
import { v4 as uuidv4 } from "uuid";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => {
  return {
    xrayWrapper: {
      padding: "10px",
    },
    headingWrapper: {
      color: theme.palette.grey[700],
    },
    heading: {
      marginTop: 0,
    },
    xrayContent: {
      marginTop: "10px",
      maxHeight: "300px",
      overflow: "auto",
    },
  };
});
export default function Xray() {
  const classes = useStyles();
  const { queryLogs } = useContext(AppContext);
  const xrayRef = useRef();

  useEffect(() => {
    xrayRef.current.scrollTop = xrayRef.current.scrollHeight;
  }, [queryLogs]);
  return (
    <div ref={xrayRef} className={classes.xrayWrapper}>
      <div className={classes.headingWrapper}>
        <h3 className={classes.heading}>X-Ray Panel</h3>
        <div>
          Select a YugabyteDB cluster to use as the primary database for the
          Store.
        </div>
      </div>
      <div className={classes.xrayContent}>
        {queryLogs.map((log, i) => {
          return (
            <div key={i}>
              {"\u003E"}
              {"       "}
              {log.logs}
              {log.explainAnalyzeResults.map((result) => {
                return <div key={uuidv4()}>{result}</div>;
              })}
              <br />
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
}
