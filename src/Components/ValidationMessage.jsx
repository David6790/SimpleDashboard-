export default function ValidationMessage({ message }) {
  return (
    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
}
