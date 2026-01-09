import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { supabase } from "@/lib/supabase";

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session?.user) {
    const u = session.user as any;
    const payload = {
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || "",
      role: u.user_metadata?.role || "editor",
      is_active: true,
      updated_at: new Date().toISOString(),
    };
    await supabase.from("admin_users").upsert(payload, { onConflict: "id" });
  }
});

createRoot(document.getElementById("root")!).render(<App />);
