const TestTube = ({ className, ...props }) => (
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
    <path d="M5 3h14l4 9v10H1V12l4-9z" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

export default TestTube;