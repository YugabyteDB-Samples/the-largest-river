import ProductsList from "../../components/products/ProductsList";
import { Routes, Route, useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import { useEffect, useState, useContext, useCallback } from "react";
import AppContext from "../../contexts/AppContext";
import getJSON from "../../services/rest";
import ProductDetail from "../product_detail/ProductDetail";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { ReactComponent as LoadingCircles } from "../../yugabyted-ui/assets/Default-Loading-Circles.svg";

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
      display: "flex",
      justifyContent: "center",
    },
  };
});

export default function Products() {
  const location = useLocation();
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    handleQueryLogs,
    trafficLocation,
    currentDatabase,
    productsInCart,
    setProductsInCart,
    showExecutionPlan,
    databaseNodes,
  } = useContext(AppContext);

  const getInfiniteScrollProducts = useCallback(async () => {
    try {
      const json = await getJSON(`/${trafficLocation}/products`, {
        page: currentPage ? parseInt(currentPage) : 1,
        database: currentDatabase,
        isReplicaNode: databaseNodes.isReplicaNode,
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
      setCurrentPage((currentPage) => {
        return currentPage + 1;
      });
    } catch (e) {
      console.log("Error in fetching products", e);
    }
  }, [
    currentPage,
    currentDatabase,
    showExecutionPlan,
    // trafficLocation,
    databaseNodes,
  ]);

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
  }, [databaseNodes]);

  useEffect(() => {
    if (currentPage === 1 && location.pathname === "/store/products")
      getInfiniteScrollProducts();
  }, [currentPage, location]);

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
              hasMore={currentPage <= 10}
              loadMore={() => setTimeout(getInfiniteScrollProducts, 500)}
              loader={
                <div className={classes.loader} key={0}>
                  <LoadingCircles />
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
