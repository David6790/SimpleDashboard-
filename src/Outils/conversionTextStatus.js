export const getStatusText = (status) => {
  switch (status) {
    case "P":
      return "Pending";
    case "C":
      return "Confirmée";
    case "A":
      return "Annulée";
    case "R":
      return "Refusée";
    case "M":
      return "Modification à valider";
    default:
      return "Unknown";
  }
};
