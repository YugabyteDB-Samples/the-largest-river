import "./productsPage.scss";
import ProductsList from "../../components/products/ProductsList";
import Pagination from "../../components/pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import AppContext from "../../AppContext";
import getJSON from "../../services/rest";
const PAGE_SIZE = 10;

export default function Products() {
  const [searchParams /* setSearchParams */] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [productsState, setProductsState] = useState({
    pageLength: 0,
  });

  const { handleQueryLogs } = useContext(AppContext);

  const pageRef = useRef(
    searchParams.has("page") ? parseInt(searchParams.get("page")) : 1
  );

  const getProducts = useCallback(async () => {
    //   only update products from last request, guards against race conditions
    pageRef.current = searchParams.has("page")
      ? parseInt(searchParams.get("page"))
      : 1;
    try {
      const query = new URLSearchParams(searchParams);
      const json = await getJSON("/api/products?" + query);
      const data = json.data;
      const page = json.page;
      const queryLogs = json.queryLogs;

      if (queryLogs) {
        handleQueryLogs(queryLogs);
      }

      //   only update products from last request, guards against race conditions
      if (page === pageRef.current) {
        setProducts(data.rows);
        setProductsCount(data.count);
      }
    } catch (e) {
      console.log("Error in fetching products", e);
    }
  }, [searchParams]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const updatePageLength = useCallback(() => {
    const pageLength = Math.ceil(productsCount / PAGE_SIZE);
    setProductsState({
      ...productsState,
      pageLength,
    });
  }, [productsCount]);

  useEffect(() => {
    updatePageLength();
  }, [updatePageLength]);

  return (
    <div className="products-page">
      <Pagination pageRef={pageRef} pageLength={productsState.pageLength} />
      <ProductsList products={products} />
    </div>
  );
}
