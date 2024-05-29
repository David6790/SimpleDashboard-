import React, { useState } from "react";
import Layout from "../Layouts/Layout";

const PlanDeSalle = () => {
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
      <div className="">
        <div className="w-full px-10 mb-14">
          <div className="pt-10 flex justify-between mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isMultiTable}
                onChange={handleMultiTableToggle}
              />
              <span>Mode Multi-Table</span>
            </label>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Confirmer les Tables Sélectionnées ({selectedTables.length})
            </button>
          </div>
          <div className="overflow-x-auto ">
            <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
              {" "}
              {/* Ajustez min-w selon la largeur totale désirée */}
              <div className="flex flex-row w-1/4 justify-start gap-5 ">
                <div
                  id="T7"
                  className={`table-large rounded-full border-4 border-gray-500 shadow-lg px-16 py-16 ${
                    isSelected("T7") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T7")}
                >
                  T7
                </div>
                <div
                  id="T8"
                  className={`table-large rounded-full border-4 border-gray-500 shadow-lg px-16 py-16 ${
                    isSelected("T8") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T8")}
                >
                  T8
                </div>
              </div>
              <div className="flex flex-row w-2/3 justify-end gap-5 ">
                <div
                  id="T9"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T9") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T9")}
                >
                  T9
                </div>
                <div
                  id="T10"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T10") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T10")}
                >
                  T10
                </div>
                <div
                  id="T11"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T11") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T11")}
                >
                  T11
                </div>
                <div
                  id="T12"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T12") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T12")}
                >
                  T12
                </div>
                <div
                  id="T13"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T13") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T13")}
                >
                  T13
                </div>
                <div
                  id="T14"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T14") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T14")}
                >
                  T14
                </div>
              </div>
            </div>
            <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
              <div className="flex flex-row w-1/4 justify-start ">
                <div
                  id="T6"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T6") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T6")}
                >
                  T6
                </div>
              </div>
              <div className="flex flex-row w-2/3 justify-end ">
                <div
                  id="T15"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T15") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T15")}
                >
                  T15
                </div>
              </div>
            </div>
            <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
              <div className="flex flex-row w-1/3 justify-between  ">
                <div
                  id="T5"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T5") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T5")}
                >
                  T5
                </div>
                <div
                  id="T20"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T20") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T20")}
                >
                  T20
                </div>
              </div>
              <div className="flex flex-row w-2/3 justify-end gap-5 ">
                <div
                  id="T19"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T19") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T19")}
                >
                  T19
                </div>
                <div
                  id="T18"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T18") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T18")}
                >
                  T18
                </div>
                <div
                  id="T16"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T16") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T16")}
                >
                  T16
                </div>
              </div>
            </div>
            <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
              <div className="flex flex-row w-1/4 justify-start ">
                <div
                  id="T4"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T4") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T4")}
                >
                  T4
                </div>
              </div>
              <div className="flex flex-row w-2/3 justify-end ">
                <div
                  id="T17"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T17") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T17")}
                >
                  T17
                </div>
              </div>
            </div>
            <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
              <div className="flex flex-row w-2/3 justify-between gap-5  ">
                <div
                  id="T3"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T3") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T3")}
                >
                  T3
                </div>
                <div className="  px-10 py-10"></div>
                <div
                  id="T22"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T22") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T22")}
                >
                  T22
                </div>
                <div
                  id="T23"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T23") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T23")}
                >
                  T23
                </div>
                <div
                  id="T24"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T24") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T24")}
                >
                  T24
                </div>
                <div
                  id="T25"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T25") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T25")}
                >
                  T25
                </div>
                <div
                  id="T26"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T26") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T26")}
                >
                  T26
                </div>
              </div>
            </div>
            <div className="pt-10 flex flex-row justify-between min-w-[1000px]">
              <div className="flex flex-row w-1/3 justify-between gap-5  ">
                <div
                  id="T2"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T2") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T2")}
                >
                  T2
                </div>
                <div
                  id="T2-BIS"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T2-BIS") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T2-BIS")}
                >
                  T2B
                </div>
                <div
                  id="T1-BIS"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T1-BIS") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T1-BIS")}
                >
                  T1B
                </div>
                <div
                  id="T1"
                  className={`table border-4 border-gray-500 shadow-lg px-10 py-10 ${
                    isSelected("T1") ? "bg-blue-300" : ""
                  }`}
                  onClick={() => handleTableClick("T1")}
                >
                  T1
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlanDeSalle;
