import ProductCard from "./ProductCard";
import { makeStyles } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
const useStyles = makeStyles((theme) => {
  return {
    productList: {
      display: "flex",
      maxWidth: "500px",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: "15px",
      justifyContent: "center",
    },
  };
});
export default function ProductsList(props) {
  const classes = useStyles();
  return (
    <div className={classes.productList}>
      {props.products.map((product, i) => {
        return <ProductCard info={product} key={uuidv4()} />;
      })}
    </div>
  );
}
