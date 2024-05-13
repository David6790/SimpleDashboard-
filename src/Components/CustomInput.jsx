import React, { forwardRef } from "react";

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button
    className="block w-full rounded-md bg-red-700 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    onClick={onClick}
    ref={ref}
  >
    {value}
  </button>
));

export default CustomInput;
