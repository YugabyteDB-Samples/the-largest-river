import "./productList.scss";
import Row from "react-bootstrap/Row";
import ProductCard from "./ProductCard";
export default function ProductsList(props) {
  return (
    <Row xs={2} sm={2} md={2} xl={2} xxl={2} xxxl={3} className="product-list">
      {props.products.map((product, i) => {
        return <ProductCard info={product} key={i} />;
      })}
    </Row>
  );
}
