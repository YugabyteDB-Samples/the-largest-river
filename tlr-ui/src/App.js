import "leaflet/dist/leaflet.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "./pages/products/Products";
import ProductDetail from "./pages/product_detail/ProductDetail";
import ErrorPage from "./pages/error/ErrorPage";
import ControlPanel from "./pages/control_panel/ControlPanel";
import { Row, Col } from "react-bootstrap";
import { AppProvider } from "./AppContext";
function App() {
  return (
    <div>
      <header>TLR</header>
      <AppProvider>
        <Row>
          <Col>
            <Router>
              <Routes>
                <Route path="/" element={<Products />}></Route>
                <Route
                  path="/products/:productId"
                  element={<ProductDetail />}
                ></Route>
                <Route path="*" element={<ErrorPage />}></Route>
              </Routes>
            </Router>
          </Col>
          <Col>
            <ControlPanel />
          </Col>
        </Row>
      </AppProvider>
    </div>
  );
}

export default App;
