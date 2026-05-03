import { NextResponse } from "next/server";
import { mockKnowledge } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockKnowledge);
}
