import Form from "react-bootstrap/Form";
import { postJSON } from "../../services/rest";
export default function ClusterConfig() {
  const handleOptionChanged = async (e) => {
    e.preventDefault();
    try {
      await postJSON("/api/database-config", { cluster: e.target.value });
    } catch (e) {
      console.log("error in database config", e);
    }
  };
  return (
    <div>
      <Form.Select
        aria-label="Default select example"
        onChange={handleOptionChanged}
      >
        <option>Open this select menu</option>
        <option value="1">Cluster 1</option>
        <option value="2">Cluster 2</option>
      </Form.Select>
    </div>
  );
}
