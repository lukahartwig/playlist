export default function Loading() {
  return (
    <div>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Artist
            </th>
            <th
              scope="col"
              className="w-60 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Playtime
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {Array.from({ length: 10 }, (_, i) => (
            <tr className="animate-pulse" key={i}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                <div className="h-3.5 w-80 rounded bg-gray-200" />
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div className="h-3.5 w-12 rounded bg-gray-200" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
