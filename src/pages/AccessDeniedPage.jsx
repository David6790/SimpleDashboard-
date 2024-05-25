import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

const AccessDeniedPage = () => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Attention</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Vous n'avez pas les autorisations pour accéder à cette page.
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Retourner au Dashboard
              </button>
            </div>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Redirection vers dashboard dans {counter}...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
