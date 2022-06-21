import "./productDetail.scss";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../../AppContext";
import getJSON from "../../services/rest";
export default function Home() {
  const { handleQueryLogs } = useContext(AppContext);
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const getProduct = useCallback(async () => {
    try {
      let time = Date.now();
      const json = await getJSON(`/api/products/${productId}/recommendations`);
      time = Date.now() - time;
      const data = json.data;
      const queryLogs = json.queryLogs;

      if (queryLogs) {
        handleQueryLogs("Latency: " + time + " " + queryLogs);
      }

      setProduct(data);
    } catch (e) {
      console.log("error in product detail", e);
    }
  }, [productId]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);
  return (
    <div className="product-detail-container">
      This is the Product Detail page for product {productId}
      {JSON.stringify(product?.recommendations)}
    </div>
  );
}
