// Obtener color para badge de rol
export const getRoleColor = (role) => {
  const colors = {
    admin: "bg-red-100 text-red-800 px-2 py-1 rounded-full",
    editor: "bg-blue-100 text-blue-800 px-2 py-1 rounded-full",
    user: "bg-green-100 text-green-800 px-2 py-1 rounded-full",
  };
  return colors[role] || "bg-gray-100 text-gray-800 px-2 py-1 rounded-full";
};
