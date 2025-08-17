import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const people = await req.json();
  const csv = [
    ['Name', 'Birth Year'],
    ...people.map((p: { name: string; birth_year: string }) => [p.name, p.birth_year])
  ]
    .map((row) => row.join(','))
    .join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="people.csv"'
    }
  });
}
