import { HandThumbUpIcon, ClockIcon } from "@heroicons/react/20/solid";
import { useGetReservationSyntheseQuery } from "../services/reservations";
import { useParams, useNavigate } from "react-router-dom"; // Importer useNavigate
import { useEffect, useState } from "react";
import { useGetHECStatutsByReservationIdQuery } from "../services/hecApi";
import { useGetCommentairesByReservationIdQuery } from "../services/commentaireApi";
import logoG from "../images/logoG.png";
import heart from "../images/heart.png";
import { useAddCommentaireMutation } from "../services/commentaireApi";
import Layout from "../Layouts/Layout";
import SectionHeading from "../Components/SectionHeading";
import { useAddHECStatutMutation } from "../services/hecApi";
import { useGetNotificationToggleQuery } from "../services/toggleApi";
import CreateNoteInterneModal from "../Components/CreateNoteInterneModal";
import {
  useCancelNoShowReservationMutation,
  useSetHasArrivedMutation,
} from "../services/reservations";
import ConfirmationAnnulerModal from "../Components/ConfirmationAnnulerModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Fonction pour formater la date sous la forme "20 Sep"
function formatDateToDayMonth(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatTimeAgo(createdAt) {
  const createdDate = new Date(createdAt); // Crée une date à partir du timestamp
  const now = new Date(); // Date actuelle

  // Convertir les deux dates en millisecondes depuis l'epoch UTC
  const diffInMinutes = Math.floor(
    (now.getTime() - createdDate.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 60) {
    // Moins d'une heure
    return `il y a ${diffInMinutes} min`;
  } else if (diffInMinutes < 1440) {
    // Moins d'une journée (60 min * 24 = 1440 min)
    const hours = Math.floor(diffInMinutes / 60);
    return `il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  } else {
    // Plus d'une journée
    const days = Math.floor(diffInMinutes / 1440);
    return `il y a ${days} jour${days > 1 ? "s" : ""}`;
  }
}

export default function SyntheseResa() {
  const { reservationId } = useParams(); // Récupérer l'ID depuis l'URL
  const navigate = useNavigate(); // Utiliser useNavigate pour la redirection

  const [addCommentaire] = useAddCommentaireMutation();
  const [addHECStatut] = useAddHECStatutMutation();

  // État pour stocker le message du commentaire
  const [commentMessage, setCommentMessage] = useState("");
  const { refetch: refetchToggle } = useGetNotificationToggleQuery();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  const [isAnnulerModalOpen, setIsAnnulerModalOpen] = useState(false);
  const [isSubmittingAnnuler, setIsSubmittingAnnuler] = useState(false);

  const [cancelReservation] = useCancelNoShowReservationMutation();

  const handleConfirmAnnulation = async () => {
    try {
      setIsSubmittingAnnuler(true);
      await cancelReservation({ id: reservationId }).unwrap();

      setIsAnnulerModalOpen(false);
      await refetchReservation(); // Rafraîchir les données
    } catch (error) {
      console.error("Erreur lors de l'annulation :", error);
      alert("Une erreur est survenue lors de l'annulation.");
    } finally {
      setIsSubmittingAnnuler(false);
    }
  };
  const [setHasArrived] = useSetHasArrivedMutation();

  const { refetch: refetchReservation } =
    useGetReservationSyntheseQuery(reservationId); // Rafraîchir la réservation

  const {
    data: reservationData,
    error: reservationError,
    isLoading: reservationLoading,
  } = useGetReservationSyntheseQuery(reservationId); // Appel à l'API avec l'ID

  const {
    data: hecData,
    error: hecError,
    isLoading: hecLoading,
    refetch: refetchHEC,
  } = useGetHECStatutsByReservationIdQuery(reservationId);

  const {
    data: commentaireData,
    error: commentaireError,
    isLoading: commentaireIsLoading,
  } = useGetCommentairesByReservationIdQuery(reservationId);

  function formatDateTime(date, time) {
    // Combine la date et l'heure en un seul objet Date
    const dateTimeString = `${date}T${time}`;
    const dateTime = new Date(dateTimeString);

    // Formate la date en "vendredi 21 décembre 2024"
    const formattedDate = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(dateTime);

    // Formate l'heure en "hh:mm"
    const formattedTime = dateTime.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Retourne la date et l'heure formatées
    return `${formattedDate} à ${formattedTime}`;
  }

  useEffect(() => {
    if (reservationData && hecData) {
      refetchHEC();
    }
  }, [reservationData, hecData, refetchHEC]);

  if (reservationLoading || hecLoading) return <p>Loading...</p>;
  if (reservationError) return <p>Error: {reservationError.message}</p>;
  if (hecError) return <p>Error: {hecError.message}</p>;
  if (commentaireIsLoading) return <p>Loading...</p>;
  if (commentaireError) return <p>Error: {commentaireError.message}</p>;

  const formattedDateTime = formatDateTime(
    reservationData.dateResa,
    reservationData.timeResa
  );

  function getGommetteStatus(reservationDate, reservationTime) {
    const now = new Date();
    const reservationDateTime = new Date(
      `${reservationDate}T${reservationTime}`
    );

    const diffInMinutes = (reservationDateTime - now) / (1000 * 60);

    if (now.toDateString() !== reservationDateTime.toDateString()) {
      return { text: "Mauvais jour", color: "bg-red-500 text-white" };
    } else if (diffInMinutes > 5) {
      return { text: "En avance", color: "bg-yellow-500 text-black" };
    } else if (diffInMinutes < -5) {
      return { text: "En retard", color: "bg-orange-500 text-black" };
    } else {
      return { text: "À l'heure", color: "bg-green-500 text-white" };
    }
  }

  return (
    <Layout>
      <div className="min-h-full bg-white">
        {/* Section d'en-tête */}
        <SectionHeading title={"Fast Onboard"} />
        <main className="py-10">
          {/* En-tête de la page */}
          <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-5">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {reservationData.client.name +
                    " " +
                    reservationData.client.prenom}
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  Synthèse de la Réservation
                </p>
              </div>
            </div>
            {/* Boutons */}
            <div className="mt-6 flex flex-col space-y-4 sm:flex-row sm:space-x-3">
              {reservationData.hasArrived === false && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-700"
                  onClick={async () => {
                    try {
                      await setHasArrived({
                        id: reservationId,
                        hasArrived: true,
                      }).unwrap();
                      await refetchReservation(); // Rafraîchir les données
                    } catch (error) {
                      console.error(
                        "Erreur lors de la mise à jour du statut :",
                        error
                      );
                      alert("Une erreur est survenue lors de la mise à jour.");
                    }
                  }}
                >
                  Marquer comme arrivée
                </button>
              )}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-gray-600"
                onClick={() => navigate("/")}
              >
                Retour vers le dashboard
              </button>
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2 lg:col-start-1">
              {/* Détails de la réservation */}
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="applicant-information-title"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Synthèse Technique
                    </h2>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Date et heure de la réservation
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formattedDateTime}
                          {reservationData.status === "R" ||
                          reservationData.status === "A" ? (
                            <div className="inline-block px-2 py-1 ml-2 rounded-full text-xs font-medium bg-red-500 text-white">
                              Réservation annulée
                            </div>
                          ) : (
                            <div
                              className={`inline-block px-2 py-1 ml-2 rounded-full text-xs font-medium ${
                                getGommetteStatus(
                                  reservationData.dateResa,
                                  reservationData.timeResa
                                ).color
                              }`}
                            >
                              {
                                getGommetteStatus(
                                  reservationData.dateResa,
                                  reservationData.timeResa
                                ).text
                              }
                            </div>
                          )}
                        </dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Table(s) attribuée(s)
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 flex flex-wrap items-center gap-2">
                          {reservationData.tables &&
                          reservationData.tables.length > 0 ? (
                            [...reservationData.tables] // Crée une copie du tableau
                              .sort((a, b) => a.name.localeCompare(b.name)) // Tri alphabétique
                              .map((table) => (
                                <span
                                  key={table.id}
                                  className="inline-block px-3 py-2 bg-green-500 text-white text-sm font-semibold rounded shadow"
                                >
                                  {table.name}
                                </span>
                              ))
                          ) : (
                            <span className="text-gray-500 italic">
                              PAS ENCORE PLACÉ
                            </span>
                          )}
                        </dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Nombre de personnes
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {reservationData.numberOfGuest}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Téléphone
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {reservationData.client.telephone}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Commentaire
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {reservationData.comment || "Aucun commentaire"}
                        </dd>
                      </div>

                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Consigne de libération de table
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          {reservationData.freeTable21 === "O" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                              Client a accepté de libérer la table à 21h
                            </span>
                          ) : reservationData.freeTable1330 === "O" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                              Client a accepté de libérer la table à 13h30
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
                              Pas d'instruction de libération de table
                            </span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>

              {/* Notes internes */}
              <section aria-labelledby="notes-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="notes-title"
                      className="text-lg font-medium text-gray-900"
                    >
                      Notes internes
                    </h2>
                  </div>
                  <div className="px-4 py-6 sm:px-6">
                    {reservationData.notesInternes &&
                    reservationData.notesInternes.length > 0 ? (
                      <ul className="space-y-4">
                        {reservationData.notesInternes.map((note) => (
                          <li
                            key={note.id}
                            className="bg-gray-100 px-4 py-3 rounded-lg shadow-sm"
                          >
                            <p className="text-sm text-gray-800 whitespace-pre-line">
                              {note.note}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              <strong>Créé par:</strong>{" "}
                              {note.createdBy || "Inconnu"} -{" "}
                              {new Date(note.createdAt).toLocaleString(
                                "fr-FR",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Aucune note interne disponible.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Commentaires */}
              <section aria-labelledby="comments-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="comments-title"
                      className="text-lg font-medium text-gray-900"
                    >
                      Échange avec le client
                    </h2>
                  </div>
                  <div className="px-4 py-6 sm:px-6">
                    <ul className="space-y-8">
                      {commentaireData.map((comment) => (
                        <li key={comment.id}>
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0">
                              <img
                                alt=""
                                src={
                                  comment.auteur === "SYSTEM" ? logoG : heart
                                }
                                className="h-10 w-10 rounded-full"
                              />
                            </div>
                            <div>
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">
                                  {comment.auteur === "SYSTEM"
                                    ? "Restaurant Il Girasole"
                                    : comment.auteur}
                                </div>
                              </div>
                              <div className="mt-1 text-sm text-gray-700">
                                <p style={{ whiteSpace: "pre-line" }}>
                                  {comment.message}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center space-x-2 text-sm">
                                <span className="font-medium text-gray-500">
                                  {formatTimeAgo(comment.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Modal d'ajout de notes internes */}
          {isNotesModalOpen && (
            <CreateNoteInterneModal
              reservation={reservationData}
              onClose={() => setIsNotesModalOpen(false)}
            />
          )}
          <ConfirmationAnnulerModal
            isOpen={isAnnulerModalOpen}
            onConfirm={handleConfirmAnnulation}
            onClose={() => setIsAnnulerModalOpen(false)}
            message="Êtes-vous sûr de vouloir annuler cette réservation ?"
            isSubmitting={isSubmittingAnnuler}
          />
        </main>
      </div>
    </Layout>
  );
}
