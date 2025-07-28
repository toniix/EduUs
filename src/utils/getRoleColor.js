// Obtener color para badge de rol
export const getRoleColor = (role) => {
  const colors = {
    admin: "bg-red-100 text-red-800",
    editor: "bg-blue-100 text-blue-800",
    user: "bg-green-100 text-green-800",
  };
  return colors[role] || "bg-gray-100 text-gray-800";
};
