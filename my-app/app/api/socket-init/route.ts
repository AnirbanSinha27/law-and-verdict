import "@/pages/api/socket";

export async function GET() {
  return new Response("socket-init");
}
