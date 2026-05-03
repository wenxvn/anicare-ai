import { NextResponse } from "next/server";
import { mockEvents } from "@/lib/mock-data";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const event = mockEvents.find((item) => item.id === params.id);
  if (!event) return NextResponse.json({ message: "not found" }, { status: 404 });
  return NextResponse.json(event);
}
