import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/mongodb';
import { Project } from '@/types/project';

// GET /api/projects - Get all projects
export async function GET() {
  try {
    const { db } = await connectToMongoDB();
    const projects = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    const project = await request.json() as Project;
    
    // Validate required fields
    if (!project.name || !project.language || !project.blocklyXml) {
      return NextResponse.json(
        { error: 'Missing required project fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToMongoDB();
    
    // Add timestamps
    const newProject = {
      ...project,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('projects').insertOne(newProject);
    
    return NextResponse.json(
      { ...newProject, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}