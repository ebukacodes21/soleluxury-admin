"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { apiCall } from "@/utils/helper";
import toast from "react-hot-toast";
import { routes } from "@/constants";
import { ClipLoader } from "react-spinners";
import { ModeToggle } from "./toggle";

const MainNav = ({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {
  const [loading, setLoading] = useState<boolean>(false)
  const pathName = usePathname();
  const params = useParams();
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    const result = await apiCall("/api/user/logout", "GET");
    if (result.name === "AxiosError") {
      toast.error(`failed to log out`);
      setLoading(false)
      return;
    }
    toast.success(result["message"]);
    router.push(routes.SIGNIN)
  };

  const menu = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathName === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathName === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathName === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathName === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
      active: pathName === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathName === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathName === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathName === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav className={cn("hidden md:flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {menu.map((item) => (
        <Link
          href={item.href}
          key={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            item.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
      <div>
        <ModeToggle />
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <Button onClick={handleLogout}>
        {loading ? "logging out..." : "Logout"}
        <ClipLoader loading={loading} color="fff" />
        </Button>
      </div>
    </nav>
  );
};

export default MainNav;
