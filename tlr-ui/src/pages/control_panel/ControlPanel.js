import ClusterConfig from "../../components/cluster_config/ClusterConfig";
import Map from "../../components/map/Map";
import Xray from "../../components/xray/Xray";
import { Tabs, Tab } from "react-bootstrap";
import "./controlPanel.scss";
export default function ControlPanel() {
  return (
    <div className="ControlPanel">
      {/* <h1>Control Panel</h1> */}
      <ClusterConfig />
      <Map />
      <Tabs defaultActiveKey="xray" id="control-panel-tabs" className="mb-3">
        <Tab eventKey="xray" title="X-Ray">
          <Xray></Xray>
        </Tab>
        <Tab eventKey="workload" title="Workload Simulator">
          <div>Workload Simulator</div>
        </Tab>
        <Tab eventKey="chaos" title="Chaos Mode" disabled>
          <div>Chaos Mode</div>
        </Tab>
      </Tabs>
    </div>
  );
}
