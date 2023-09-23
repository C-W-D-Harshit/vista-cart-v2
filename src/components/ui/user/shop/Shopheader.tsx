"use client";

import { Button, Select } from "@radix-ui/themes";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React from "react";
import { useUrl } from "nextjs-current-url";

const Shopheader = ({ query }: { query: string }) => {
  const router = useRouter();
  const handleSort = (value: string) => {
    router.push(`/shop?query=${query ?? ""}&sort=${value}`);
  };
  return (
    <div className="shop_header">
      <Select.Root size={"3"} onValueChange={(value) => handleSort(value)}>
        <Select.Trigger placeholder="Sort By..." />
        <Select.Content
          ref={(ref) => {
            if (!ref) return;
            ref.ontouchstart = (e) => {
              e.preventDefault();
            };
          }}
          position="popper"
        >
          <Select.Group>
            <Select.Label>Price</Select.Label>
            <Select.Item value="+price">Low To High</Select.Item>
            <Select.Item value="-price">High To Low</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Label>Ratings</Select.Label>
            <Select.Item value="+ratings">Low To High</Select.Item>
            <Select.Item value="-ratings">High To Low</Select.Item>
          </Select.Group>
          <Select.Item value="">
            <Button>Reset</Button>
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default Shopheader;
