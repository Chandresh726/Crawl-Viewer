import { NextRequest, NextResponse } from 'next/server';
import { listItemsRecursively } from '@/app/utils/storage';
import { ReportStructure } from '@/app/types/report';

function buildStructureFromPaths(paths: string[]): ReportStructure {
  const structure: ReportStructure = {};

  for (const path of paths) {
    let current = structure;
    const parts = path.split(/[\\/]/);

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        if (part === 'result.json') {
          current[part] = null;
        }
      } else {
        current[part] = current[part] || {};
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

    console.log(`Building structure for report: ${reportId} in project: ${project}`);

    const files = await listItemsRecursively(path);
    console.log(`Found ${files.length} files in report`);

    const structure = buildStructureFromPaths(files);

    if (Object.keys(structure).length === 0) {
      console.log('No valid files found in report structure');
      return NextResponse.json(
        { error: 'Empty report structure' },
        { status: 404 }
      );
    }

    console.log('Successfully built report structure');
    return NextResponse.json(structure);
  } catch (error: unknown) {
    console.error('Failed to build report structure:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to process report structure' },
      { status: 500 }
    );
  }
}