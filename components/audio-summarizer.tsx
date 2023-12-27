"use client";

import axios, { AxiosError } from "axios";
import { ChangeEvent, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const AudioSummarizer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [transcript, setTranscript] = useState("");

  const [audioFile, setAudioFile] = useState<File | null>(null);

  const onClickButton = async () => {
    if (!audioFile) return;

    try {
      setLoading(true);
      setError("");

      const body = new FormData();
      body.append("files", audioFile);

      const response = await axios.post("/api/summary/audio", body);

      const { transcript } = response.data;
      setTranscript(transcript);
    } catch (error) {
      if (error instanceof AxiosError) {
        const { response } = error;

        console.error("API error", error);
        setError(`${response?.status} error - please try again later`);
      }
    } finally {
      setLoading(false);
    }
  };

  const onCopy = () => {
    if (!transcript) return;

    navigator.clipboard.writeText(transcript);
    toast.success("Copied to clipboard");
  };

  const onUploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.currentTarget?.files && event?.currentTarget?.files[0]) {
      const file = event.currentTarget.files[0];

      setAudioFile(file);
    }
  };

  return (
    <>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="audioFile">Audio file</Label>
        <input type="file" name="audioFile" onChange={onUploadFile} />
      </div>

      <Button onClick={onClickButton} disabled={!audioFile}>
        Transcribe this
      </Button>

      {error && (
        <div className="text-red-500 text-sm">
          <p>{error}</p>
        </div>
      )}
      <Separator />

      <div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="transcript">Transcript</Label>

          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-[270px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[360px]" />
            </div>
          ) : (
            <>
              {transcript ? (
                <div className="flex flex-col">
                  <p className="text-sm">{transcript}</p>
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
                  A transcript will be shown here.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AudioSummarizer;
