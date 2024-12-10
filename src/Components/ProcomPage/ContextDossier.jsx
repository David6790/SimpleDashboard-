import { useState } from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";

// Fonction pour récupérer le libellé de l'énumération
const getProcomStatusLabel = (status) => {
  const statusLabels = {
    1: "En instance",
    2: "Proposition envoyée",
    3: "En discussion",
    4: "Validée",
    5: "Archivée",
  };
  return statusLabels[status] || "Statut inconnu";
};

// Fonction pour formater la date
const formatDate = (dateString) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
};

export default function ContextDossier({ procomData }) {
  // État pour gérer le mode édition
  const [isEditing, setIsEditing] = useState(false);

  // État pour stocker les données modifiables
  const [formData, setFormData] = useState({
    clientName: procomData?.reservation?.clientName || "",
    dossierStatus: getProcomStatusLabel(procomData?.status),
    dueDate: formatDate(procomData?.dateEcheance),
    assignedTo: procomData?.assignedUserName || "",
    notes:
      procomData?.postIts?.map((postIt) => postIt.content).join("\n") ||
      "Ajoutez vos notes ici.",
    participants: procomData?.reservation?.numberOfGuest || 0,
    budget: "Non spécifié",
    collaborators:
      procomData?.collabUserName || "Pas de collaborateur sur ce dossier",
  });

  // Gestion des champs modifiés
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Sauvegarde et bascule en mode vue
  const handleSave = () => {
    setIsEditing(false);
    console.log("Données enregistrées :", formData); // Pour simuler l'enregistrement
  };

  // Annule les modifications
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-6 sm:px-6">
        <h3 className="text-base/7 font-semibold text-gray-900">
          {procomData?.titre || "Détails du dossier PROCOM"}
        </h3>
        <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
          Informations générales et état actuel du dossier.
        </p>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Modifier
          </button>
        )}
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {/* Champs principaux */}
          {[
            {
              label: "Nom du client",
              name: "clientName",
              value: formData.clientName,
            },
            {
              label: "Statut du dossier",
              name: "dossierStatus",
              value: formData.dossierStatus,
            },
            {
              label: "Date d'échéance",
              name: "dueDate",
              value: formData.dueDate,
            },
            {
              label: "Affecté à",
              name: "assignedTo",
              value: formData.assignedTo,
            },
            {
              label: "Notes",
              name: "notes",
              value: formData.notes,
              type: "textarea",
            },
            {
              label: "Nombre de personnes",
              name: "participants",
              value: formData.participants,
              type: "number",
            },
            {
              label: "Budget",
              name: "budget",
              value: formData.budget,
            },
            {
              label: "Collaborateurs",
              name: "collaborators",
              value: formData.collaborators,
              type: "textarea",
            },
          ].map((field) => (
            <div
              key={field.name}
              className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt className="text-sm font-medium text-gray-900">
                {field.label}
              </dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                {isEditing ? (
                  field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={field.value}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={field.value}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  )
                ) : (
                  field.value
                )}
              </dd>
            </div>
          ))}

          {/* Pièces jointes */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">
              Pièces jointes
            </dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-gray-100 rounded-md border border-gray-200"
              >
                {procomData?.files?.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6"
                  >
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        aria-hidden="true"
                        className="size-5 shrink-0 text-gray-400"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          {file.fileName}
                        </span>
                        <span className="shrink-0 text-gray-400">
                          {file.fileSize || "Taille inconnue"}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <a
                        href={file.filePath || "#"}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Télécharger
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>

          {/* Boutons d'édition */}
          {isEditing && (
            <div className="flex justify-end px-4 py-6 sm:px-6">
              <button
                onClick={handleCancel}
                className="mr-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Enregistrer
              </button>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
