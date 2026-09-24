import Link from "next/link";

// TODO: swap in the intern application link once it's available.
const internApplicationHref = "#";

export function GetInvolvedSection() {
  return (
    <section className="px-4 pt-10 lg:mx-8 lg:px-0 lg:pt-[72px]">
      <h2 className="text-2xl font-bold lg:hidden">Get Involved</h2>

      <div className="mt-4 border border-white px-3 py-4 text-2xl lg:mt-0 lg:border-2 lg:p-8 lg:leading-[normal]">
        <p className="lg:inline">
          Intern Applications are open until <span className="lg:font-bold">Friday, October 2!</span>
        </p>{" "}
        <Link
          href={internApplicationHref}
          className="mt-2 block text-ksdt-pink underline lg:mt-0 lg:inline"
        >
          Click here to apply
        </Link>
      </div>
    </section>
  );
}
