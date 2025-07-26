import { useEffect, useState } from 'react';

type Person = {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
  gender: string;
  url: string;
};

type Props = {
  url: string;
};

function PersonDetails({ url }: Props) {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPerson(data);
        setLoading(false);
      });
  }, [url]);

  if (loading) return <p>Loading details...</p>;
  if (!person) return null;

  return (
    <div>
      <h2>{person.name}</h2>
      <p>Gender: {person.gender}</p>
      <p>Birth Year: {person.birth_year}</p>
      <p>Height: {person.height} cm</p>
      <p>Mass: {person.mass} kg</p>
    </div>
  );
}

export default PersonDetails;
