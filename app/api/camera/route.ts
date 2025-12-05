export const runtime = "nodejs";

export async function GET() {
  const upstream = "https://sensorudon-backend.onrender.com/camera/live";

  const res = await fetch(upstream, {
    cache: "no-store",
    headers: {
      Accept: "multipart/x-mixed-replace",
    },
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "Upstream error");
    return new Response(text, {
      status: res.status || 502,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(res.body, {
    status: 200,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "multipart/x-mixed-replace",
      "Cache-Control": "no-store",
    },
  });
}
