import "leaflet/dist/leaflet.css";
import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import Products from "./pages/products/Products";
import ErrorPage from "./pages/error/ErrorPage";
import ControlPanel from "./pages/control_panel/ControlPanel";
import { AppProvider } from "./AppContext";
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { mainTheme } from './yugabyted-ui/theme/mainTheme'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    flexWrap: "wrap",
    // overflow: "hidden",
    // boxSizing: "border-box",
    height: "100vh"
  }
}));

function App() {
  const classes = useStyles();
  return (
    <div>
      <AppProvider>
      <ThemeProvider theme={mainTheme}>
        {/* <BackgroundImage> */}
        <CssBaseline />
            <Router>
            <div className={classes.root}>
              <Grid container>
                <Grid item xs={12} md={5} lg={4}>
                <Routes>
                  <Route path="/products/*"element={<Products />}></Route>
                  <Route path="/"element={<Navigate replace to="/products" />}></Route>
                  <Route path="*" element={<ErrorPage />}></Route>
                  </Routes>
                </Grid>
                <Grid item xs={12} md={7} lg={8}>
                  <ControlPanel />
                </Grid>
              </Grid>
            </div>
            </Router>
        </ThemeProvider>
      </AppProvider>
    </div>
  );
}

export default App;

