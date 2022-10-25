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
              Album
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
              <td className="py-4 pl-4 pr-3 sm:pl-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="ml-4 space-y-1">
                    <div className="h-3 w-80 rounded bg-gray-200" />
                    <div className="h-3 w-60 rounded bg-gray-200" />
                  </div>
                </div>
              </td>
              <td className="px-3 py-4">
                <div className="h-3 w-20 rounded bg-gray-200" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
