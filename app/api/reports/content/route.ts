import { NextRequest, NextResponse } from 'next/server';
import { readFile, fileExists } from '@/app/utils/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    if (path.includes('..') || !path.match(/^[\w-]+\/[\w-]+/)) {
      console.log('Invalid path format detected');
      return NextResponse.json(
        { error: 'Invalid path format' },
        { status: 400 }
      );
    }

    const pathParts = path.split('/');
    if (pathParts.length < 2) {
      console.log('Path format missing required components');
      return NextResponse.json(
        { error: 'Invalid path structure' },
        { status: 400 }
      );
    }

    const [project, reportId, ...rest] = pathParts;
    const formattedReportId = reportId.startsWith('report-') ? reportId : `report-${reportId}`;
    const transformedPath = [project, formattedReportId, ...rest].join('/');
    
    console.log(`Processing report request for project: ${project}`);

    if (!await fileExists(transformedPath)) {
      console.log('Requested report file not found');
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    try {
      const content = await readFile(transformedPath);
      const jsonContent = JSON.parse(content);
      console.log('Successfully retrieved report content');
      return NextResponse.json(jsonContent);
    } catch (error: unknown) {
      console.log('Failed to parse report content:', error instanceof Error ? error.message : error);
      return NextResponse.json(
        { error: 'Invalid report format' },
        { status: 422 }
      );
    }
  } catch (error: unknown) {
    console.error('Internal server error while processing report request:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}