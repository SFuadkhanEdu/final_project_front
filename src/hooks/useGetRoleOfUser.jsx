import axios from 'axios';
import { useEffect, useState } from 'react';

function useGetRoleOfUser() {
    const [role, setRole] = useState(null);
    const [loadingRole, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getRole() {
            try {
                const response = await axios.get("http://localhost:5001/api/role", {
                    withCredentials: true  // ✅ Pass withCredentials here
                });
                 setRole(response.data.role)
            } catch (err) {
                console.error("Error fetching role:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        getRole();
    }, []);

    return { role, loadingRole, error,setRole };
}

export default useGetRoleOfUser;
