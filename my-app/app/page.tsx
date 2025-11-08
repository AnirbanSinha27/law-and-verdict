
export default function Home() {
  return (
    <div className="flex gap-2">
      <button className="bg-blue-500 text-white p-2 rounded-md">
      <a href="/auth/login">Login</a>
      </button>
      <button className="bg-red-500 text-white p-2 rounded-md">
      <a href="/auth/logout">Logout</a>
      </button>
    </div>
  );
}
