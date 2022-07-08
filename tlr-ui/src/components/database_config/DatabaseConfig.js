import getJSON, { postJSON } from "../../services/rest";
import { MenuItem } from "@material-ui/core";
import { YBSelect } from "../../yugabyted-ui/components/YBSelect/YBSelect";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";
import { useSearchParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => {
  return {
    databseConfig: {
      display: "flex",
      flexWrap: "wrap",
      padding: "10px",
      alignItems: "center",
      color: theme.palette.grey[700],
    },
    headingWrapper: {
      marginRight: theme.spacing(5),
    },
    heading: {
      marginTop: 0,
    },
    dbSelect: {
      minWidth: "250px",
    },
  };
});
export default function DatabaseConfig({ databases, setDatabases }) {
  const classes = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentDatabase, setCurrentDatabase } = useContext(AppContext);

  const getDatabases = async () => {
    try {
      const db = await getJSON("/api/databases");
      setDatabases(db.databases);
    } catch (e) {
      console.log("error in fetching current database", e);
    }
  };
  useEffect(() => {
    getDatabases();
    if (searchParams.has("database")) {
      setCurrentDatabase(searchParams.get("database"));
    }
  }, []);

  const handleDatabaseChanged = async (e) => {
    e.preventDefault();
    setCurrentDatabase(e.target.value);
    const params = {};
    for (const [key, val] of searchParams.entries()) {
      params[key] = val;
    }
    setSearchParams({ ...params, database: e.target.value });
  };

  return (
    <div className={classes.databseConfig}>
      <div className={classes.headingWrapper}>
        <h3 className={classes.heading}>Cluster View</h3>
        <div>
          Select a YugabyteDB cluster to use as the primary database for the
          Store.
        </div>
      </div>
      <YBSelect
        value={currentDatabase}
        onChange={handleDatabaseChanged}
        className={classes.dbSelect}
      >
        {databases.map(({ id, label }) => (
          <MenuItem value={id} key={id}>
            {label}
          </MenuItem>
        ))}
      </YBSelect>
    </div>
  );
}
