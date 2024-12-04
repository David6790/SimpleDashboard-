"use client";

import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import {
  BellIcon,
  CogIcon,
  CreditCardIcon,
  KeyIcon,
  SquaresPlusIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Layout from "../Layouts/Layout";
import ContextDossier from "../Components/ProcomPage/ContextDossier"; // Import du composant ContextDossier

const subNavigation = [
  { name: "Context dossier", key: "context", icon: UserCircleIcon },
  { name: "Propositions", key: "propositions", icon: CogIcon },
  { name: "Fichiers", key: "fichiers", icon: KeyIcon },
  { name: "Echanges clients", key: "echanges", icon: BellIcon },
  { name: "Facturation", key: "facturation", icon: CreditCardIcon },
  { name: "Integrations", key: "integrations", icon: SquaresPlusIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProcomMain() {
  const [activeSection, setActiveSection] = useState("context");

  const renderContent = () => {
    switch (activeSection) {
      case "context":
        return <ContextDossier />;
      // Ajoutez d'autres cas pour les autres sections si nécessaire
      default:
        return <div className="p-6">Hello World</div>;
    }
  };

  return (
    <Layout>
      <div>
        <Disclosure
          as="div"
          className="relative overflow-hidden bg-indigo-600 pb-32"
        >
          <header className="relative py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Proposition commerciale
              </h1>
            </div>
          </header>
        </Disclosure>

        <main className="relative -mt-32">
          <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                {/* Navigation */}
                <aside className="py-6 lg:col-span-3">
                  <nav className="space-y-1">
                    {subNavigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => setActiveSection(item.key)}
                        className={classNames(
                          activeSection === item.key
                            ? "border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-50 hover:text-teal-700"
                            : "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                          "group flex w-full items-center border-l-4 px-3 py-2 text-sm font-medium text-left"
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={classNames(
                            activeSection === item.key
                              ? "text-teal-500 group-hover:text-teal-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "-ml-1 mr-3 h-6 w-6 shrink-0"
                          )}
                        />
                        <span className="truncate">{item.name}</span>
                      </button>
                    ))}
                  </nav>
                </aside>

                {/* Contenu dynamique */}
                <section className="lg:col-span-9">{renderContent()}</section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
