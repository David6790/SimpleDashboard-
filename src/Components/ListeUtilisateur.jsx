import { useState } from "react";
import { useGetUsersQuery, useSignupMutation } from "../services/authApi";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";

export default function ListeUtilisateur() {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      await signup({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }).unwrap();
      setErrorMessage(""); // Clear any previous errors
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
    } catch (error) {
      setErrorMessage("Erreur lors de la création de l'utilisateur.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
        {users.map((user) => (
          <li
            key={user.email}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
          >
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    {user.nom} {user.prenom}
                  </h3>
                  <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {user.role}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <button
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                    onClick={() => {
                      /* Logique pour modifier le rôle */
                    }}
                  >
                    <EnvelopeIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-400"
                    />
                    Modifier rôle
                  </button>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <button
                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                    onClick={() => {
                      /* Logique pour supprimer l'utilisateur */
                    }}
                  >
                    <PhoneIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-400"
                    />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Formulaire pour créer un utilisateur */}
      <div className="mt-10">
        <h2 className="text-lg font-medium text-gray-900">
          Créer un nouvel utilisateur
        </h2>
        <form
          onSubmit={handleFormSubmit}
          className="space-y-6 mt-6 bg-white p-6 shadow-md rounded-lg"
        >
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nom"
                className="block text-sm font-medium text-gray-700"
              >
                Nom
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="prenom"
                className="block text-sm font-medium text-gray-700"
              >
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmez le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Rôle
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionnez un rôle</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              {/* Ajoute d'autres rôles si nécessaire */}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSignupLoading}
            >
              {isSignupLoading ? "Création en cours..." : "Créer l'utilisateur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
