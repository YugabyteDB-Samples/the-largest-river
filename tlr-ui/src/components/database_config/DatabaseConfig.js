import getJSON from "../../services/rest";
import { Box, MenuItem, Typography } from "@material-ui/core";
import { YBDropdown } from "../../yugabyted-ui/components/YBDropdown/YBDropdown";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../contexts/AppContext";
import { ReactComponent as CaretDownIcon } from "../../yugabyted-ui/assets/caret-down.svg";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => {
  return {
    databseConfig: {
      display: "flex",
      flexWrap: "wrap",
      padding: theme.spacing(2),
      alignItems: "center",
      color: theme.palette.grey[700],
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
    },
    headingWrapper: {
      marginRight: theme.spacing(5),
      flexGrow: 0,
    },
    heading: {
      marginTop: 0,
    },
    dbSelect: {
      minWidth: "250px",
    },
    dropdown: {
      cursor: "pointer",
      minWidth: "400px",
    },
    dropdownBox: {
      width: "400px",
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: "10px",
      padding: theme.spacing(1),
      display: "flex",
      justifyContent: "space-between",
    },
    dropdownMenuItem: {
      flexDirection: "column",
      height: "auto",
      width: "400px",
      alignItems: "flex-start",
    },
    sublabel: {
      textOverflow: "wrap",
      whiteSpace: "normal",
    },
  };
});
export default function DatabaseConfig() {
  const classes = useStyles();
  const { currentDatabase, setCurrentDatabase, databases } =
    useContext(AppContext);

  const handleDatabaseChanged = async (val) => {
    setCurrentDatabase(val);
    localStorage.setItem("currentDatabase", val);
  };

  const label = databases.find((db) => db.id === currentDatabase)?.label;
  return (
    <div className={classes.databseConfig}>
      <div className={classes.headingWrapper}>
        <Typography className={classes.heading} variant="h5">
          Cluster View
        </Typography>
      </div>

      <YBDropdown
        origin={
          <Box
            display="flex"
            alignItems="center"
            className={classes.dropdownBox}
          >
            <Typography variant="body2" color="textPrimary">
              {label}
            </Typography>
            <CaretDownIcon />
          </Box>
        }
        position={"bottom"}
        growDirection={"right"}
        className={classes.dropdown}
      >
        {databases.map(({ id, label, sublabel }) => (
          <MenuItem
            value={id}
            key={id}
            className={classes.dropdownMenuItem}
            onClick={() => handleDatabaseChanged(id)}
          >
            <Typography variant="body2">{label}</Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              className={classes.sublabel}
            >
              {sublabel}
            </Typography>
          </MenuItem>
        ))}
      </YBDropdown>
    </div>
  );
}
