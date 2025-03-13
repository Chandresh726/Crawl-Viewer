import { NextRequest, NextResponse } from 'next/server';
import { listItemsRecursively } from '@/app/utils/storage';
import { ReportStructure } from '@/app/types/report';

function buildStructureFromPaths(paths: string[]): ReportStructure {
  const structure: ReportStructure = {};

  for (const path of paths) {
    let current = structure;
    // Split by either forward slash or backslash
    const parts = path.split(/[\\/]/);

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        // Only add if it's result.json
        if (part === 'result.json') {
          current[part] = null;
        }
      } else {
        // It's a directory
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part] as ReportStructure;
      }
    }
  }

  return structure;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ project: string; reportId: string }> }
) {
  try {
    const { project, reportId } = await context.params;
    const formattedReportId = reportId.startsWith('report-') ? reportId : `report-${reportId}`;
    const path = `${project}/${formattedReportId}`;

    console.log('Getting structure for path:', path);

    // Get all files recursively
    const files = await listItemsRecursively(path);
    console.log('Found files:', files);

    // Build directory structure
    const structure = buildStructureFromPaths(files);
    console.log('Built structure:', JSON.stringify(structure, null, 2));

    if (Object.keys(structure).length === 0) {
      return NextResponse.json(
        { error: 'No files found in report' },
        { status: 404 }
      );
    }

    return NextResponse.json(structure);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}