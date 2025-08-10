import { useGetPersonByUrlQuery } from '../services/swapiApi';

type Props = {
  url: string;
};

function PersonDetails({ url }: Props) {
  const { data: person, isLoading, isError, error } = useGetPersonByUrlQuery(url);

  if (isLoading) return <p>Loading details...</p>;
  if (isError) return <p>Error: {error && 'status' in error ? error.status : 'Unknown error'}</p>;
  if (!person) return null;

  return (
    <div>
      <h2>{person.name}</h2>
      <p>Gender: {person.gender}</p>
      <p>Birth Year: {person.birth_year}</p>
      <p>Height: {person.height} cm</p>
      <p>Mass: {person.mass} kg</p>
      <p>Eye color: {person.eye_color}</p>
    </div>
  );
}

export default PersonDetails;
