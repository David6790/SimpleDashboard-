export const getStatusStyles = (status) => {
  switch (status) {
    case "P":
    case "M":
      return "bg-yellow-100 text-yellow-800";
    case "C":
      return "bg-green-100 text-green-800";
    case "A":
    case "R":
      return "bg-red-100 text-red-800";
    case "D":
      return "bg-blue-100 text-blue-800"; // Style bleu ciel pour "R"
    case "X":
      return "bg-orange-100 text-orange-800"; // Style orange clair
    default:
      return "bg-gray-100 text-gray-800";
  }
};
