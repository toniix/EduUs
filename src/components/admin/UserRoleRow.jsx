const UserRoleRow = ({ user, onRoleChange }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = async (newRole) => {
    if (newRole === user.role) return;

    setIsUpdating(true);
    try {
      await onRoleChange(user.id, newRole);
      setSelectedRole(newRole);
    } catch (error) {
      setSelectedRole(user.role); // Revertir en caso de error
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {user.full_name || "Sin nombre"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{user.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
            user.role
          )}`}
        >
          {formatRoleName(user.role)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={selectedRole}
          onChange={(e) => handleRoleChange(e.target.value)}
          disabled={isUpdating}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
        >
          <option value={ROLES.USER}>{formatRoleName(ROLES.USER)}</option>
          <option value={ROLES.EDITOR}>{formatRoleName(ROLES.EDITOR)}</option>
          <option value={ROLES.ADMIN}>{formatRoleName(ROLES.ADMIN)}</option>
        </select>
        {isUpdating && (
          <div className="text-xs text-blue-500 mt-1">Actualizando...</div>
        )}
      </td>
    </tr>
  );
};
