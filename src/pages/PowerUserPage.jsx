import React from "react";
import Layout from "../Layouts/Layout";
import PowerUserForm from "../Components/PowerUserForm";
import SectionHeading from "../Components/SectionHeading";

const PowerUserPage = () => {
  return (
    <Layout>
      <SectionHeading title={"POWER-USER Réservations"} />
      <PowerUserForm />
    </Layout>
  );
};

export default PowerUserPage;
