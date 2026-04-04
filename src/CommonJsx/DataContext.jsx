import { createContext, useState, useEffect } from "react";
import { supabase } from "./SupabaseClient.js";
export const DataContext = createContext({});

export function DataProvider({ children }) {
  const [whichRole, setWhichRole] = useState(null);
  const [activePage, setActivePage] = useState("main");
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getSession();

      if (data?.session?.user) {
        const userId = data.session.user.id;
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return;
        }
        if (profileData) {
          setUserProfile(profileData);
          setWhichRole(profileData.Role);
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  return (
    <DataContext.Provider
      value={{
        otherUser,
        setOtherUser,
        userProfile,
        setUserProfile,
        whichRole,
        setWhichRole,
        activePage,
        setActivePage,
        loading: isLoading,
        setIsLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
