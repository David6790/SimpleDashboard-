import React from "react";
import Layout from "../Layouts/Layout";
import SectionHeading from "../Components/SectionHeading";
import ListeUtilisateur from "../Components/ListeUtilisateur";

const UserList = () => {
  return (
    <Layout>
      <SectionHeading title={"Gestion des utilisateurs de l'application"} />
      <ListeUtilisateur />
    </Layout>
  );
};

export default UserList;
