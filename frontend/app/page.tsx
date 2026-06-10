import TestPage from "./member/todo/page";

export default async function Home() {
  const res = await fetch("http://localhost:8000/api/health");
  const data = await res.json();
  console.log("API Data:", data);

  return <TestPage />;
}
