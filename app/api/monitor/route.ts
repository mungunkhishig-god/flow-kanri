import { NextRequest, NextResponse } from "next/server";

async function logRequest(request: NextRequest) {
  const method = request.method;
  const url = request.url;
  const headers = Object.fromEntries(request.headers.entries());
  const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  
  let body = null;
  try {
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      body = await request.clone().json();
    } else {
      body = await request.clone().text();
    }
  } catch (e) {
    body = "[Body read error or empty]";
  }

  console.log("----- INCOMING REQUEST MONITOR -----");
  console.log(`timestamp: ${new Date().toISOString()}`);
  console.log(`method: ${method}`);
  console.log(`url: ${url}`);
  console.log("searchParams:", searchParams);
  console.log("headers:", headers);
  console.log("body:", body);
  console.log("------------------------------------");

  return NextResponse.json({
    success: true,
    message: "Request logged successfully",
    received: {
      method,
      url,
      body,
      query: searchParams
    }
  });
}

export async function GET(request: NextRequest) {
  return logRequest(request);
}

export async function POST(request: NextRequest) {
  return logRequest(request);
}

export async function PUT(request: NextRequest) {
  return logRequest(request);
}

export async function DELETE(request: NextRequest) {
  return logRequest(request);
}

export async function PATCH(request: NextRequest) {
  return logRequest(request);
}
