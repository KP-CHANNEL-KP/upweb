import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface OutlineKeyResponse {
  accessUrl: string;
}

export async function POST(req: Request) {
  try {
    const { plan } = (await req.json()) as { plan: string };

    const db = process.env.DB as any;

    // Create Order
    await db
      .prepare("INSERT INTO orders (plan, status) VALUES (?, ?)")
      .bind(plan, "pending")
      .run();

    const orderRow: any = await db
      .prepare("SELECT last_insert_rowid() as id")
      .first();

    const orderId = orderRow?.id;

    // Create Outline Key
    const VPS_API_URL =
      "https://premium.kpchannel.cc.cd:56847/qHEeZdkH2_qrnRZkdRjwgQ/access-keys";

    const response = await fetch(VPS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create key on VPS");
    }

    const keyData =
      (await response.json()) as OutlineKeyResponse;

    // Update Order
    await db
      .prepare(
        "UPDATE orders SET status = 'completed', access_url = ? WHERE id = ?"
      )
      .bind(keyData.accessUrl, orderId)
      .run();

    return NextResponse.json({
      id: orderId,
      status: "completed",
      access_url: keyData.accessUrl,
    });
  } catch (error) {
    console.error("Buy API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to process key creation",
      },
      {
        status: 500,
      }
    );
  }
}