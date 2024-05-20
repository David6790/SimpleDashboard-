import { useGetMenuDuJourQuery } from "../services/reservations";

export default function MenuDuJour() {
  const { data: menu } = useGetMenuDuJourQuery();

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long", // "lundi"
      year: "numeric", // "2020"
      month: "long", // "juillet"
      day: "numeric", // "20"
    });
  }

  function formatDateNoWeek(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric", // "2020"
      month: "long", // "juillet"
      day: "numeric", // "20"
    });
  }

  return (
    <>
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6 mt-10 mb-10">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Menu de la semaine :
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {`Du ${menu && formatDateNoWeek(menu[0].date)} au ${
            menu && formatDateNoWeek(menu[0].date)
          }`}
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menu &&
          menu.map((mj) => (
            <li
              key={mj.id}
              className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
            >
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-sm font-medium text-gray-900">
                      {formatDate(mj.date)}
                    </h3>
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-500">
                    Entrée: {mj.entree}
                  </p>
                  <p className="mt-1 truncate text-sm text-gray-500">
                    Plat: {mj.plat}
                  </p>
                </div>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="-ml-px flex w-0 flex-1">
                    <a
                      href={"google.com"}
                      className="relative inline-flex w-0 flex-1 items-center justify-start px-5 gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Modifier
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-sm font-medium text-gray-900">
                  Les desserts de la semaine
                </h3>
              </div>
              <p className="mt-1 text-sm text-gray-500 whitespace-normal">
                Cheesecake : {menu && menu[0].cheesecake}
              </p>
              <p className="mt-1 text-sm text-gray-500 whitespace-normal">
                Dessert : {menu && menu[0].dessertJour}
              </p>
            </div>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="-ml-px flex w-0 flex-1">
                <a
                  href={"google.com"}
                  className="relative inline-flex w-0 flex-1 items-center justify-start px-5 gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  Modifier
                </a>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}
