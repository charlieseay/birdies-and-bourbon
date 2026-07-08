/**
 * QR Code Sync Utilities
 * Minifies round state for QR code transmission
 * Target: <1KB payload for fast outdoor scanning
 */

import { RoundState, SyncPayload } from '../types/game';

/**
 * Minify round state to compact SyncPayload
 * Strips UUIDs to 8 chars, uses short keys
 */
export function minifyRoundState(roundState: RoundState): SyncPayload {
  const playerIds = Object.keys(roundState.players);
  const playerNames = playerIds.map(id => roundState.players[id].name);

  // Build scores matrix [holeIdx][playerIdx]
  const scoresMatrix: number[][] = roundState.holes.map(hole =>
    playerIds.map(playerId => hole.playerScores[playerId] || hole.par)
  );

  // Calculate current skins pot
  const currentHole = roundState.holes[roundState.currentHoleIndex];
  const skinsInPot = currentHole ? currentHole.pushedSkins || 0 : 0;

  return {
    r: roundState.roundId.substring(0, 8),
    c: roundState.courseId,
    p: playerNames,
    h: roundState.currentHoleIndex,
    s: scoresMatrix,
    k: skinsInPot,
  };
}

/**
 * Expand SyncPayload back to partial round state
 * Used when scanning QR code from another device
 */
export function expandSyncPayload(payload: SyncPayload): Partial<RoundState> {
  // This is read-only view - doesn't restore full round state
  // Just enough to display scorecard
  return {
    roundId: payload.r,
    courseId: payload.c,
    currentHoleIndex: payload.h,
    // Players would need to be reconstructed with temp IDs
    // Scores matrix would be mapped back
    // This is a simplified version - full implementation would restore all data
  };
}

/**
 * Convert payload to compact JSON string
 */
export function payloadToJson(payload: SyncPayload): string {
  return JSON.stringify(payload);
}

/**
 * Parse JSON string back to payload
 */
export function jsonToPayload(json: string): SyncPayload {
  return JSON.parse(json);
}

/**
 * Compress JSON string for QR code
 * Returns base64-encoded compressed data
 *
 * NOTE: React Native doesn't have native zlib/gzip
 * Would need to add a compression library like pako or lz-string
 * For now, just return base64-encoded JSON
 */
export function compressPayload(json: string): string {
  // TODO: Add actual compression (pako or lz-string)
  // For now, just base64 encode
  if (typeof btoa !== 'undefined') {
    return btoa(json);
  }
  // Fallback for environments without btoa
  return Buffer.from(json).toString('base64');
}

/**
 * Decompress base64 data back to JSON string
 */
export function decompressPayload(compressed: string): string {
  // TODO: Add actual decompression
  if (typeof atob !== 'undefined') {
    return atob(compressed);
  }
  return Buffer.from(compressed, 'base64').toString();
}

/**
 * Full pipeline: RoundState → QR-ready string
 */
export function roundStateToQrString(roundState: RoundState): string {
  const minified = minifyRoundState(roundState);
  const json = payloadToJson(minified);
  const compressed = compressPayload(json);
  return compressed;
}

/**
 * Full pipeline: QR string → Partial RoundState
 */
export function qrStringToRoundState(qrString: string): Partial<RoundState> {
  const decompressed = decompressPayload(qrString);
  const payload = jsonToPayload(decompressed);
  return expandSyncPayload(payload);
}
