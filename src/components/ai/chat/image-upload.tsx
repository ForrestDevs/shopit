"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { Input } from "../../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Button } from "../../ui/button";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { useAIState, useActions, useUIState } from "ai/rsc";
import type { AI } from "@/lib/providers/ai-state";
import { useAppState } from "@/lib/providers/app-state";
import { useRouter } from "next/navigation";
import { generateId } from "ai";
import { UserMessage } from "./user-message";

export function ImageUploader() {
  const [input, setInput] = useState("");
  const [showEmptyScreen, setShowEmptyScreen] = useState(false);
  const [, setMessages] = useUIState<typeof AI>();
  const [aiMessage, setAIMessage] = useAIState<typeof AI>();
  const { isGenerating, setIsGenerating } = useAppState();
  const { pipeline } = useActions();
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isFirstRender = useRef(true); // For development environment
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>("");
  const [loading, setLoading] = React.useState(false);

  const formSchema = z.object({
    image: z
      //Rest of validations done via react dropzone
      .instanceof(File)
      .refine((file) => file.size !== 0, "Please upload an image"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      image: new File([""], "filename"),
    },
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPreview(reader.result);
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setPreview(null);
        form.resetField("image");
      };
      if (acceptedFiles.length > 0 && acceptedFiles[0] instanceof File) {
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue("image", acceptedFiles[0]);
        form.clearErrors("image");
      } else {
        setPreview(null);
        form.resetField("image");
      }
    },
    [form.setValue, form.clearErrors, form.resetField]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 10000000,
      accept: {
        "image/png": [],
        "image/jpg": [],
        "image/jpeg": [],
        "image/webp": [],
      },
    });

  async function handleQuerySubmit(query: string, formData?: FormData) {
    setInput(query);
    setIsGenerating(true);

    // Add user message to UI state
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: generateId(),
        component: <UserMessage message={query} />,
      },
    ]);

    // Submit and get response message
    const data = formData || new FormData();
    if (!formData) {
      data.append("input", query);
    }
    const responseMessage = await pipeline(data);
    setMessages((currentMessages) => [...currentMessages, responseMessage]);
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    const reader = new FileReader();
    reader.readAsDataURL(values.image);
    reader.onload = async () => {
      if (reader.result) {
        formData.append("image", reader.result as string);
        await handleQuerySubmit(input, formData);
      }
    };
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="mx-auto md:w-1/2">
              <FormLabel
                htmlFor="dropzone-file"
                className={`${
                  fileRejections.length !== 0 && "text-destructive"
                }`}
              >
                <h2 className="text-xl font-semibold tracking-tight">
                  Upload your image
                  <span
                    className={
                      form.formState.errors.image || fileRejections.length !== 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }
                  ></span>
                </h2>
              </FormLabel>
              <FormControl>
                <div
                  {...getRootProps()}
                  className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border-2 border-dashed border-muted-foreground p-8"
                >
                  {preview && (
                    <img
                      src={preview as string}
                      alt="Uploaded image"
                      className="max-h-[400px] rounded-lg"
                    />
                  )}

                  <ImagePlus
                    className={`size-10 ${preview ? "hidden" : "block"}`}
                  />
                  <Input {...getInputProps()} type="file" />
                  {isDragActive ? (
                    <p className="text-sm text-muted-foreground">
                      Drop the image!
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Select a image or drag here to get started 🚀
                    </p>
                  )}
                </div>
              </FormControl>
              <FormMessage>
                {fileRejections.length !== 0 && (
                  <p>
                    Image must be less than 1MB and of type png, jpg, or jpeg
                  </p>
                )}
              </FormMessage>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mx-auto block h-auto rounded-lg px-8 py-3 text-xl"
        >
          {loading ? "Processing..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
