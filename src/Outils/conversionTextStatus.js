export const getStatusText = (status) => {
  switch (status) {
    case "P":
      return "Pending";
    case "C":
      return "Confirmée";
    case "A":
      return "Annulée";
    case "r":
      return "Refusée";
    default:
      return "Unknown";
  }
};
