import { useState } from "react";

export default function Proposition({ procomData }) {
  const [menuItems, setMenuItems] = useState([]);
  const [showMenuEditor, setShowMenuEditor] = useState(
    procomData.propositionMenus.length > 0
  );
  const [course, setCourse] = useState("");
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");

  const handleAddItem = (e) => {
    e.preventDefault();
    if (course && dishName && description) {
      const newItem = {
        course,
        dishName,
        description,
        id: Date.now(),
      };
      setMenuItems([...menuItems, newItem]);
      // Réinitialiser les champs du formulaire
      setCourse("");
      setDishName("");
      setDescription("");
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        {!showMenuEditor ? (
          <div className="flex flex-col items-center">
            <p className="text-lg font-medium text-gray-700">
              Aucune proposition de menu trouvée.
            </p>
            <button
              onClick={() => setShowMenuEditor(true)}
              className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Créer une proposition de menu
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Éditeur de Menu
            </h1>
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
              {/* Formulaire */}
              <section className="lg:col-span-5">
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div>
                    <label
                      htmlFor="course"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Type de plat
                    </label>
                    <select
                      id="course"
                      name="course"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="Apéritif">Apéritif</option>
                      <option value="Entrée">Entrée</option>
                      <option value="Plat">Plat</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Boisson">Boisson</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="dishName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nom du plat
                    </label>
                    <input
                      type="text"
                      id="dishName"
                      name="dishName"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Ajouter
                    </button>
                  </div>
                </form>
              </section>

              {/* Affichage du menu */}
              <section className="mt-8 lg:col-span-7 lg:mt-0">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                {menuItems.length === 0 ? (
                  <p className="mt-4 text-gray-500">
                    Aucun plat ajouté pour le moment.
                  </p>
                ) : (
                  <div className="mt-4">
                    {["Apéritif", "Entrée", "Plat", "Dessert", "Boisson"].map(
                      (courseType, index) => {
                        const items = menuItems.filter(
                          (item) => item.course === courseType
                        );
                        if (items.length === 0) return null;
                        return (
                          <div key={courseType} className="mt-6">
                            {/* Séparateur */}
                            {index !== 0 && (
                              <hr className="my-6 border-gray-200" />
                            )}
                            <h3 className="text-xl font-bold text-gray-800">
                              {courseType}
                            </h3>
                            <ul className="mt-2 space-y-4">
                              {items.map((item) => (
                                <li key={item.id} className="pb-4">
                                  <div className="flex justify-between">
                                    <p className="text-sm font-semibold text-gray-700">
                                      {item.dishName}
                                    </p>
                                    <button
                                      onClick={() =>
                                        setMenuItems(
                                          menuItems.filter(
                                            (i) => i.id !== item.id
                                          )
                                        )
                                      }
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      Supprimer
                                    </button>
                                  </div>
                                  <p className="mt-1 text-xs italic text-gray-600">
                                    {item.description}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
