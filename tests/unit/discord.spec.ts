import { expect, test } from "@playwright/test";
import { parseDiscordIconUrl, parseDiscordMemberCount } from "../../src/lib/discord";

test("accepts a valid Discord approximate member count", () => {
  expect(parseDiscordMemberCount({ approximate_member_count: 128 })).toBe(128);
});

test("rejects missing, fractional and negative Discord counts", () => {
  expect(parseDiscordMemberCount({})).toBeNull();
  expect(parseDiscordMemberCount({ approximate_member_count: 12.5 })).toBeNull();
  expect(parseDiscordMemberCount({ approximate_member_count: -1 })).toBeNull();
});

test("builds a safe Discord CDN icon URL from invite metadata", () => {
  expect(parseDiscordIconUrl({ guild: { id: "123456789", icon: "abc123_hash" } })).toBe(
    "https://cdn.discordapp.com/icons/123456789/abc123_hash.png?size=128",
  );
  expect(parseDiscordIconUrl({ guild: { id: "not-an-id", icon: "abc123" } })).toBeNull();
});
