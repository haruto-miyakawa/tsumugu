import { redirect } from "next/navigation";
// /format/[id] → /preview/[id] (permanent redirect)
export default async function FormatIdRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/preview/${id}`);
}
