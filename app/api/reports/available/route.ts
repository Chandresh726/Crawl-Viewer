import { NextRequest, NextResponse } from 'next/server';
import { listItems } from '@/app/utils/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project');

    console.log('Fetching reports for project:', project);

    if (project) {
      const reports = await listItems(project);
      console.log('Raw reports:', reports);
      
      // Filter and clean up report names
      const filteredReports = reports
        .filter(name => name.startsWith('report-'))
        .map(name => name.replace('report-', ''))
        .filter(name => name !== '');

      console.log('Filtered reports:', filteredReports);
      
      return NextResponse.json({
        success: true,
        reports: filteredReports
      });
    }

    const projects = await listItems();
    console.log('Available projects:', projects);

    return NextResponse.json({
      success: true,
      projects: projects.filter(p => p !== '')
    });

  } catch (error) {
    console.error('Error fetching available reports:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch available reports',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}