import { NextRequest, NextResponse } from 'next/server';
import { listItems } from '@/app/utils/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project');

    if (project) {
      console.log(`Fetching reports for project: ${project}`);
      const reports = await listItems(project);
      
      const filteredReports = reports
        .filter(name => name.startsWith('report-'))
        .map(name => name.replace('report-', ''))
        .filter(Boolean);

      console.log(`Found ${filteredReports.length} reports for project ${project}`);
      return NextResponse.json({
        success: true,
        reports: filteredReports
      });
    }

    console.log('Fetching list of available projects');
    const projects = await listItems();
    const validProjects = projects.filter(Boolean);
    console.log(`Found ${validProjects.length} projects`);

    return NextResponse.json({
      success: true,
      projects: validProjects
    });

  } catch (error) {
    console.error('Failed to fetch reports or projects');
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}