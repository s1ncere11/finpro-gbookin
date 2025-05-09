export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const token = formData.get("token");
    formData.delete("token");

    const uploadRes = await fetch(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image",
      {
        method: "POST",
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const contentType = uploadRes.headers.get("content-type") || "";

    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      console.error("Upload failed:", text);
      return new Response("Upload failed: " + text, {
        status: uploadRes.status,
      });
    }

    if (contentType.includes("application/json")) {
      const data = await uploadRes.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const text = await uploadRes.text();
      console.error("Unexpected response:", text);
      return new Response("Unexpected response: " + text, { status: 500 });
    }
  } catch (err) {
    console.error("Upload route error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
