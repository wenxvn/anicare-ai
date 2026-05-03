import { NextResponse } from "next/server";
import { mockEvents } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockEvents);
}
