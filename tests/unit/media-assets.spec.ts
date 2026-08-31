import { expect, test } from "@playwright/test";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const assetPath = (path: string) => resolve(process.cwd(), "public", path);

function findBox(buffer: Buffer, type: string): number {
  return buffer.indexOf(Buffer.from(type, "ascii"));
}

function getTrackDimensions(buffer: Buffer) {
  const typeOffset = findBox(buffer, "tkhd");
  const boxSize = buffer.readUInt32BE(typeOffset - 4);
  const boxEnd = typeOffset + boxSize - 4;

  return {
    width: buffer.readUInt32BE(boxEnd - 8) / 65_536,
    height: buffer.readUInt32BE(boxEnd - 4) / 65_536,
  };
}

function getJpegDimensions(buffer: Buffer) {
  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    offset += 2;

    if (marker === 0xd8 || marker === 0xd9) continue;

    const segmentLength = buffer.readUInt16BE(offset);
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      return {
        width: buffer.readUInt16BE(offset + 5),
        height: buffer.readUInt16BE(offset + 3),
      };
    }

    offset += segmentLength;
  }

  throw new Error("JPEG dimensions were not found");
}

test("join video tiers stay within their transfer budgets", () => {
  expect(statSync(assetPath("videos/join-scroll-background-mobile.mp4")).size).toBeLessThanOrEqual(
    2_300_000,
  );
  expect(statSync(assetPath("videos/join-scroll-background.mp4")).size).toBeLessThanOrEqual(
    4_000_000,
  );
  expect(statSync(assetPath("videos/join-scroll-background-large.mp4")).size).toBeLessThanOrEqual(
    6_500_000,
  );
  expect(statSync(assetPath("images/join/join-scroll-poster.jpg")).size).toBeLessThanOrEqual(
    150_000,
  );
});

test("large video is 1280 by 720, fast-start, and seek friendly", () => {
  const video = readFileSync(assetPath("videos/join-scroll-background-large.mp4"));
  const syncSampleOffset = findBox(video, "stss");

  expect(getTrackDimensions(video)).toEqual({ width: 1280, height: 720 });
  expect(video.readUInt32BE(syncSampleOffset + 8)).toBe(67);
  expect(findBox(video, "moov")).toBeLessThan(findBox(video, "mdat"));
});

test("poster and supplied logos retain their intended dimensions", () => {
  const poster = readFileSync(assetPath("images/join/join-scroll-poster.jpg"));
  const navbarLogo = readFileSync(assetPath("images/brand/ieesec-navbar.svg"), "utf8");
  const blackLogo = readFileSync(assetPath("images/brand/ieesec-logo-black.svg"), "utf8");
  const whiteLogo = readFileSync(assetPath("images/brand/ieesec-logo-white.svg"), "utf8");

  expect(getJpegDimensions(poster)).toEqual({ width: 1280, height: 720 });
  expect(navbarLogo).toContain('viewBox="0 0 178 44"');
  expect(blackLogo).toContain('fill="#000000"');
  expect(whiteLogo).toContain('fill="#FFFFFF"');
});
