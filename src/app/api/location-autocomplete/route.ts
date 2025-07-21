import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q || q.length < 2) {
    return new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } });
  }
  const key = process.env.LOCATION_ID_ACCESS_TOKEN;
  if (!key) {
    return new Response(JSON.stringify({ error: "Missing LocationIQ API key" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  const url = `https://us1.locationiq.com/v1/autocomplete?key=${key}&q=${encodeURIComponent(q)}&limit=5&dedupe=1&normalizecity=1&tag=place:city,place:town,place:village`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("LocationIQ error");
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to fetch suggestions" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
} 