import React from "react";
import Layout from "../Layouts/Layout";
import SectionHeading from "../Components/SectionHeading";
import { useGetReservationsQuery } from "../services/reservations";
import PreviewTableDashboard from "../Components/PreviewTableDashboard";

const Dashboard = () => {
  const { data: reservations, error, isLoading } = useGetReservationsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(reservations ? reservations : "");
  return (
    <Layout>
      <SectionHeading title={"IL GIRASOLE"} />
      <PreviewTableDashboard />
    </Layout>
  );
};

export default Dashboard;
