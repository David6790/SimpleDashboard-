import { HandThumbUpIcon, ClockIcon } from "@heroicons/react/20/solid";
import { useGetReservationByIdQuery } from "../services/reservations";
import { useParams } from "react-router-dom"; // Importer useNavigate
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
  useAddNoteInterneMutation,
  useCancelNoShowReservationMutation,
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

export default function GirStaff() {
  const { reservationId } = useParams(); // Récupérer l'ID depuis l'URL

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

  const [addNoteInterne] = useAddNoteInterneMutation(); // Hook pour ajouter une note interne
  const { refetch: refetchReservation } =
    useGetReservationByIdQuery(reservationId); // Rafraîchir la réservation

  const handleTransmitInternally = async (comment) => {
    if (!comment.message.trim()) return; // Ne rien faire si le commentaire est vide

    try {
      await addNoteInterne({
        ResaId: reservationId, // ID de la réservation
        Note: `Merci de prendre en compte de cette demande du client :\n\n${comment.message}`, // Message formaté avec Markdown
        CreatedBy: "Admin", // Remplacez par le nom réel de l'utilisateur si nécessaire
      }).unwrap();

      // Rafraîchir la réservation après succès
      await refetchReservation();
    } catch (error) {
      console.error(
        "Erreur lors de la transmission en interne :",
        error.message
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentMessage.trim()) {
      alert("Veuillez entrer un message.");
      return;
    }

    try {
      setIsConfirming(true);
      const newComment = {
        message: commentMessage,
        auteur: "SYSTEM", // Concaténer nom et prénom
        reservationId: reservationId,
      };

      // Appel à l'API pour poster le commentaire
      await addCommentaire({ newCommentaire: newComment, origin: "SYSTEM" });
      setIsConfirming(false);
      // Réinitialiser le champ de commentaire après l'envoi
      setCommentMessage("");
      await refetchToggle();
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire :", error);
      setIsConfirming(false);
    }
  };

  const {
    data: reservationData,
    error: reservationError,
    isLoading: reservationLoading,
  } = useGetReservationByIdQuery(reservationId); // Appel à l'API avec l'ID

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
    // Combine the date and time into a single Date object
    const dateTimeString = `${date}T${time}`;
    const dateTime = new Date(dateTimeString);

    // Format the date to "vendredi 21 décembre 2024"
    const formattedDate = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(dateTime);

    // Format the time to "hh:mm"
    const formattedTime = dateTime.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Return the formatted date and time
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

  const handleRequestDoubleConfirm = async () => {
    try {
      // Préparer le nouveau statut HEC
      const newHECStatut = {
        reservationId: reservationData.id, // Utiliser l'ID de la réservation actuelle
        actions: "DC", // Action pour la double confirmation
        statut: "Demande de double confirmation", // Statut associé
        libelle: "En attente de la double confirmation", // Libellé à afficher
        createdBy: "Client", // Qui a créé la demande, ici le client
      };

      await addHECStatut(newHECStatut);
    } catch (error) {
      console.error("Erreur lors de la demande de double confirmation:", error);
    }
  };

  return (
    <Layout>
      <div className="min-h-full bg-white">
        {/* Header section */}
        <SectionHeading
          title={"Espace de Gestion Intéractive de Réservation"}
        />
        <main className="py-10">
          {/* Page header */}
          <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-5">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {reservationData.client.name +
                    " " +
                    reservationData.client.prenom}
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  Espace de Gestion Intéractive de Réservation
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              {reservationData.status !== "A" &&
              reservationData.status !== "P" &&
              reservationData.status !== "R" &&
              reservationData.status !== "M" ? (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  onClick={handleRequestDoubleConfirm} // Appel de la fonction de redirection
                >
                  Demander une double Confirmation
                </button>
              ) : (
                ""
              )}
              {reservationData.status !== "A" &&
                reservationData.status !== "R" && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-red-700"
                    onClick={() => setIsAnnulerModalOpen(true)}
                  >
                    Annuler la réservation
                  </button>
                )}
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2 lg:col-start-1">
              {/* Reservation Details */}
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="applicant-information-title"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Détails de la réservation
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
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Adresse Email
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {reservationData.client.email}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Nombre de personne
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
                        <dd className="mt-1 text-sm text-gray-900 flex items-center justify-between">
                          {reservationData.comment ? (
                            <>
                              <span className="flex-1">
                                {reservationData.comment}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleTransmitInternally({
                                    message: reservationData.comment,
                                  })
                                }
                                className="font-medium text-blue-500 hover:text-blue-700 ml-4"
                              >
                                Transmettre en Interne
                              </button>
                            </>
                          ) : (
                            "Aucun commentaire"
                          )}
                        </dd>
                      </div>

                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Info complémentaire
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {reservationData.freeTable21 === "O"
                            ? "Il est convenu avec le restaurant que la table doit être libérée pour 21h."
                            : "Aucune information complémentaire."}
                        </dd>
                      </div>
                      {/* Notes internes */}
                      <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-900">
                          Notes internes
                        </h3>
                        {reservationData.notesInternes &&
                        reservationData.notesInternes.length > 0 ? (
                          <ul className="mt-4 space-y-4">
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
                          <p className="text-sm text-gray-500 mt-4">
                            Aucune note interne disponible.
                          </p>
                        )}
                      </div>

                      {reservationData.doubleConfirmation === "O" && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Double Confirmation
                          </dt>
                          <dd className="mt-1 text-sm font-semibold text-black bg-green-200 inline-block px-2 rounded">
                            Confirmé OK
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:rounded-b-lg text-center">
                    <button
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setIsNotesModalOpen(true)} // Ouvrir le modal
                    >
                      Ajouter une note interne
                    </button>
                  </div>
                </div>
              </section>

              {/* Comments */}
              <section aria-labelledby="notes-title">
                <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
                  <div className="divide-y divide-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                      <h2
                        id="notes-title"
                        className="text-lg font-medium text-gray-900"
                      >
                        Echange avec le client
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
                                  <div
                                    href="#"
                                    className="font-medium text-gray-900"
                                  >
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
                                  {comment.auteur !== "SYSTEM" && (
                                    <button
                                      onClick={() =>
                                        handleTransmitInternally(comment)
                                      } // Appeler la fonction
                                      className="font-medium text-blue-500 hover:text-blue-700"
                                    >
                                      Transmettre en Interne
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-6 sm:px-6">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          alt=""
                          src={logoG}
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <form>
                          <div>
                            <label htmlFor="comment" className="sr-only">
                              Commentaire
                            </label>
                            <textarea
                              id="comment"
                              name="comment"
                              rows={3}
                              placeholder="Ajouter un commentaire"
                              value={commentMessage}
                              onChange={(e) =>
                                setCommentMessage(e.target.value)
                              }
                              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            {isConfirming ? (
                              <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                                En cours...
                              </button>
                            ) : (
                              <button
                                type="submit"
                                onClick={handleSubmit}
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                              >
                                Répondre
                              </button>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Timeline */}
            <section
              aria-labelledby="timeline-title"
              className="lg:col-span-1 lg:col-start-3"
            >
              <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                <h2
                  id="timeline-title"
                  className="text-lg font-medium text-gray-900"
                >
                  Timeline
                </h2>

                {/* Activity Feed */}
                <div className="mt-6 flow-root">
                  <ul className="-mb-8">
                    {hecData.map((item, itemIdx) => (
                      <li key={item.id}>
                        <div className="relative pb-8">
                          {itemIdx !== hecData.length - 1 ? (
                            <span
                              aria-hidden="true"
                              className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={classNames(
                                  item.statut === "Réservation Validée: " ||
                                    item.statut === "Modification Validée: " ||
                                    item.statut === "Double confirmation reçue"
                                    ? "bg-green-500"
                                    : "bg-gray-400",
                                  "flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"
                                )}
                              >
                                {item.statut === "Réservation Validée: " ||
                                item.statut === "Modification Validée: " ||
                                item.statut === "Double confirmation reçue" ? (
                                  <HandThumbUpIcon
                                    className="h-5 w-5 text-white"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <ClockIcon
                                    className="h-5 w-5 text-white"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm ">
                                  {item.statut}{" "}
                                  <span
                                    href="#"
                                    className="font-medium text-gray-500"
                                  >
                                    {item.libelle}
                                  </span>
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                <time>
                                  {formatDateToDayMonth(item.createdAt)}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex flex-col justify-stretch">
                  {/* <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Confirmer
                  </button> */}
                </div>
              </div>
            </section>
          </div>
          {/* Afficher le modal d'ajout de notes internes */}
          {isNotesModalOpen && (
            <CreateNoteInterneModal
              reservation={reservationData} // Passer les données de réservation
              onClose={() => setIsNotesModalOpen(false)} // Fermer le modal
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
