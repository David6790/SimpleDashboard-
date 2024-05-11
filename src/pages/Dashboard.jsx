import React from "react";
import Layout from "../Layouts/Layout";
import SectionHeading from "../Components/SectionHeading";

import PreviewTableDashboard from "../Components/PreviewTableDashboard";
import BanniereStat from "../Components/BanniereStat";
import MenuDuJour from "../Components/MenuDuJour";

const Dashboard = () => {
  return (
    <Layout>
      <SectionHeading title={"IL GIRASOLE"} />
      <BanniereStat />
      <PreviewTableDashboard />
      <MenuDuJour />
    </Layout>
  );
};

export default Dashboard;
