// Check who is currently logged in, and read/update the current user's
// account preferences (UserPreference). The user is always taken from the
// session, never from the request body.
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/permissions";
import {
  getClientPreferences,
  updateClientPreferences,
  InvalidPreferenceError,
} from "@/services/client-settings.service";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      {
        message: "Not logged in.",
        user: null,
        preferences: null,
      },
      {
        status: 401,
      }
    );
  }

  if (!requireRole(session, ["CLIENT"]).allowed) {
    return NextResponse.json({ user: session.user, preferences: null }, { headers: NO_STORE_HEADERS });
  }

  try {
    const preferences = await getClientPreferences(session.user.id);

    return NextResponse.json(
      {
        message: "Current user fetched successfully.",
        user: session.user,
        preferences,
      },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      }
    );
  } catch (error) {
    console.error("USER_ME_GET_API_ERROR", error);

    // The user is still authenticated; preferences are just unavailable.
    return NextResponse.json(
      {
        message: "Current user fetched successfully.",
        user: session.user,
        preferences: null,
      },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    const permission = requireRole(session, ["CLIENT"]);

    if (!permission.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: permission.message,
        },
        {
          status: permission.status,
        }
      );
    }


    const payload = await request.json();

    const result = await updateClientPreferences(session.user.id, payload);

    return NextResponse.json(
      {
        success: true,
        message: "Settings updated successfully.",
        preferences: result.preferences,
        updatedFields: result.updatedFields,
      },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Request body must be valid JSON.",
        },
        {
          status: 400,
        }
      );
    }

    if (error instanceof InvalidPreferenceError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error("USER_ME_PATCH_API_ERROR");

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update settings.",
      },
      {
        status: 500,
      }
    );
  }
}
