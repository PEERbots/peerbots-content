import Link from "next/link";
import Image from "next/image";
import peerbotBackpack from "../public/peerbot-backpack.webp";

export default function NotFound() {
  return (
    <div className="bg-white shadow-md my-4 mx-2 p-8 rounded w-full flex">
      <div className="w-72">
        <Image src={peerbotBackpack} />
      </div>
      <div>
        <div>Sorry, I could not find the page you are looking for.</div>
        <div>
          Try going to the{" "}
          <Link href="/" as="/">
            <a className="underline text-dark-primary">home page</a>
          </Link>{" "}
          and starting over?
        </div>
      </div>
    </div>
  );
}
