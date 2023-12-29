import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { fullText } = body;

    if (!fullText) {
      return new NextResponse("Input text is required", { status: 400 });
    }

    const response = await axios.post(
      // "https://api-inference.huggingface.co/models/Falconsai/text_summarization",
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      JSON.stringify({
        inputs: fullText,
      }),
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_TOKEN}`,
        },
      }
    );

    const result = await response.data;

    const parsed = result[0];

    if (!parsed || !parsed.summary_text) {
      throw new Error("Unable to parse response");
    }

    return NextResponse.json({ summary: parsed.summary_text });
  } catch (error) {
    console.error("POST /api/summary/text", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
