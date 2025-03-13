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

    // Validate path to prevent traversal
    if (path.includes('..') || !path.match(/^[\w-]+\/[\w-]+/)) {
      return NextResponse.json(
        { error: 'Invalid path format' },
        { status: 400 }
      );
    }

    // Transform the path to include 'report-' prefix if needed
    const pathParts = path.split('/');
    if (pathParts.length >= 2) {
      const [project, reportId, ...rest] = pathParts;
      const formattedReportId = reportId.startsWith('report-') ? reportId : `report-${reportId}`;
      // Reconstruct the path with the report directory and any remaining path components
      const transformedPath = [project, formattedReportId, ...rest].join('/');
      console.log('Attempting to read file:', transformedPath);

      // Check if file exists
      if (!await fileExists(transformedPath)) {
        return NextResponse.json(
          { error: `File not found: ${transformedPath}` },
          { status: 404 }
        );
      }

      // Read and parse file content
      try {
        const content = await readFile(transformedPath);
        const jsonContent = JSON.parse(content);
        return NextResponse.json(jsonContent);
      } catch (error) {
        console.error('Error reading/parsing file:', error);
        return NextResponse.json(
          { error: 'Invalid JSON content' },
          { status: 422 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid path format' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}