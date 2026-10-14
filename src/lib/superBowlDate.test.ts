import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { getSportEvent } from "@/data/sports-events";

describe("Super Bowl date single source", () => {
  it("data file has Feb 14 2027", () => {
    expect(getSportEvent("super-bowl")?.date).toBe("2027-02-14");
  });
  it("world countdowns tool reads the data file, not a hard-coded date", () => {
    const src = readFileSync(
      join(process.cwd(), "src/app/world-countdowns/WorldCountdownsTool.tsx"),
      "utf8"
    );
    expect(src).toContain("getSportEvent");
    expect(src).not.toMatch(/new Date\(2027\s*,\s*1\s*,\s*7\)/);
  });
});
