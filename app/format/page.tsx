import { redirect } from "next/navigation";
// /format → /library (permanent redirect)
export default function FormatRedirect() {
  redirect("/library");
}
