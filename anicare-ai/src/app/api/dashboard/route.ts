import { NextResponse } from "next/server";
import { mockDashboard } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(mockDashboard);
}
