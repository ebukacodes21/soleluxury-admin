"use client";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { productSchema } from "@/schema";
import { Category, Color, Product, Size } from "@/types/types";
import { apiCall } from "@/utils/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import * as z from "zod";

type ProductFormProp = {
  initialData: Product | null;
  categories: Category[] | null;
  colors: Color[] | null;
  sizes: Size[] | null;
};

type productFormValue = z.infer<typeof productSchema>;

const ProductForm: FC<ProductFormProp> = ({ initialData, categories, colors, sizes }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams();

  const title = initialData?.name ? "Edit product" : "Create product";
  const description = initialData?.name
    ? "Edit a product"
    : "Create a new product";
  const message = initialData?.name ? "Product updated" : "Product created";
  const action = initialData?.name ? "Save changes" : "Create";

  const form = useForm<productFormValue>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      images: [],
      price: 0,
      category_id: "",
      color_id: "",
      size_id: "",
      is_archived: false,
      is_featured: false,
    },
  });

  const onSubmit = async (data: productFormValue) => {
    setLoading(true);
    let result;

    if (initialData?.name) {
      result = await apiCall("/api/product/update", "PATCH", {
        product_id: Number(params.productId),
        store_id: Number(params.storeId),
        name: data.name,
        description: data.description,
        price: data.price,
        images: data.images,
        category_id: Number(data.category_id),
        size_id: Number(data.size_id),
        color_id: data.color_id,
        is_featured: data.is_featured,
        is_archived: data.is_archived
      });
    } else {
      result = await apiCall("/api/product/create", "POST", {
        store_id: Number(params.storeId),
        name: data.name,
        description: data.description,
        price: data.price,
        images: data.images,
        category_id: Number(data.category_id),
        size_id: Number(data.size_id),
        color_id: Number(data.color_id),
        is_featured: data.is_featured,
        is_archived: data.is_archived
      });
    }

    if (result.name === "AxiosError") {
      console.log(result)
      setLoading(false);
      return;
    }

    router.refresh();
    router.push(`/${params.storeId}/products`);
    toast.success(message);
    setLoading(false);
  };

  const onConfirm = async () => {
    setLoading(true);
    const result = await apiCall("/api/product/delete", "POST", {
      id: Number(initialData?.id),
    });

    if (result.name === "AxiosError") {
      setLoading(false);
      toast.error(
        "remove all products and categories using this billboard first"
      );
      return;
    }

    toast.success(result.message);
    router.refresh();
    router.push(`/${params.storeId}/products`);
    setLoading(false);
    setOpen(false);
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
        {initialData?.name && (
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Images:</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => {
                      const newValue = [...field.value, { url }];
                      field.onChange((field.value = newValue));
                    }}
                    onRemove={(url) => {
                      const newValue = field.value.filter(
                        (current) => current.url !== url
                      );
                      field.onChange(newValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      placeholder="product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price:</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="9.99"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category:</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      {categories && categories.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                      </SelectContent>

                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size:</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={String(field.value)}
                    defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} placeholder="Select a size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      {sizes && sizes.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                      </SelectContent>

                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color:</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={String(field.value)}
                    defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} placeholder="Select a color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      {colors && colors.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                      </SelectContent>

                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>This product will appear on the homepage</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_archived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>This product will not appear anywhere in the store</FormDescription>
                  </div>
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
    </>
  );
};

export default ProductForm;
