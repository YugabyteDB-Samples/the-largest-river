import "./productList.scss";
import ProductCard from "./ProductCard";
export default function ProductsList(props) {
  return (
    <div className="product-list">
      {props.products.map((product, i) => {
        return <ProductCard info={product} key={product.id} />;
      })}
    </div>
  );
}
