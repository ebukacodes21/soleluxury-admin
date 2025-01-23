import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// import Image from "next/image";

type CardProps = {
    title: string;
    description: string;
    children: React.ReactNode
}

export function Cardd({children, title, description}: CardProps) {
  return (
    <Card className="w-[350px]">
      {/* <Image height={80} width={80} src={'/logo2.png'} alt="logo" className="bg-transparent"/> */}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="flex justify-between">
        
      </CardFooter>
    </Card>
  )
}
