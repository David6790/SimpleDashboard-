import React from "react";
import Layout from "../Layouts/Layout";
import ReservationForm from "../Components/ReservationForm";
import SectionHeading from "../Components/SectionHeading";

const ReservationPage = () => {
  return (
    <Layout>
      <SectionHeading title={"Prendre une réservation"} />
      <ReservationForm />
    </Layout>
  );
};

export default ReservationPage;
