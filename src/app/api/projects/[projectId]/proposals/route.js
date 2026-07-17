import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { createProposal,getProjectProposals, } from "@/services/proposal.service";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    if (
      session.user.status !== "ACTIVE" ||
      session.user.role !== "FREELANCER"
    ) {
      return NextResponse.json(
        {
          message: "Only active freelancers can submit proposals.",
        },
        { status: 403 }
      );
    }

    const { projectId } = await params;
    const body = await req.json();

    const result = await createProposal(
      session.user.id,
      projectId,
      body
    );

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }

    return NextResponse.json(
      {
        message: result.message,
        proposal: result.proposal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_PROPOSAL_ROUTE_ERROR", error);

    return NextResponse.json(
      {
        message: "Something went wrong while submitting proposal.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    if (
      session.user.status !== "ACTIVE" ||
      session.user.role !== "CLIENT"
    ) {
      return NextResponse.json(
        {
          message: "Only active clients can view project proposals.",
        },
        { status: 403 }
      );
    }

    const { projectId } = await params;

    const result = await getProjectProposals(
      session.user.id,
      projectId
    );

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }

    return NextResponse.json(
      {
        proposals: result.proposals,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_PROJECT_PROPOSALS_ROUTE_ERROR", error);

    return NextResponse.json(
      {
        message: "Something went wrong while fetching project proposals.",
      },
      { status: 500 }
    );
  }
}