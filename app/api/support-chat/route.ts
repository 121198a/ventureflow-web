import { NextResponse } from "next/server";
import { initiateSupportChat } from "@/lib/ubverse-api";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, "").trim() : undefined;

    let body: { threadId?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Empty or non-JSON body is allowed
    }

    const result = await initiateSupportChat({
      token,
      threadId: body.threadId,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Support chat session could not be initiated.",
          status: "unconnected",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Support chat server currently unreachable.",
        status: "offline",
      },
      { status: 500 }
    );
  }
}
