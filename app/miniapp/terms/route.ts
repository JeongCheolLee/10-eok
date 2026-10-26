import { legalResponse } from "@/lib/legal/html";

export const dynamic = "force-static";
export function GET() { return legalResponse("terms"); }
