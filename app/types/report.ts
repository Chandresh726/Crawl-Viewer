export type ReportStructure = {
  [key: string]: ReportStructure | null;
};

export type FileContent = {
  [key: string]: string | number | boolean | object | null;
};

export type TreeNode = {
  name: string;
  path: string;
  isFolder: boolean;
  isOpen?: boolean;
  children?: TreeNode[];
};

export interface Metadata {
  title?: string;
  description?: string;
  keywords?: string;
}

export interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite?: string;
}

export interface FormInput {
  name?: string;
  id?: string;
  type?: string;
  value?: string;
  required?: boolean;
}

export interface Form {
  action?: string;
  method?: string;
  inputs?: FormInput[];
}

export interface ApiCall {
  url: string;
  method: string;
  headers: Record<string, string>;
  response?: {
    status: number;
    headers: Record<string, string>;
    body: unknown;
  };
}

export interface ReportData {
  url: string;
  metadata: Metadata;
  internalLinks: string[];
  externalLinks: string[];
  cookies: Cookie[];
  apiCalls: ApiCall[];
  forms: Form[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
}