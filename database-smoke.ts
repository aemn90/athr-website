import "dotenv/config";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { db, pool } from "@/db";
import { projectRequests, subscribers } from "@/db/schema";

async function main() {
  const requests = await db.select().from(projectRequests).where(eq(projectRequests.email, "ui-test@athar.example"));
  assert.ok(requests.length > 0, "Submitted project request must persist in PostgreSQL");
  assert.equal(requests[0].service, "web");
  assert.equal(requests[0].status, "new");
  const signups = await db.select().from(subscribers).where(eq(subscribers.email, "ui-newsletter@athar.example"));
  assert.equal(signups.length, 1, "Newsletter subscriber must be stored exactly once");
  await db.delete(projectRequests).where(eq(projectRequests.email, "ui-test@athar.example"));
  await db.delete(subscribers).where(eq(subscribers.email, "ui-newsletter@athar.example"));
  console.log("PASS: request and subscriber persisted in PostgreSQL. Test records removed.");
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => pool.end());
