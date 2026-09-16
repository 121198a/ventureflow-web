import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export function ComplianceShieldIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 3.25 L19.5 6.25 V11.5 C19.5 16.2 16.3 19.9 12 20.75 C7.7 19.9 4.5 16.2 4.5 11.5 V6.25 Z" />
      <path d="M9 12 L11.2 14.2 L15.2 9.8" />
    </svg>
  );
}

export function FundingTargetIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="8.25" />
      <circle cx="12" cy="12" r="4.75" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <path d="M17.5 6.5 L20.5 3.5 M20.5 3.5 L20.5 6 M20.5 3.5 L18 3.5" strokeWidth="1.5" />
    </svg>
  );
}

export function GrowthChartIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M3.5 20.5 H20.5" />
      <rect x="5.5" y="14" width="3" height="6.5" rx="0.6" />
      <rect x="10.5" y="10.5" width="3" height="10" rx="0.6" />
      <rect x="15.5" y="6.5" width="3" height="14" rx="0.6" />
      <path d="M5.5 8.5 L10.5 5.5 L14 7.5 L19.5 3.5" strokeWidth="1.5" />
      <path d="M16.2 3.5 H19.5 V6.8" strokeWidth="1.5" />
    </svg>
  );
}

export function DocumentFilingIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M6.5 3.5 H14 L18 7.5 V20 C18 20.28 17.78 20.5 17.5 20.5 H6.5 C6.22 20.5 6 20.28 6 20 V4 C6 3.72 6.22 3.5 6.5 3.5 Z" />
      <path d="M14 3.5 V7.5 H18" />
      <path d="M9 12 H15 M9 15 H15 M9 9 H11.5" />
    </svg>
  );
}

export function PartnershipRingsIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="9.5" cy="12" r="5.5" />
      <circle cx="15.5" cy="12" r="5.5" />
    </svg>
  );
}

export function WalletInvestmentIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M4 7.5 C4 6.67 4.67 6 5.5 6 H17 C18.1 6 19 6.9 19 8 V17 C19 18.1 18.1 19 17 19 H5.5 C4.67 19 4 18.33 4 17.5 V7.5 Z" />
      <path d="M4 9 H17 C18.1 9 19 9.9 19 11 V13 H16.25 C15.28 13 14.5 12.22 14.5 11.25 C14.5 10.28 15.28 9.5 16.25 9.5 H19" />
      <circle cx="16" cy="11.25" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FundingRoundCalendarIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 9.5 H20.5" />
      <path d="M7.5 3 V6.5 M16.5 3 V6.5" />
      <rect x="13.5" y="12" width="4" height="4" rx="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CompanyBuildingIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M5 20.5 V6 C5 5.45 5.45 5 6 5 H13 C13.55 5 14 5.45 14 6 V20.5" />
      <path d="M14 11 H18.5 C19.05 11 19.5 11.45 19.5 12 V20.5" />
      <path d="M3.5 20.5 H21" />
      <path d="M7.5 8.5 H9.5 M7.5 12 H9.5 M7.5 15.5 H9.5 M10.5 8.5 H12.5 M10.5 12 H12.5 M10.5 15.5 H12.5" />
      <path d="M16 14 H17.5 M16 17 H17.5" />
    </svg>
  );
}

export function NewsletterSignalIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M3.5 6.5 C3.5 5.95 3.95 5.5 4.5 5.5 H16.5 C17.05 5.5 17.5 5.95 17.5 6.5 V15.5 C17.5 16.05 17.05 16.5 16.5 16.5 H4.5 C3.95 16.5 3.5 16.05 3.5 15.5 Z" />
      <path d="M4 6.2 L10.5 11.2 L17 6.2" />
      <path d="M18.5 4.5 C19.8 5.5 19.8 7.5 18.5 8.5 M20.3 3 C22.5 4.7 22.5 9.3 20.3 11" strokeWidth="1.4" />
    </svg>
  );
}

export function AllocationPieIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 3.5 A8.5 8.5 0 1 1 5.7 17.3" />
      <path d="M12 3.5 V12 L18.3 15.3" />
      <circle cx="12" cy="12" r="8.5" />
    </svg>
  );
}
