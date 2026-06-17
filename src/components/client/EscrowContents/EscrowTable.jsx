export default function EscrowTable({
    escrows,
    activeStatus,
    setActiveStatus,
}) {
    return (

        <div
            className="
      bg-white
      rounded-3xl
      border
      border-[#E7DDD2]
      overflow-hidden
      mt-6
    "
        >
            {/* TOP HEADER */}
            <div className="flex items-center justify-between px-8 py-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#3D2414]">
                        All Escrows
                    </h2>

                    <p className="text-[#B88746] mt-1">
                        {escrows.length} escrow accounts
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {[
                        "All",
                        "Locked",
                        "Pending Release",
                        "Released",
                        "Disputed",
                    ].map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveStatus(status)}
                            className={`
          px-4
          py-2
          rounded-xl
          text-sm
          font-medium
          transition-all

          ${activeStatus === status
                                    ? "bg-[#8B5A2B] text-white"
                                    : "text-[#B88746]"
                                }
        `}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>
            <table className="w-full">

                <thead className="bg-[#FAF6F1] text-[#C58A1D] uppercase text-sm">
                    <tr>
                        <th className="px-8 py-5 text-left">ID</th>
                        <th className="px-4 py-5 text-left">Project</th>
                        <th className="px-4 py-5 text-left">Freelancer</th>
                        <th className="px-4 py-5 text-left">Total</th>
                        <th className="px-4 py-5 text-left">Released</th>
                        <th className="px-4 py-5 text-left">Locked</th>
                        <th className="px-4 py-5 text-left">Status</th>
                        <th className="px-4 py-5 text-left">Due</th>
                    </tr>
                </thead>

                <tbody>
                    {escrows.map((item) => (
                        <tr
                            key={item.id}
                            className="border-t border-[#E7DDD2]"
                        >
                            <td className="px-8 py-6 text-[#C58A1D] font-semibold text-sm">
                                {item.id}
                            </td>

                            <td className="px-4 py-6">
                                <h3 className="font-semibold text-md text-[#3D2414]">
                                    {item.project}
                                </h3>

                                <p className="text-[#B88746] mt-1 text-sm">
                                    {item.milestone}
                                </p>
                            </td>

                            <td className="px-4 py-6">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="
        h-10
        w-10
        rounded-full
        bg-[#8B5A2B]
        text-white
        flex
        items-center
        justify-center
      "
                                    >
                                        {item.freelancer[0]}
                                    </div>

                                    <span className="text-md text-[#3D2414]">
                                        {item.freelancer}
                                    </span>
                                </div>
                            </td>

                            <td className="px-4 py-6 font-bold text-xl">
                                ${item.total}
                            </td>

                            <td className="px-4 py-6">
                                <div className="font-bold text-xl text-green-600">
                                    ${item.released}
                                </div>

                                <div className="text-[#B88746] text-sm">
                                    {item.progress}%
                                </div>
                            </td>

                            <td className="px-4 py-6">
                                <div className="font-bold text-xl text-blue-600">
                                    ${item.locked}
                                </div>

                                <div className="w-20 h-1 rounded-full bg-[#EAE1D8] mt-2">
                                    <div
                                        className="h-1.5 rounded-full bg-green-400"
                                        style={{
                                            width: `${item.progress}%`,
                                        }}
                                    />
                                </div>
                            </td>

                            <td className="px-4 py-6">
                                <span
                                    className={`
        px-4
        py-2
        rounded-full
        border
        text-sm
        font-medium

        ${item.status === "Locked"
                                            ? "bg-blue-50 text-blue-600 border-blue-200"
                                            : item.status === "Released"
                                                ? "bg-green-50 text-green-600 border-green-200"
                                                : item.status === "Pending Release"
                                                    ? "bg-yellow-50 text-yellow-600 border-yellow-300"
                                                    : "bg-red-50 text-red-500 border-red-200"
                                        }
      `}
                                >
                                    {item.status}
                                </span>
                            </td>

                            <td className="px-4 py-6 text-[#B88746] text-sm">
                                {item.dueDate}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
}