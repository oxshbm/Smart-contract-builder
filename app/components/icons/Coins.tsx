const Coins = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <path d="M21.7 18.3c-1.1-1.1-1.8-2.5-2-4" />
    <path d="M18.3 21.7c-1.1-1.1-2.5-1.8-4-2" />
    <path d="M5.7 5.7c1.1 1.1 1.8 2.5 2 4" />
    <path d="M5.7 18.3c1.1 1.1 2.5 1.8 4 2" />
    <path d="M18.3 5.7c1.1 1.1 2.5 1.8 4 2" />
    <path d="M2.3 18.3c1.1 1.1 1.8 2.5 2 4" />
  </svg>
);

export default Coins;