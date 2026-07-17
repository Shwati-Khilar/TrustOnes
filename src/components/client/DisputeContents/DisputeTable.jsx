export default function DisputeTable({ disputes }) {

    return (

        <div
            className="
            bg-white
            rounded-3xl
            border
            border-[#E7DDD2]
            mt-6
            overflow-hidden
        "
        >

            <div className="px-8 py-6 border-b border-[#EFE5DB]">

                <h2 className="text-2xl font-bold text-[#3D2414]">
                    All Disputes
                </h2>

                <p className="text-[#B88746] mt-1 text-sm">
                    {disputes.length} active disputes
                </p>

            </div>

            <table className="w-full">

                <thead className="bg-[#FAF6F1]">

                    <tr className="text-[#C58A1D] uppercase text-sm">

                        <th className="px-8 py-5 text-left">ID</th>

                        <th className="px-4 py-5 text-left">
                            Project
                        </th>

                        <th className="px-4 py-5 text-left">
                            Freelancer
                        </th>

                        <th className="px-4 py-5 text-left">
                            Reason
                        </th>

                        <th className="px-4 py-5 text-left">
                            Evidence
                        </th>

                        <th className="px-4 py-5 text-left">
                            Status
                        </th>

                        <th className="px-4 py-5 text-left">
                            Date
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {disputes.map((item) => (

                        <tr
                            key={item.id}
                            className="border-t border-[#EFE5DB]"
                        >

                            <td className="px-8 py-6 text-[#B88746] font-semibold text-md">
                                {item.id}
                            </td>

                            <td className="px-4 py-6">
                                <h3 className="font-semibold text-md">
                                    {item.project}
                                </h3>

                                <p className="text-[#B88746] text-sm">
                                    {item.milestone}
                                </p>
                            </td>

                            <td className="px-4 py-6 text-md">
                                {item.freelancer}
                            </td>

                            <td className="px-4 py-6 text-md">
                                {item.reason}
                            </td>

                            <td className="px-4 py-6">

                                <button
                                    className="
                                    px-3
                                    py-1
                                    rounded-xl
                                    text-sm
                                    border
                                    border-[#E7DDD2]
                                "
                                >
                                    View
                                </button>

                            </td>

                            <td className="px-4 py-6">

                                <span
                                    className={`
                                    px-4
                                    py-2
                                    rounded-full
                                    border
                                    text-sm

                                    ${
                                        item.status === "Open"
                                            ? "bg-red-50 text-red-500 border-red-200"
                                            : item.status === "Resolved"
                                            ? "bg-green-50 text-green-600 border-green-200"
                                            : item.status === "Under Review"
                                            ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                                            : "bg-gray-50 text-gray-500 border-gray-200"
                                    }
                                `}
                                >
                                    {item.status}
                                </span>

                            </td>

                            <td className="px-4 py-6 text-[#B88746] text-sm">
                                {item.date}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}