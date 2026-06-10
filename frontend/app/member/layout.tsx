import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  if (user === null) redirect("/login");

  return (
    <>
      {children}
    </>
  );
}
