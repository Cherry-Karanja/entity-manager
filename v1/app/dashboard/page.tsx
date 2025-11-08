import { redirect } from "next/navigation";

export default function HomePage() {
  redirect('/dashboard/examples/UserManagement');
  return null;
}