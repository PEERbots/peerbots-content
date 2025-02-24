import { Link } from "react-router";
import peerbotBackpack from "../assets/peerbot-backpack.webp";

export default function NotFoundPage() {
  return (
    // <div className="bg-white shadow-md my-4 mx-2 p-8 rounded w-full flex md:flex-row-reverse">
    <div className="bg-white shadow-md my-4 mx-2 p-8 rounded w-full md:flex-row flex flex-col-reverse">
      <div className="w-72 mt-4">
        <img src={peerbotBackpack} />
      </div>
      <div className="text-xl md:mt-8">
        <div className="mb-2">
          Sorry, I could not find the page you are looking for.
        </div>
        <div>
          Try going to the{" "}
          <Link to="/" className="underline text-dark-primary">
            home page
          </Link>{" "}
          and starting over?
        </div>
      </div>
    </div>
  );
}
