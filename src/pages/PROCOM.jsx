import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import Layout from "../Layouts/Layout";
import SectionHeading from "../Components/SectionHeading";
import { useGetAllProcomsQuery } from "../services/procomApi"; // Import du hook RTK Query
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import du hook useNavigate

const getStatusLabelAndStyle = (statusCode) => {
  switch (statusCode) {
    case 1:
      return {
        label: "En instance",
        style: "text-gray-600 bg-gray-50 ring-gray-500/10",
      };
    case 2:
      return {
        label: "Proposition envoyée",
        style: "text-blue-700 bg-blue-50 ring-blue-600/20",
      };
    case 3:
      return {
        label: "En discussion",
        style: "text-yellow-700 bg-yellow-50 ring-yellow-600/20",
      };
    case 4:
      return {
        label: "Validée",
        style: "text-green-700 bg-green-50 ring-green-600/20",
      };
    case 5:
      return {
        label: "Archivée",
        style: "text-gray-500 bg-gray-200 ring-gray-400/10",
      };
    default:
      return {
        label: "Inconnu",
        style: "text-red-700 bg-red-50 ring-red-600/10",
      };
  }
};

// Fonction pour combiner les classes
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PROCOM() {
  const { data: procoms, isLoading, isError } = useGetAllProcomsQuery(); // Utilisation du hook RTK Query
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate(); // Initialiser useNavigate

  // Fonction pour gérer le clic sur "Voir le dossier"
  const handleViewProcom = (id) => {
    navigate(`/procom-main/${id}`);
  };

  console.log(procoms);

  if (isLoading) {
    return (
      <Layout>
        <SectionHeading title={"Propositions Commerciales"} />
        <p className="text-center text-blue-600 font-semibold mt-5">
          Chargement des données...
        </p>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <SectionHeading title={"Propositions Commerciales"} />
        <p className="text-center text-red-600 font-semibold mt-5">
          Une erreur s'est produite lors de la récupération des données.
        </p>
      </Layout>
    );
  }

  // Filtrer les PROCOMs en fonction de la recherche et du statut sélectionné
  const filteredProcoms = procoms.filter((procom) => {
    const matchesSearch = procom.titre
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus
      ? procom.status.toString() === filterStatus
      : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <SectionHeading title={"Propositions Commerciales"} />
      <div className="mb-6 rounded-md bg-blue-50 p-4 shadow-sm mt-6">
        <p className="text-sm text-blue-800 font-medium">
          Bienvenue dans la section des propositions commerciales (PROCOMs).
          Vous pouvez consulter, filtrer et gérer vos dossiers commerciaux.
          Utilisez les options ci-dessous pour rechercher un dossier ou
          sélectionner un statut spécifique.
        </p>
      </div>
      <div className="mb-4 flex justify-start">
        <button
          type="button"
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Créer une PROCOM
        </button>
      </div>

      {/* Barre de recherche et filtre */}
      <div className="mb-6 flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-md shadow-sm">
        <input
          type="text"
          placeholder="Rechercher un PROCOM..."
          className="w-full lg:w-2/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="w-full lg:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="1">En instance</option>
          <option value="2">Proposition envoyée</option>
          <option value="3">En discussion</option>
          <option value="4">Validée</option>
          <option value="5">Archivée</option>
        </select>
      </div>

      {/* Liste des PROCOMs */}
      <ul className="divide-y divide-gray-200 bg-white shadow rounded-md">
        {filteredProcoms.map((procom) => {
          return (
            <li
              key={procom.id}
              className="flex items-center justify-between gap-x-6 p-5 hover:bg-gray-50 transition "
            >
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <p className="text-base font-semibold text-gray-900">
                    {procom.titre}
                  </p>
                  <p
                    className={classNames(
                      getStatusLabelAndStyle(procom.status).style,
                      "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {getStatusLabelAndStyle(procom.status).label}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-x-2 text-sm text-gray-500">
                  <p className="whitespace-nowrap">
                    Échéance le{" "}
                    <time dateTime={procom.dueDateTime}>
                      {new Date(procom.dateEcheance).toLocaleDateString(
                        "fr-FR"
                      )}
                    </time>
                  </p>
                  <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                    <circle r={1} cx={1} cy={1} />
                  </svg>
                  <p className="truncate">
                    Affecté à {procom.assignedUserName}
                  </p>
                </div>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <button
                  onClick={() => handleViewProcom(procom.reservationId)}
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
                >
                  Voir le dossier
                </button>
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="p-2 text-gray-500 hover:text-gray-900">
                    <EllipsisVerticalIcon
                      aria-hidden="true"
                      className="w-5 h-5"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5">
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-3 py-1 text-sm text-gray-900 hover:bg-gray-50"
                      >
                        Modifier
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-3 py-1 text-sm text-gray-900 hover:bg-gray-50"
                      >
                        Déplacer
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-3 py-1 text-sm text-gray-900 hover:bg-gray-50"
                      >
                        Supprimer
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
}
