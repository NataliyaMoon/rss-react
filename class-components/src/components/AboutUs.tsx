import { useNavigate } from 'react-router-dom';

function AboutUs() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="about-us">
      <h2>About Us</h2>
      <p>Hi, my name is Natalia and this is my app</p>
      <p>
        Visit the{' '}
        <a href="https://rs.school/courses/reactjs" target="_blank" rel="noopener noreferrer">
          React course at RS School
        </a>
        .
      </p>
      <button onClick={handleBack}>Back Home</button>
    </div>
  );
}

export default AboutUs;
