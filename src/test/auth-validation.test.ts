import { describe, expect, it } from "vitest";
import { credentialsSchema } from "@/lib/auth-validation";
describe("Email and password registration", () => {
  it("accepts email and password without a profile", () => {
    expect(credentialsSchema.parse({ email: "person@example.com", password: "long-password" })).toEqual({ email: "person@example.com", password: "long-password" });
  });
  it("rejects invalid email", () => {
    expect(credentialsSchema.safeParse({ email: "not-an-email", password: "long-password" }).success).toBe(false);
  });
});
