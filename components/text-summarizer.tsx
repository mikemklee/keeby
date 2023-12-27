"use client";

import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const DUMMY_TEXT_TO_SUMMARIZE =
  "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.";

const TextSummarizer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullText, setFullText] = useState(DUMMY_TEXT_TO_SUMMARIZE);
  const [summary, setSummary] = useState("");

  async function query(data: any) {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "https://api-inference.huggingface.co/models/Falconsai/text_summarization",
        JSON.stringify(data),
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_TOKEN}`,
          },
        }
      );

      const result = await response.data;

      const summary = result[0].summary_text;

      return summary;
    } catch (error) {
      if (error instanceof AxiosError) {
        const { response } = error;

        console.error("API error", error);
        setError(`${response?.status} error - please try again later`);
      }
    } finally {
      setLoading(false);
    }
  }

  const onCLickButton = async () => {
    const response = await query({
      inputs: fullText,
    });

    setSummary(response);
  };

  const onCopy = () => {
    if (!summary) return;

    navigator.clipboard.writeText(summary);
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="fullText">Full text</Label>
        <Textarea
          rows={12}
          id="fullText"
          value={fullText}
          onChange={(e) => setFullText(e.target.value)}
        />
      </div>

      <div>
        {fullText.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {fullText.length} characters, including spaces
          </p>
        )}
        {}
      </div>
      <Button onClick={onCLickButton} disabled={!fullText}>
        Summarize this
      </Button>

      {error && (
        <div className="text-red-500 text-sm">
          <p>{error}</p>
        </div>
      )}
      <Separator />

      <div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="summary">Summary</Label>

          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-[270px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[360px]" />
            </div>
          ) : (
            <>
              {summary ? (
                <div className="flex flex-col">
                  <p className="text-sm">{summary}</p>
                  <Button
                    onClick={onCopy}
                    className="opacity-20 hover:opacity-100 transition ml-auto"
                    size="icon"
                    variant="ghost"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  A summary will be shown here.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TextSummarizer;
