import { Link } from "react-router-dom";
import StarRating from "../star_rating/StarRating";
import ProductImage from "../product_image/ProductImage";
import { makeStyles, Typography } from "@material-ui/core";
const useStyles = makeStyles((theme) => {
  return {
    card: {
      width: "130px",
      maxHeight: "300px",
      textDecoration: "none",
    },
    cardInfo: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    cardTitle: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(0.5),
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      color: theme.palette.grey[900],
    },
    cardAuthor: {
      color: theme.palette.grey[500],
    },
  };
});
export default function ProductCard(props) {
  const classes = useStyles();
  const { id, title, author, imageLink } = props.info;

  return (
    <Link to={`/store/products/${id}`} className={classes.card}>
      <ProductImage
        height={190}
        width={130}
        imageUrl={`${window.origin}/${imageLink}`}
      />
      <div className={classes.cardInfo}>
        <Typography variant="body1" className={classes.cardTitle}>
          {title}
        </Typography>
        <Typography variant="body2" className={classes.cardAuthor}>
          {author}
        </Typography>
      </div>
    </Link>
  );
}
