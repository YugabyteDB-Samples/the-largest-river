import ProductImage from "../../components/product_image/ProductImage";
import { makeStyles, Typography } from "@material-ui/core";
import ReturnButton from "../../components/return_button/ReturnButton";
import TLRButton from "../../components/tlr_button/TLRButton";
import AppContext from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { postJSON } from "../../services/rest";
const useStyles = makeStyles((theme) => {
  return {
    cartWrapper: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: "100%",
      gap: theme.spacing(2),
      color: theme.palette.grey[900],
    },
    productRow: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing(2),
    },
    titleAuthorSection: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: theme.spacing(1),
      flex: "1 1 auto",
    },
    author: {
      color: theme.palette.grey[700],
    },
    price: {
      color: theme.palette.text.primaryPurple,
    },
    totals: {
      borderTop: `1px solid ${theme.palette.grey[200]}`,
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    total: {
      display: "flex",
      justifyContent: "space-between",
    },
  };
});
export default function Cart() {
  const {
    currentDatabase,
    handleQueryLogs,
    productsInCart,
    setProductsInCart,
    showExecutionPlan,
    trafficLocation,
  } = useContext(AppContext);
  const classes = useStyles();
  const navigate = useNavigate();

  const subtotal = productsInCart.reduce(
    (previousValue, currentValue) => previousValue + +currentValue.price,
    0
  );

  const handleOrder = async () => {
    try {
      const res = await postJSON(
        `/${trafficLocation}/orders`,
        {
          total: subtotal,
          products: productsInCart.map((prod) => prod.id),
        },
        {
          database: currentDatabase,
          showExecutionPlan,
        }
      );
      const queryLogs = res.queryLogs;
      const explainAnalyzeResults = res.explainAnalyzeResults;
      const latency = res.latency;
      if (queryLogs) {
        handleQueryLogs(queryLogs, explainAnalyzeResults, latency);
      }
      setProductsInCart([]);
      navigate(`/store/confirmation/${res?.data?.id}`);
    } catch (e) {
      console.log("error in handleOrder", e);
    }
  };
  return (
    <div className={classes.cartWrapper}>
      <ReturnButton />
      <Typography variant="h4">Cart</Typography>
      {productsInCart.map((prod) => {
        return (
          <div className={classes.productRow} key={prod.id}>
            <ProductImage
              height={100}
              width={66}
              imageUrl={`${window.origin}/${prod.imageLink}`}
            />
            <div className={classes.titleAuthorSection}>
              <Typography variant="body1" color="textPrimary">
                {prod.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {prod.author}
              </Typography>
            </div>
            <Typography variant="body2" className={classes.price}>
              ${prod.price ? prod.price : " ---"}
            </Typography>
          </div>
        );
      })}
      {productsInCart && productsInCart.length === 0 && (
        <div>Your cart is current empty.</div>
      )}
      {productsInCart && productsInCart.length > 0 && (
        <>
          <div className={classes.totals}>
            <div className={classes.total}>
              <Typography variant="body1" color="textPrimary">
                Subtotal
              </Typography>
              <Typography variant="body2" className={classes.price}>
                {subtotal}
              </Typography>
            </div>
            <div className={classes.total}>
              <Typography variant="body1" color="textPrimary">
                Standard Shipping
              </Typography>
              <Typography variant="body2" className={classes.price}>
                $8.00
              </Typography>
            </div>
          </div>
          <TLRButton
            styles={{ alignSelf: "center", width: "80%" }}
            text={"Buy Now"}
            disabled={productsInCart.length === 0}
            onClick={handleOrder}
          />
        </>
      )}
    </div>
  );
}
