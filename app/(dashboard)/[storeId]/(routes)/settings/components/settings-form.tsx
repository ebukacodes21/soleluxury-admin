"use client";
import AlertModal from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { routes } from "@/constants";
import { useOrigin } from "@/hooks/useOrigin";
import { settingSchema } from "@/schema";
import { apiCall } from "@/utils/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import * as z from "zod";

type SettingsFormProp = {
  initialData: { name: string; id: number };
};

type settingFormValue = z.infer<typeof settingSchema>;

const SettingsForm: FC<SettingsFormProp> = ({ initialData }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const origin = useOrigin();
  const params = useParams();

  const form = useForm<settingFormValue>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      name: initialData.name,
    },
  });

  const onSubmit = async (data: settingFormValue) => {
    try {
      setLoading(true);
      const result = await apiCall("/api/store/update", "PATCH", {
        ...data,
        id: Number(params.storeId),
      });
      router.refresh();
      toast.success(result.message);
    } catch (error) {
      toast.error("an error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onConfirm = async () => {
    try {
      setLoading(true);
      const result = await apiCall("/api/store/delete", "POST", {
        id: Number(params.storeId),
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
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          variant={"destructive"}
          size={"sm"}
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {loading ? "please wait..." : "Save changes"}
            <ClipLoader loading={loading} color="fff" />
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert title="PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="admin"/>
    </>
  );
};

export default SettingsForm;
