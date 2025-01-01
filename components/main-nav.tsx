"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { apiCall } from "@/utils/helper";
import toast from "react-hot-toast";
import { routes } from "@/constants";

const MainNav = ({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {
  const pathName = usePathname();
  const params = useParams();
  const router = useRouter()

  const handleLogout = async () => {
    const result = await apiCall("/api/user/logout", "POST");
    if (result.name === "AxiosError") {
      toast.error(`failed to log out`);
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
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathName === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
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

      <div className="ml-auto flex items-center space-x-4">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
};

export default MainNav;
