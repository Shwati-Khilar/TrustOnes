import { notificationStats } from "./NotificationData";

export default function NotificationStats() {
  return (
    <div className="grid grid-cols-4 gap-5">

      {notificationStats.map((item) => (

        <div
          key={item.title}
          className="
          bg-white
          border
          border-[#E7DDD2]
          rounded-xl
          p-5
        "
        >

          <div className="flex justify-between">

            <div>

              <h4 className="text-sm text-[#8F6C53]">
                {item.title}
              </h4>

              <h2 className="text-2xl font-bold mt-3">
                {item.value}
              </h2>

              <p className="text-[#B88746] mt-2 text-sm">
                {item.subtitle}
              </p>

            </div>

            <div
              className="
              h-10
              w-10
              rounded-xl
              bg-[#FFF6EE]
              flex
              items-center
              justify-center
            "
            >
              {item.icon}
            </div>

          </div>

        </div>

      ))}

    </div>
  );
}