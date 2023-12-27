import axios from "axios";
import { readFileSync, writeFile, writeFileSync } from "fs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const files = formData.getAll("files") as File[];

    // my file
    const file = files[0];

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
      buffer,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_TOKEN}`,
        },
      }
    );

    console.log("raw response", response);

    const { text } = await response.data;

    return NextResponse.json({ transcript: text });
  } catch (error) {
    console.error("POST /api/summary/audio", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
