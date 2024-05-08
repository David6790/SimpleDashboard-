import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
}) => {
  const totalPage = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 mt-10 flex justify-center">
        <div className="flex items-center justify-center bg-white px-4 py-3 sm:px-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`mx-1 px-4 py-2 text-sm font-medium ${
                currentPage === number
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPage, currentPage + 1))}
            disabled={currentPage === totalPage}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-700 m-auto text-center">
        Affichage de{" "}
        {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} à{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} sur {totalItems}{" "}
        résultats
      </div>
    </>
  );
};

export default Pagination;
