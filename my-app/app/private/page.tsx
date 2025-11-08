import { auth0 } from "@/libauth/auth0";

export default async function PrivatePage() {
  const session = await auth0.getSession();

  return (
    <div>
      <h1>Private Page</h1>
      <p>Welcome {session?.user?.name}</p>
    </div>
  );
}
