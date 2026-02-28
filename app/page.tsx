import React from 'react'
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <div>
      <Button
        variant="default"
        className="h-10 w-full uppercase bg-accent text-accent-foreground lg:hidden"
      >
        <Link href={ '/add' }>
          Add Title
        </Link>
      </Button>
    </div>
  )
}
export default Page
