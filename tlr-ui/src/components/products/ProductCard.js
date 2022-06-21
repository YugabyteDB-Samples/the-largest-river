import "./productCard.scss";
import { Link } from "react-router-dom";
import StarRating from "../star_rating/StarRating";
import Card from "react-bootstrap/Card";
import { BsCartPlus } from "react-icons/bs";
export default function ProductCard(props) {
  // console.log(props.info);
  const { id, title, price, imUrl } = props.info;
  // TODO: worried about serving http URL in production, will we be able to load these from thelargestriver.com?
  const imageUrl = imUrl
    ? imUrl.replace(
        "http://ecx.images-amazon.com",
        "https://images-na.ssl-images-amazon.com"
      )
    : "";
  return (
    <Card style={{ width: "18rem" }}>
      {/* <Card.Img variant="top" src={imUrl} /> */}
      <Card.Body>
        <div
          className="img"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        ></div>
        <Link to={`/products/${id}`}>
          <Card.Title>{title}</Card.Title>
        </Link>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <StarRating />
        <span className="BsCartPlus">
          <BsCartPlus />
        </span>
      </Card.Body>
    </Card>
  );
}
