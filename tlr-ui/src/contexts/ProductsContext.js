import { createContext, useState } from "react";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [productsInCart, setProductsInCart] = useState([]);

  return (
    <ProductsContext.Provider
      value={{
        productsInCart,
        setProductsInCart,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export default ProductsContext;
