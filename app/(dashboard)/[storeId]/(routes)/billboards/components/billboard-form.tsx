"use client";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { routes } from "@/constants";
import { useOrigin } from "@/hooks/useOrigin";
import { billboardSchema } from "@/schema";
import { apiCall } from "@/utils/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import * as z from "zod";

type BillboardFormProp = {
  initialData: { imageUrl: string; label: string; id: number; storeId: number } | null;
};

type billboardFormValue = z.infer<typeof billboardSchema>;

const BillboardForm: FC<BillboardFormProp> = ({ initialData }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const origin = useOrigin();
  const params = useParams();

  const title = initialData?.label ? "Edit billboard" : "Create billboard";
  const description = initialData?.label
    ? "Edit a billboard"
    : "Create a new billboard";
  const message = initialData?.label
    ? "Billboard updated"
    : "Billboard created";
  const action = initialData?.label ? "Save changes" : "Create";

  const form = useForm<billboardFormValue>({
    resolver: zodResolver(billboardSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: billboardFormValue) => {
    setLoading(true);
    let result;
    if(initialData?.label){
      result = await apiCall("/api/billboard/update", "PATCH", {
        ...data,
        id: Number(initialData?.id),
      });
    } else {
      result = await apiCall("/api/billboard/create", "POST", { data });
    }

  };

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await apiCall("/api/billboard/delete", "POST", {
        id: Number(initialData?.id),
      });
      toast.success(result.message);
      router.refresh();
      router.push(routes.HOME);
    } catch (error) {
      toast.error("remove all products and categories first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData?.label && (
          <Button
            variant={"destructive"}
            size={"sm"}
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image:</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label:</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {loading ? "please wait..." : action}
            <ClipLoader loading={loading} color="fff" />
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};

export default BillboardForm;