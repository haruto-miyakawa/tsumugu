import { redirect } from "next/navigation";
// /style → /settings (permanent redirect)
export default function StyleRedirect() {
  redirect("/settings");
}
