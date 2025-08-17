import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'people.csv'); 

  const csv = await fs.readFile(filePath, 'utf-8');
  const lines = csv.trim().split('\n').slice(1);

  const people = lines.map((line, index) => {
    const [name, birth_year, gender] = line.split(',');
    return { name, birth_year, gender, url: `person-${index}` };
  });

  return NextResponse.json(people);
}
