'use client';

import { useParams, useRouter } from 'next/navigation';

export default function AboutUs() {
  const router = useRouter();

  const params = useParams();
  const locale = params?.locale as string;

  const handleBack = () => {
    router.push(`/${locale}`);
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
