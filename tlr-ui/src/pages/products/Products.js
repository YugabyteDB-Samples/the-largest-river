import "./productsPage.scss";
import ProductsList from "../../components/products/ProductsList";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useSearchParams,
} from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import { useEffect, useState, useRef, useContext, useCallback } from "react";
import AppContext from "../../AppContext";
import getJSON from "../../services/rest";
import TrafficLocation from "../../components/traffic_location/TrafficLocation";
import ProductDetail from "../product_detail/ProductDetail";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => {
  return {
    wrapper: {
      background: `linear-gradient(
      ${theme.palette.background.purpleGradient1},
      ${theme.palette.background.purpleGradient2}
    )`,
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      height: "100vh",
      padding: "10px",
    },
    trafficLocation: {
      minWidth: "250px",
    },
    products: {
      display: "flex",
      flexDirection: "column",
      alignSelf: "center",
      height: "760px",
      width: "370px",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      background: "white",
      overflow: "hidden",
      borderRadius: "40px",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(2),
    },
    productsContent: {
      height: "600px",
      display: "flex",
      flex: "1 1 auto",
      flexDirection: "column",
      alignItems: "center",
      overflow: "scroll",
    },
    loader: {
      textAlign: "center",
    },
  };
});

export default function Products() {
  const classes = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [productsState, setProductsState] = useState({
    pageLength: 0,
    currentPage: 1,
  });

  const { handleQueryLogs, trafficLocation, currentDatabase } =
    useContext(AppContext);

  const getInfiniteScrollProducts = useCallback(async () => {
    try {
      console.log("productsState.currentPage", productsState.currentPage);
      const json = await getJSON(`/${trafficLocation}/products`, {
        page: productsState.currentPage
          ? parseInt(productsState.currentPage)
          : 1,
        database: searchParams.has("database")
          ? parseInt(searchParams.get("database"))
          : 1,
      });
      const data = json.data;
      const page = json.page;
      const queryLogs = json.queryLogs;
      const explainAnalyzeResults = json.explainAnalyzeResults;

      if (queryLogs) {
        handleQueryLogs(queryLogs, explainAnalyzeResults);
      }

      setProducts((prevProducts) => {
        return [...prevProducts, ...data.rows];
      });
      setProductsCount(data.count);
      setProductsState((prevState) => {
        return { ...prevState, currentPage: prevState.currentPage + 1 };
      });
    } catch (e) {
      console.log("Error in fetching products", e);
    }
  }, [productsState, searchParams]);

  useEffect(() => {
    getInfiniteScrollProducts();
  }, []);

  return (
    <div className={classes.wrapper}>
      <div className={classes.products}>
        <div className={classes.trafficLocation}>
          <TrafficLocation />
        </div>
        <div className={classes.productsContent}>
          <Routes>
            <Route
              path="/products/:productId"
              element={<ProductDetail />}
            ></Route>
            <Route
              path="/*"
              element={
                <InfiniteScroll
                  pageStart={0}
                  hasMore={true}
                  loadMore={getInfiniteScrollProducts}
                  loader={
                    <div className={classes.loader} key={0}>
                      Loading ...
                    </div>
                  }
                  useWindow={false}
                  initialLoad={false}
                >
                  <ProductsList products={products} />
                </InfiniteScroll>
              }
            ></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}
