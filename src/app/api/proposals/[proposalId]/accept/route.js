import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { acceptProposal } from "@/services/proposal.service";

export async function PATCH(req, { params }) {
  try {
    // 1. Get logged-in user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    // 2. Only active clients can accept proposals
    if (
      session.user.status !== "ACTIVE" ||
      session.user.role !== "CLIENT"
    ) {
      return NextResponse.json(
        {
          message: "You are not allowed to accept proposals.",
        },
        {
          status: 403,
        }
      );
    }

    // 3. Get proposalId from dynamic route
    const { proposalId } = await params;

    // 4. Call service
    const result = await acceptProposal(
      session.user.id,
      proposalId
    );

    // 5. Handle service error
    if (!result.success) {
      return NextResponse.json(
        {
          message: result.message,
        },
        {
          status: result.status,
        }
      );
    }

    // 6. Success response
    return NextResponse.json(
      {
        message: result.message,
        proposal: result.proposal,
        project: result.project,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("ACCEPT_PROPOSAL_ROUTE_ERROR", error);

    return NextResponse.json(
      {
        message: "Something went wrong while accepting proposal.",
      },
      {
        status: 500,
      }
    );
  }
}