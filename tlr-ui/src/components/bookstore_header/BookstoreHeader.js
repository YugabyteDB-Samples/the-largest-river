import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { ReactComponent as BookstoreTextLogo } from "../../assets/bookstore-text-logo.svg";
import { ReactComponent as CartLogo } from "../../assets/cart.svg";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => {
  return {
    bookstoreHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      width: "100%",
      alignSelf: "flex-start",
      color: theme.palette.grey[700],
      // cursor: "pointer",
    },
    bookstoreHeading: {
      textDecoration: "none",
      color: theme.palette.grey[700],
    },
    cartWidget: {
      position: "relative",
      cursor: "pointer",
      textDecoration: "none",
      color: theme.palette.grey[700],
    },
    BsCartPlus: {
      height: "20px",
      width: "20px",
      alignSelf: "center",
      // cursor: "pointer",
    },
    countCircle: {
      height: "10px",
      width: "10px",
      borderRadius: "20px",
      backgroundColor: theme.palette.background.purple,
      position: "absolute",
      top: "-3px",
      right: "-5px",

      "&.newItemInCart:after": {
        content: "''",
        position: "absolute",
        left: 0,
        top: 0,
        display: "block",
        width: "100%",
        height: "100%",
        backgroundColor: `${theme.palette.background.purple}`,
        borderRadius: "15px",
        animation:
          "$pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s infinite",
      },
    },
    "@keyframes pulse-dot": {
      "0%": {
        transform: "scale(1)",
      },
      "50%": {
        transform: "scale(1.4)",
      },
      "100%": {
        transform: "scale(1)",
      },
    },
  };
});
export default function BookstoreHeader(props) {
  const { count } = props;
  const classes = useStyles();
  const [isNewItem, setIsNewItem] = useState(false);

  function handleNewItem() {
    setIsNewItem(true);
    setTimeout(function () {
      setIsNewItem(false);
    }, 5000);
  }
  useEffect(() => {
    if (count > 0) {
      handleNewItem();
    }
  }, [count]);
  return (
    <div className={classes.bookstoreHeader}>
      <Link to="/store/products" className={classes.bookstoreHeading}>
        <BookstoreTextLogo />
      </Link>
      <Link to="/store/cart">
        <div className={classes.cartWidget}>
          <CartLogo className={classes.BsCartPlus} />
          {count > 0 &&
            (isNewItem ? (
              <div className={`${classes.countCircle} newItemInCart`}></div>
            ) : (
              <div className={classes.countCircle}></div>
            ))}
        </div>
      </Link>
    </div>
  );
}
