export default function EscrowInsights() {
    return (
        <div className="grid grid-cols-[35%_65%] gap-5 mt-6">

            {/* LEFT */}
            <div
                className="
        col-span-1
        bg-white
        border
        border-[#E7DDD2]
        rounded-3xl
        p-6
      "
            >
                <h2 className="text-xl font-bold text-[#3D2414]">
                    Escrow Breakdown
                </h2>

                <p className="text-sm text-[#B88746] mt-1">
                    Across all projects
                </p>

                <div className="flex justify-center mt-5">
                    <div
                        className="
      relative
      h-40
      w-40
      rounded-full
    "
                        style={{
                            background:
                                "conic-gradient(#16a34a 0% 62%, #2563eb 62% 88%, #d97706 88% 89%, #dc2626 89% 100%)",
                        }}
                    >
                        {/* Inner Circle */}
                        <div
                            className="
        absolute
        inset-7
        rounded-full
        bg-white
        flex
        flex-col
        items-center
        justify-center
      "
                        >
                            <span className="text-[#B88746] text-sm font-bold">
                                Total
                            </span>

                            <h3 className="text-2xl font-bold text-[#764628]">
                                $40K
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="mt-5 space-y-4">

                    <div className="flex justify-between">
                        <span className="text-green-600">
                            Released
                        </span>

                        <span className="font-semibold">
                            $24,645
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-blue-600">
                            Locked
                        </span>

                        <span className="font-semibold">
                            $10,180
                        </span>
                    </div>

                    <div className="flex justify-between ">
                        <span className="text-yellow-600 ">
                            Pending
                        </span>

                        <span className="font-semibold">
                            $175
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-red-600">
                            Disputed
                        </span>

                        <span className="font-semibold">
                            $4,500
                        </span>
                    </div>

                </div>
            </div>

            {/* RIGHT */}
            <div
                className="
        col-span-1
        bg-white
        border
        border-[#E7DDD2]
        rounded-3xl
        p-6
      "
            >
                <div className="flex justify-between">

                    <div>
                        <h2 className="text-xl font-bold text-[#3D2414]">
                            Pending Actions
                        </h2>

                        <p className="text-sm text-[#B88746]">
                            Requires your review
                        </p>
                    </div>

                    <span
                        className="
    inline-flex
    items-center
    justify-center
    min-w-[110px]
    h-10
    rounded-full
    bg-[#F8EBC7]
    text-[#C58A1D]
    text-sm
    font-semibold
  "
                    >
                        2 pending
                    </span>
                </div>

                {/* CARD 1 */}

                <div
                    className="
          mt-5
          rounded-2xl
          border
          border-[#F0D978]
          bg-[#FFFDF4]
          p-4
          flex
          justify-between
          items-center
        "
                >
                    <div className="flex gap-4">

                        <div
                            className="
              h-12 w-12
              rounded-xl
              bg-[#8B5A2B]
              text-white
              flex
              items-center
              justify-center
              font-semibold
            "
                        >
                            M
                        </div>

                        <div>
                            <h3 className="font-semibold text-xl">
                                Brand Identity & Logo Design
                            </h3>

                            <p className="text-[#B88746]">
                                Milestone 4 — Final Delivery
                            </p>

                            <p className="font-medium mt-1">
                                $175 pending
                            </p>
                        </div>

                    </div>

                    <div className="flex flex-col gap-2">

                        <button
                            className="
              
              px-4 py-1.5
              rounded-xl
              bg-green-600
              text-white
            "
                        >
                            Release
                        </button>

                        <button
                            className="
              px-4 py-1.5
              rounded-xl
              border
              border-red-300
              text-red-500
            "
                        >
                            Dispute
                        </button>

                    </div>
                </div>

                {/* CARD 2 */}

                <div
                    className="
          mt-4
          rounded-2xl
          border
          border-[#F3C7C7]
          bg-[#FFF7F7]
          p-4
          flex
          justify-between
          items-center
        "
                >
                    <div className="flex gap-4">

                        <div
                            className="
              h-12 w-12
              rounded-xl
              bg-[#8B5A2B]
              text-white
              flex
              items-center
              justify-center
              font-semibold
            "
                        >
                            D
                        </div>

                        <div>
                            <h3 className="font-semibold text-xl">
                                Data Dashboard & Analytics
                            </h3>

                            <p className="text-[#B88746]">
                                Milestone 2 — Data Pipeline
                            </p>

                            <p className="font-medium mt-1">
                                $4,500 pending
                            </p>
                        </div>

                    </div>

                    <button
                        className="
           px-4 py-1.5
            rounded-xl
            bg-red-500
            text-white
          "
                    >
                        View Dispute
                    </button>
                </div>

            </div>

        </div>
    );
}