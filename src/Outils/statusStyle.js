export const getStatusStyles = (status) => {
  switch (status) {
    case "P":
      return "bg-yellow-100 text-yellow-800";
    case "C":
      return "bg-green-100 text-green-800";
    case "A":
    case "R":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
