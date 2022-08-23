import "leaflet/dist/leaflet.css";
import { Routes, Route } from "react-router-dom";
import Main from "./pages/main/Main";
import Landing from "./pages/landing/Landing";
import ErrorPage from "./pages/error/ErrorPage";
import { AppProvider } from "./contexts/AppContext";
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { tlrTheme } from './yugabyted-ui/theme/tlrTheme'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    flexWrap: "wrap",
    height: "100vh"
  },
  container: {
    height: "100%"
  }
}));

function App() {
  const classes = useStyles();
  return (
    <div>
      <AppProvider>
      <ThemeProvider theme={tlrTheme}>
        <CssBaseline />
          <div className={classes.root}>
            <Grid container className={classes.container}>
                <Routes>
                  <Route path="/" element={<Landing />}></Route>
                  <Route path="/store/*" element={<Main />}></Route>
                  <Route path="*" element={<ErrorPage />}></Route>
                </Routes>
            </Grid>
          </div>
        </ThemeProvider>
      </AppProvider>
    </div>
  );
}

export default App;

