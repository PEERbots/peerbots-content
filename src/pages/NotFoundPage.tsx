import { Link } from "react-router";
import { Button, Heading, Text } from "@peerbots/core";
import peerbotBackpack from "../assets/peerbot-backpack.webp";

export default function NotFoundPage() {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-8 sm:p-12 my-8 max-w-2xl mx-auto shadow-xs text-center flex flex-col items-center">
      <img
        src={peerbotBackpack}
        alt="Page not found"
        className="w-48 h-auto mb-6 drop-shadow-sm"
      />
      <Heading level={2} className="text-gray-900 font-bold mb-2">
        Page Not Found
      </Heading>
      <Text size="md" color="muted" className="mb-6 max-w-md">
        Sorry, we couldn&apos;t find the marketplace page or content you were looking for.
      </Text>
      <Link to="/">
        <Button color="primary" size="md" radius="pill">
          Back to Marketplace Home
        </Button>
      </Link>
    </div>
  );
}
