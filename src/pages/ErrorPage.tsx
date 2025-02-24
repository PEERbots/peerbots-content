import peerbotBackpack from "../assets/peerbot-backpack.webp";

export default function ErrorPage() {
  return (
    // <div className="bg-white shadow-md my-4 mx-2 p-8 rounded w-full flex md:flex-row-reverse">
    <div className="bg-white shadow-md my-4 mx-2 p-8 rounded w-full md:flex-row flex flex-col-reverse">
      <div className="w-72 mt-4">
        <img src={peerbotBackpack} />
      </div>
      <div className="text-xl md:mt-8">
        <div className="mb-2">Sorry, it looks like an error occured.</div>
        <div>
          Try going to the{" "}
          <a href="/" className="underline text-dark-primary">
            home page
          </a>{" "}
          and starting over?
        </div>
      </div>
    </div>
  );
}
