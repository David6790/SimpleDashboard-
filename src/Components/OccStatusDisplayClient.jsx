import OccStatusMessagesClient from "./OccStatusMessagesClient";

const OccStatusDisplayClient = ({ status }) => {
  const message = OccStatusMessagesClient[status];
  if (!message) return null;

  return (
    <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-md">
      {message}
    </div>
  );
};

export default OccStatusDisplayClient;