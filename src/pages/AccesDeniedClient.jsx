import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

const AccesDeniedClient = () => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(5);

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccesDeniedClient;
