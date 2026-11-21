// Frontend register form will call this route.
import { NextResponse } from "next/server";
import { registerUser } from "@/services/auth.service";

export async function POST(req) {
  try {
    const body = await req.json();

    const result = await registerUser(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.message,
          errors: result.errors || null,
        },
        {
          status: result.status,
        }
      );
    }

    return NextResponse.json(
      {
        message: result.message,
        user: result.user,
      },
      {
        status: result.status,
      }
    );
  } catch (error) {
    console.error("REGISTER_ROUTE_ERROR", error);

    return NextResponse.json(
      {
        message: "Something went wrong while registering user.",
      },
      {
        status: 500,
      }
    );
  }
}