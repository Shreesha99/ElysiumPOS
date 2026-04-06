import { supabase } from "./supabase";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
  restaurantId: string;
}

/* =========================
   INTERNAL PROFILE FETCH
========================= */
const getProfile = async (userId: string): Promise<AppUser> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error("Profile not found");
  }

  if (!data.restaurant_id) {
    throw new Error("Restaurant not assigned");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    id: userId,
    email: user?.email || "",
    name: data.name,
    role: data.role,
    restaurantId: data.restaurant_id,
  };
};

/* =========================
   AUTH SERVICE
========================= */
export const authService = {
  /* LOGIN */
  login: async (email: string, password: string): Promise<AppUser> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return await getProfile(data.user.id);
  },

  /* REGISTER (ADMIN) */
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AppUser> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) throw error;

    const userId = data.user.id;

    // Create restaurant
    const { data: restaurant, error: restErr } = await supabase
      .from("restaurants")
      .insert({
        name: `${name}'s Restaurant`,
        owner_id: userId,
      })
      .select()
      .single();

    if (restErr) throw restErr;

    // Create profile
    const { error: profileErr } = await supabase.from("profiles").insert({
      id: userId,
      name,
      role: "admin",
      restaurant_id: restaurant.id,
    });

    if (profileErr) throw profileErr;

    return {
      id: userId,
      email,
      name,
      role: "admin",
      restaurantId: restaurant.id,
    };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  subscribe: (callback: (user: AppUser | null) => void) => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (!session?.user) {
          callback(null);
          return;
        }

        try {
          const user = await getProfile(session.user.id);
          callback(user);
        } catch (err) {
          console.error("Auth sync error:", err);
          callback(null);
        }
      }
    );

    // ✅ RETURN CLEANUP FUNCTION
    return () => {
      listener.subscription.unsubscribe();
    };
  },
};
