import ProductsList from "../../components/products/ProductsList";
import { Routes, Route } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import { useEffect, useState, useContext, useCallback } from "react";
import AppContext from "../../contexts/AppContext";
import getJSON from "../../services/rest";
import ProductDetail from "../product_detail/ProductDetail";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  return {
    allBooks: {
      color: theme.palette.grey[700],
      alignSelf: "flex-start",
      marginLeft: theme.spacing(2),
      marginBottom: theme.spacing(2),
      fontSize: "15px",
    },
    loader: {
      textAlign: "center",
    },
  };
});

export default function Products() {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [productsState, setProductsState] = useState({
    currentPage: 1,
  });

  const {
    handleQueryLogs,
    trafficLocation,
    currentDatabase,
    productsInCart,
    setProductsInCart,
    showExecutionPlan,
  } = useContext(AppContext);

  const getInfiniteScrollProducts = useCallback(async () => {
    try {
      const json = await getJSON(`/${trafficLocation}/products`, {
        page: productsState.currentPage
          ? parseInt(productsState.currentPage)
          : 1,
        database: currentDatabase,
        showExecutionPlan,
      });
      const { data, page, queryLogs, explainAnalyzeResults, latency } = json;

      if (queryLogs) {
        handleQueryLogs(queryLogs, explainAnalyzeResults, latency);
      }

      setProducts((prevProducts) => {
        return [...prevProducts, ...data];
      });
      setProductsCount(data.count);
      setProductsState((prevState) => {
        return { ...prevState, currentPage: prevState.currentPage + 1 };
      });
    } catch (e) {
      console.log("Error in fetching products", e);
    }
  }, [productsState.currentPage, currentDatabase, showExecutionPlan]);

  useEffect(() => {
    getInfiniteScrollProducts();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Typography variant="body1" className={classes.allBooks}>
              All Books
            </Typography>
            <InfiniteScroll
              pageStart={1}
              hasMore={productsState.currentPage <= 10}
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
          </>
        }
      ></Route>
      <Route
        path="/:productId"
        element={<ProductDetail setProductsInCart={setProductsInCart} />}
      ></Route>
    </Routes>
  );
}
