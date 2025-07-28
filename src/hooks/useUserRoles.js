import { useEffect, useState } from "react";
import { getCurrentUserRoles } from "../services/rolesService";

export const useUserRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const userRoles = await getCurrentUserRoles();
        setRoles(userRoles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { roles, loading, error };
};
