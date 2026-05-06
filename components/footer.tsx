

const Footer = () => {
  return (
    <footer className="py-12 border-t border-outline-variant/10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="size-6 bg-primary/20 rounded flex items-center justify-center text-primary">
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
                fill-rule="evenodd"
              ></path>
            </svg>
          </div>
          <span className="font-bold text-on-surface"> Documate AI</span>
        </div>
        <div className="flex gap-8 text-sm text-outline font-medium">
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
        <p className="text-xs text-outline/60">© 2024 Synapse Technologies Inc.</p>
      </div>
    </footer>
  );
};

export default Footer;
