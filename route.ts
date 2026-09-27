import { db } from "@/db";
import { projectRequests } from "@/db/schema";
import { isEmail, rateLimited, safeOrigin, text } from "@/lib/api-utils";

export async function POST(request: Request) {
  if (!safeOrigin(request)) return Response.json({ error: "forbidden" }, { status: 403 });
  if (rateLimited(request, "projects")) return Response.json({ error: "rate_limit" }, { status: 429 });
  try {
    const raw = await request.text();
    if (raw.length > 16_000) return Response.json({ error: "invalid" }, { status: 413 });
    let data;
    try { data = JSON.parse(raw); } catch { return Response.json({ error: "invalid" }, { status: 400 }); }
    if (!data || typeof data !== "object" || Array.isArray(data)) return Response.json({ error: "invalid" }, { status: 400 });
    if (text(data.website)) return Response.json({ error: "invalid" }, { status: 400 });
    const name = text(data.name);
    const email = text(data.email).toLowerCase();
    const company = text(data.company);
    const service = text(data.service);
    const budget = text(data.budget);
    const message = text(data.message);
    if (name.length < 2 || name.length > 120 || !isEmail(email) || company.length > 160 || message.length < 10 || message.length > 4000 || data.consent !== true || !["branding", "web", "apps", "strategy", "not-sure"].includes(service) || !["under-10k", "10k-25k", "25k-50k", "50k-plus", "discuss"].includes(budget)) {
      return Response.json({ error: "invalid" }, { status: 400 });
    }
    const [entry] = await db.insert(projectRequests).values({ name, email, company: company || null, service, budget, message }).returning({ id: projectRequests.id });
    return Response.json({ ok: true, reference: `ATH-${String(entry.id).padStart(5, "0")}` }, { status: 201 });
  } catch (error) {
    console.error("Project request failed:", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "server" }, { status: 500 });
  }
}
