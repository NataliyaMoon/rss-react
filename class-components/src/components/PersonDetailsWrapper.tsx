import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import PersonDetails from './PersonDetails';

function PersonDetailsWrapper() {
  const { page = '1', detailsId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  if (!detailsId) return null;

  const url = `https://swapi.py4e.com/api/people/${detailsId}/`;

  const handleClose = () => {
    navigate(`/${page}?${searchParams.toString()}`);
  };

  return (
    <div className="detail-sidebar">
      <button className="close-button" onClick={handleClose}>Close</button>
      <PersonDetails url={url} />
    </div>
  );
}

export default PersonDetailsWrapper;
