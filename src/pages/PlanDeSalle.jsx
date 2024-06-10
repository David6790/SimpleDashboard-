import React, { useState } from "react";
import Modal from "react-modal";

import Layout from "../Layouts/Layout";
import ModalPlan from "./ModalPlan";

Modal.setAppElement("#root");

const PlanDeSalle = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);
  const [isMultiTable, setIsMultiTable] = useState(false);

  const handleTableClick = (tableId) => {
    if (isMultiTable) {
      setSelectedTables((prev) =>
        prev.includes(tableId)
          ? prev.filter((id) => id !== tableId)
          : [...prev, tableId]
      );
    } else {
      setSelectedTables([tableId]);
    }
  };

  const handleMultiTableToggle = () => {
    setIsMultiTable((prev) => !prev);
    setSelectedTables([]);
  };

  const isSelected = (tableId) => selectedTables.includes(tableId);

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setModalIsOpen(true)}
        >
          Ouvrir le Plan de Salle
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="fixed inset-10 bg-white p-4 overflow-auto rounded-md shadow-lg outline-none flex flex-col z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40"
      >
        <button
          className="self-end bg-red-500 text-white px-4 py-2 rounded mb-4"
          onClick={() => setModalIsOpen(false)}
        >
          Fermer
        </button>
        <ModalPlan
          selectedTables={selectedTables}
          handleTableClick={handleTableClick}
          isSelected={isSelected}
          isMultiTable={isMultiTable}
          handleMultiTableToggle={handleMultiTableToggle}
        />
      </Modal>
    </Layout>
  );
};

export default PlanDeSalle;
