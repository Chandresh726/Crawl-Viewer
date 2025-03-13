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