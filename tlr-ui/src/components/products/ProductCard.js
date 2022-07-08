import { Link } from "react-router-dom";
import StarRating from "../star_rating/StarRating";
import { BsCartPlus } from "react-icons/bs";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => {
  return {
    card: {
      width: "150px",
      maxHeight: "400px",
      color: theme.palette.grey[700],
      textDecoration: "none",
    },
    img: {
      width: "150px",
      height: "150px",
      backgroundPosition: "50% 50%",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      borderRadius: "10px",
    },
    cardTitle: {
      color: "inherit",
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(0.5),
    },
  };
});
export default function ProductCard(props) {
  const classes = useStyles();
  const { id, title, price, imUrl } = props.info;
  // TODO: worried about serving http URL in production, will we be able to load these from thelargestriver.com?
  const imageUrl = imUrl
    ? imUrl.replace(
        "http://ecx.images-amazon.com",
        "https://images-na.ssl-images-amazon.com"
      )
    : "";
  return (
    <Link to={`/products/${id}`} className={classes.card}>
      <div
        className={classes.img}
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      ></div>
      <h3 className={classes.cardTitle}>{title}</h3>
      <div className={classes.cardText}>
        Some quick example text to build on the card title and make up the bulk
        of the card's content.
      </div>
      <StarRating />
      <span className="BsCartPlus">
        <BsCartPlus />
      </span>
    </Link>
  );
}
