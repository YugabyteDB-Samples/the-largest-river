import "leaflet/dist/leaflet.css";
import { Navigate, Routes, Route } from "react-router-dom";
import Products from "../products/Products";
import Cart from "../cart/Cart";
import Confirmation from "../confirmation/Confirmation";
import ControlPanel from "../control_panel/ControlPanel";
import TrafficLocation from "../../components/traffic_location/TrafficLocation";
import BookstoreHeader from "../../components/bookstore_header/BookstoreHeader";
import Phone from "../../components/phone/Phone";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import React, { useContext } from "react";
import AppContext from "../../contexts/AppContext";
import { mainTheme } from "../../yugabyted-ui/theme/mainTheme";
import { ReactComponent as LoadingCircles } from "../../yugabyted-ui/assets/Default-Loading-Circles.svg";

const useStyles = makeStyles((theme) => ({
  trafficLocation: {
    minWidth: "250px",
    boxShadow: "0px 0px 24px 0px #00000040",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  phoneContent: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    height: "600px",
    width: "100%",
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    alignItems: "center",
    overflow: "scroll",
  },
  loadingCircles: {
    height: "40px",
    width: "40px",
  },
}));

function Main() {
  const { productsInCart, loading } = useContext(AppContext);
  const classes = useStyles();
  return (
    <>
      {loading ? (
        <LoadingCircles className={classes.loadingCircles} />
      ) : (
        <>
          <Grid item xs={12} md={5} lg={4}>
            <Phone>
              <BookstoreHeader count={productsInCart.length} />
              <div className={classes.phoneContent}>
                <Routes>
                  <Route path="/products/*" element={<Products />}></Route>
                  <Route path="/cart" element={<Cart />}></Route>
                  <Route
                    path="/confirmation/:confirmationId"
                    element={<Confirmation />}
                  ></Route>
                </Routes>
              </div>
              <div className={classes.trafficLocation}>
                <TrafficLocation />
              </div>
            </Phone>
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <ThemeProvider theme={mainTheme}>
              <ControlPanel />
            </ThemeProvider>
          </Grid>
        </>
      )}
    </>
  );
}

export default Main;
