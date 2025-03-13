export type ReportStructure = {
  [key: string]: ReportStructure | null;
};

export type FileContent = {
  [key: string]: any;
};

export type TreeNode = {
  name: string;
  path: string;
  isFolder: boolean;
  isOpen?: boolean;
  children?: TreeNode[];
}; 