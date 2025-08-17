
'use client';

type Person = {
  name: string;
  birth_year: string;
  gender: string;
};

type PersonDetailsProps = {
  name: string;
  people: Person[];
};

export default function PersonDetails({ name, people }: PersonDetailsProps) {
  const person = people.find((p) => p.name === name);

  if (!person) return <p>Person not found</p>;

  return (
    <div className="person-details">
      <h2>{person.name}</h2>
      <p>Birth Year: {person.birth_year}</p>
      <p>Gender: {person.gender}</p>
    </div>
  );
}
