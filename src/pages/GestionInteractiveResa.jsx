import { Popover } from "@headlessui/react";
import {
  HandThumbUpIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
import { useGetReservationByIdQuery } from "../services/reservations";
import { useParams, useNavigate } from "react-router-dom"; // Importer useNavigate
import { useEffect } from "react";
import { useGetHECStatutsByReservationIdQuery } from "../services/hecApi";

const user = {
  name: "Whitney Francis",
  email: "whitney@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
};

const comments = [
  {
    id: 1,
    name: "Leslie Alexander",
    date: "4d ago",
    imageId: "1494790108377-be9c29b29330",
    body: "Ducimus quas delectus ad maxime totam doloribus reiciendis ex. Tempore dolorem maiores. Similique voluptatibus tempore non ut.",
  },
  {
    id: 2,
    name: "Michael Foster",
    date: "4d ago",
    imageId: "1519244703995-f4e0f30006d5",
    body: "Et ut autem. Voluptatem eum dolores sint necessitatibus quos. Quis eum qui dolorem accusantium voluptas voluptatem ipsum. Quo facere iusto quia accusamus veniam id explicabo et aut.",
  },
  {
    id: 3,
    name: "Dries Vincent",
    date: "4d ago",
    imageId: "1506794778202-cad84cf45f1d",
    body: "Expedita consequatur sit ea voluptas quo ipsam recusandae. Ab sint et voluptatem repudiandae voluptatem et eveniet. Nihil quas consequatur autem. Perferendis rerum et.",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Fonction pour formater la date sous la forme "20 Sep"
function formatDateToDayMonth(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function GestionInteractiveResa() {
  const { reservationId } = useParams(); // Récupérer l'ID depuis l'URL
  const navigate = useNavigate(); // Utiliser useNavigate pour redirection

  const {
    data: reservationData,
    error: reservationError,
    isLoading: reservationLoading,
  } = useGetReservationByIdQuery(reservationId); // Appel à l'API avec l'ID

  const {
    data: hecData,
    error: hecError,
    isLoading: hecLoading,
  } = useGetHECStatutsByReservationIdQuery(reservationId);

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
      console.log("Réservation récupérée :", reservationData);
      console.log("HEC Statuts récupérés :", hecData);
    }
  }, [reservationData, hecData]);

  if (reservationLoading || hecLoading) return <p>Loading...</p>;
  if (reservationError) return <p>Error: {reservationError.message}</p>;
  if (hecError) return <p>Error: {hecError.message}</p>;

  const formattedDateTime = formatDateTime(
    reservationData.dateResa,
    reservationData.timeResa
  );

  // Fonction pour rediriger vers la page de modification de réservation
  const handleEditReservation = () => {
    navigate("/modif-resa-client", {
      state: { reservation: reservationData },
    });
  };

  return (
    <>
      <div className="min-h-full">
        <div className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <Popover className="flex h-16 justify-between">
              <div className="flex px-2 lg:px-0 mb-4">
                <div className="flex flex-shrink-0 items-center">
                  <div className="flex h-16 shrink-0 items-end">
                    <h1 className=" text-3xl font-bold">Il Girasole</h1>
                    <span className=" text-xs ml-2"> Powered SIMPLE</span>
                  </div>
                </div>
              </div>
            </Popover>
          </div>
        </div>

        <main className="py-10">
          {/* Page header */}
          <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-5">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Bonjour{" "}
                  {reservationData.client.name +
                    " " +
                    reservationData.client.prenom}
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  Bienvenu dans votre espace de gestion de réservation.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              {reservationData.status !== "A" ? (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  onClick={handleEditReservation} // Appel de la fonction de redirection
                >
                  Modifier votre réservation
                </button>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2 lg:col-start-1">
              {/* Description list */}
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="applicant-information-title"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Détails de ta réservation
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
                        <dd className="mt-1 text-sm text-gray-900">
                          {reservationData.comment
                            ? reservationData.comment
                            : "Aucun commentaire"}
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
                    </dl>
                  </div>
                  <div>
                    <button className="block bg-gray-50 px-4 py-4 text-center text-sm font-medium text-gray-500 hover:text-gray-700 sm:rounded-b-lg w-full">
                      Modifier la réservation
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
                        Nos échanges
                      </h2>
                    </div>
                    <div className="px-4 py-6 sm:px-6">
                      <ul role="list" className="space-y-8">
                        {comments.map((comment) => (
                          <li key={comment.id}>
                            <div className="flex space-x-3">
                              <div className="flex-shrink-0">
                                <img
                                  alt=""
                                  src={`https://images.unsplash.com/photo-${comment.imageId}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                                  className="h-10 w-10 rounded-full"
                                />
                              </div>
                              <div>
                                <div className="text-sm">
                                  <a
                                    href="#"
                                    className="font-medium text-gray-900"
                                  >
                                    {comment.name}
                                  </a>
                                </div>
                                <div className="mt-1 text-sm text-gray-700">
                                  <p>{comment.body}</p>
                                </div>
                                <div className="mt-2 space-x-2 text-sm">
                                  <span className="font-medium text-gray-500">
                                    {comment.date}
                                  </span>{" "}
                                  <span className="font-medium text-gray-500">
                                    &middot;
                                  </span>{" "}
                                  <button
                                    type="button"
                                    className="font-medium text-gray-900"
                                  >
                                    Reply
                                  </button>
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
                          src={user.imageUrl}
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <form action="#">
                          <div>
                            <label htmlFor="comment" className="sr-only">
                              About
                            </label>
                            <textarea
                              id="comment"
                              name="comment"
                              rows={3}
                              placeholder="Add a note"
                              className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                              defaultValue={""}
                            />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <a
                              href="#"
                              className="group inline-flex items-start space-x-2 text-sm text-gray-500 hover:text-gray-900"
                            >
                              <QuestionMarkCircleIcon
                                aria-hidden="true"
                                className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                              />
                              <span>Some HTML is okay.</span>
                            </a>
                            <button
                              type="submit"
                              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                              Comment
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

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
                  <ul role="list" className="-mb-8">
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
                                  item.statut === "Réservation Validée: "
                                    ? "bg-green-500"
                                    : "bg-gray-400",
                                  "flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"
                                )}
                              >
                                {item.statut === "Réservation Validée: " ? (
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
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
