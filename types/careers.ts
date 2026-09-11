export type CareerRole = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
};

export type HiringStep = {
  step: string;
  title: string;
  body: string;
};
