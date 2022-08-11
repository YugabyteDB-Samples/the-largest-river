import { Link } from "react-router-dom";
import { makeStyles, Typography } from "@material-ui/core";
import { ReactComponent as BookstoreTextLogo } from "../../assets/bookstore-text-logo.svg";
import { ReactComponent as CartLogo } from "../../assets/cart.svg";

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
    },
  };
});
export default function BookstoreHeader(props) {
  const { count } = props;
  const classes = useStyles();

  return (
    <div className={classes.bookstoreHeader}>
      <Link to="/store/products" className={classes.bookstoreHeading}>
        <BookstoreTextLogo />
        {/* <Typography variant="h5">Yuga Bookstore</Typography> */}
      </Link>
      <Link to="/store/cart">
        <div className={classes.cartWidget}>
          <CartLogo className={classes.BsCartPlus} />
          {count > 0 && <div className={classes.countCircle}></div>}
        </div>
      </Link>
    </div>
  );
}
