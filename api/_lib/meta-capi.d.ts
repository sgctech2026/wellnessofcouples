export declare const DEFAULT_META_PIXEL_ID: string;
export declare function sendPurchaseEvent(args: {
  body: unknown;
  ip?: string;
  userAgent?: string;
  env: Record<string, string | undefined>;
}): Promise<{ status: number; json: Record<string, unknown> }>;
export declare function clientIpFrom(
  headers: Headers | Record<string, string | string[] | undefined>,
): string | undefined;
