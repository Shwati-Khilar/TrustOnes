export default function UserAvatar({ user }) {
  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  if (user?.image) {
    return (
      <img
        src={user.image}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className="
        w-10
        h-10
        rounded-full
        bg-[#7A4A28]
        text-white
        flex
        items-center
        justify-center
        font-semibold
      "
    >
      {initials}
    </div>
  );
}