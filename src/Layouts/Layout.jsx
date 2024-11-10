import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BookOpenIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  CalendarDaysIcon,
  CircleStackIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { useGetNotificationToggleQuery } from "../services/toggleApi"; // Import du hook API toggle

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon, current: false },
  {
    name: "Prendre une réservation",
    href: "/reservation-page",
    icon: BookOpenIcon,
    current: false,
  },
  {
    name: "Gestion Occupation",
    href: "/admin-occstat",
    icon: CalendarDaysIcon,
    current: false,
  },
  {
    name: "Réservations à traiter",
    href: "/admin-stockComplet",
    icon: CircleStackIcon,
    current: false,
  },
  {
    name: "Admin Users",
    href: "/user-admin",
    icon: UsersIcon,
    current: false,
  },
  {
    name: "Power User",
    href: "/power-user",
    icon: BoltIcon,
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Appel de l'API pour récupérer le nombre de notifications
  const { data: notificationStatus } = useGetNotificationToggleQuery();
  const [notificationCount, setNotificationCount] = useState(0);

  console.log("notif >" + notificationCount);

  useEffect(() => {
    if (notificationStatus && notificationStatus.count !== undefined) {
      setNotificationCount(notificationStatus.count);
      // Mettez à jour avec la valeur du nombre de notifications
    } else {
      setNotificationCount(0);
    }
  }, [notificationStatus]);

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog className="relative z-30 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <div className="flex h-16 shrink-0 items-end">
                        <h1 className=" text-3xl font-bold">SIMPLE</h1>
                        <span className=" text-xs ml-2"> Powered by MIO</span>
                      </div>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <NavLink
                                  to={item.href}
                                  className={(nav) =>
                                    classNames(
                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                      nav.isActive
                                        ? "bg-gray-50 text-indigo-600"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                      // Ajout d'une classe pour clignoter si notificationCount > 0
                                      item.name === "Réservations à traiter" &&
                                        notificationCount > 0
                                        ? "animate-pulse bg-yellow-300 text-black"
                                        : ""
                                    )
                                  }
                                >
                                  <item.icon
                                    className={classNames(
                                      item.current
                                        ? "text-indigo-600"
                                        : "text-gray-400 group-hover:text-indigo-600",
                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex h-16 shrink-0 items-end">
              <h1 className=" text-3xl font-bold">SIMPLE</h1>
              <span className=" text-xs ml-2"> Powered by MIO</span>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.href}
                          className={(nav) =>
                            classNames(
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                              nav.isActive
                                ? "bg-gray-50 text-indigo-600"
                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                              // Ajout d'une classe pour clignoter si notificationCount > 0
                              item.name === "Réservations à traiter" &&
                                notificationCount > 0
                                ? "animate-pulse bg-yellow-300 text-black"
                                : ""
                            )
                          }
                        >
                          <item.icon
                            className={
                              "text-gray-400 group-hover:text-indigo-600 h-6 w-6 shrink-0"
                            }
                            aria-hidden="true"
                          />
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          {/* Remove this empty div for desktop */}
          <div
            className={classNames(
              "sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden",
              // Clignotement du background en mode responsive si notificationCount > 0
              notificationCount > 0
                ? "animate-pulse bg-yellow-300 text-black"
                : "bg-white"
            )}
          >
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <main className="py-5 px-5">{children}</main>
        </div>
      </div>
    </>
  );
}
