import { NextRequest, NextResponse } from "next/server";

/* ────────────────────────────────────────────────────────────
   POST /api/contact
   Receives { name, email, subject, message } and forwards a
   rich Discord embed to the private webhook. The webhook URL
   lives only in .env.local / server environment — never in
   client code and never committed to git.
──────────────────────────────────────────────────────────── */
export async function POST(request: NextRequest) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error("[contact] DISCORD_WEBHOOK_URL env var is not set");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    let body: { name?: string; email?: string; subject?: string; message?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Discord embed — Indigo brand colour (#6366f1 → decimal 6514417)
    const payload = {
        username: "Arka Portfolio",
        avatar_url: "https://arka.is-a.dev/favicon.ico",
        embeds: [
            {
                author: {
                    name: "New contact from arka.is-a.dev",
                    url: "https://arka.is-a.dev",
                },
                title: subject ? `📬 ${subject}` : "📬 New message",
                color: 6514417, // #6366f1 indigo
                fields: [
                    {
                        name: "👤 Name",
                        value: name,
                        inline: true,
                    },
                    {
                        name: "📧 Email",
                        value: email,
                        inline: true,
                    },
                    {
                        name: "💬 Message",
                        value: message.length > 1024 ? message.slice(0, 1021) + "…" : message,
                        inline: false,
                    },
                ],
                footer: {
                    text: "arka.is-a.dev • Contact Form",
                },
                timestamp: new Date().toISOString(),
            },
        ],
    };

    try {
        const res = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("[contact] Discord webhook error:", res.status, text);
            return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
        }

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
        console.error("[contact] Unexpected error:", err);
        return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
    }
}
