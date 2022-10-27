import { makeStyles, Typography } from "@material-ui/core";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../../contexts/AppContext";
import getJSON from "../../services/rest";
import ReturnButton from "../../components/return_button/ReturnButton";
import StarRating from "../../components/star_rating/StarRating";
import ProductImage from "../../components/product_image/ProductImage";
import TLRButton from "../../components/tlr_button/TLRButton";
import { ReactComponent as LoadingCircles } from "../../yugabyted-ui/assets/Default-Loading-Circles.svg";

// theme.palette.background.purpleGradient1;
const useStyles = makeStyles((theme) => {
  return {
    productDetailWrapper: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    productInfo: {
      display: "flex",
      flex: "1 1 auto",
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center",
      gap: theme.spacing(1),
      paddingTop: theme.spacing(1),
    },
    productDetails: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1),
      alignItems: "center",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    price: {
      color: theme.palette.text.primaryPurple,
    },
    LoadingCircles: {
      height: "40px",
      width: "40px",
    },
  };
});
export default function ProductDetail(props) {
  const {
    currentDatabase,
    handleQueryLogs,
    showExecutionPlan,
    trafficLocation,
  } = useContext(AppContext);
  const { setProductsInCart } = props;
  const { productId } = useParams();
  console.log("productId: ", productId);
  const [product, setProduct] = useState();
  const getProduct = useCallback(async () => {
    try {
      const json = await getJSON(`/${trafficLocation}/products/${productId}`, {
        database: currentDatabase,
        showExecutionPlan,
      });
      const data = json.data;
      const queryLogs = json.queryLogs;
      const explainAnalyzeResults = json.explainAnalyzeResults;
      const latency = json.latency;

      if (queryLogs) {
        handleQueryLogs(queryLogs, explainAnalyzeResults, latency);
      }

      setProduct(data);
    } catch (e) {
      console.log("error in product detail", e);
    }
  }, [productId]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const classes = useStyles();
  return (
    <div className={classes.productDetailWrapper}>
      <ReturnButton />
      <div className={classes.productInfo}>
        {product ? (
          <>
            <ProductImage
              height={250}
              width={160}
              imageUrl={`${window.origin}/${product.imageLink}`}
            />
            <div className={classes.productDetails}>
              <Typography variant="h4" color="textPrimary">
                {product?.title}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {product?.author}
              </Typography>

              <Typography variant="body1" className={classes.price}>
                ${product?.price ? product.price : " ---"}
              </Typography>
              <StarRating />
            </div>
            <TLRButton
              text={"Add To Cart"}
              styles={{ width: "60%" }}
              onClick={() => {
                setProductsInCart((prev) => {
                  if (prev.find((elem) => elem.id === product.id)) return prev;

                  return [...prev, product];
                });
              }}
            />
          </>
        ) : (
          <LoadingCircles className={classes.LoadingCircles} />
        )}
      </div>
    </div>
  );
}
