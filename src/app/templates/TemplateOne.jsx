export default function TemplateOne({ data }) {
  const { personal, summary } = data;

  return (
    <div id="resume" className="bg-white p-8 shadow-lg min-h-[297mm]">
      <h1 className="text-3xl font-bold">{personal.name || "Your Name"}</h1>
      <p className="text-sm text-gray-600">
        {personal.email} | {personal.phone} | {personal.location}
      </p>

      <hr className="my-4" />

      <h2 className="text-lg font-semibold">Summary</h2>
      <p className="text-sm mt-2">
        {summary || "Your professional summary goes here"}
      </p>
    </div>
  );
}
