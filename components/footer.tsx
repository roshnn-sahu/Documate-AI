const Footer = () => {
  return (
    <footer className="border-outline-variant/10 border-t py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 text-primary flex size-6 items-center justify-center rounded">
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <span className="text-on-surface font-bold"> Documate AI</span>
        </div>
        <div className="text-outline flex gap-8 text-sm font-medium">
          <a className="hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Terms of Service
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Status
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Twitter
          </a>
        </div>
        <p className="text-outline/60 text-xs">
          © 2024 Synapse Technologies Inc.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
