import welcome_image from '../assets/welcome-image.png';
const Welcome = () => {
  return (
    <main className="welcome">
      <div className="welcome_content">
        <h1>Efficiently manage notes and Delegate responsibilities</h1>
        <p>
          Note Manager is the ultimate solution for businesses and individuals
          looking to streamline note management. With our user-friendly
          platform, you can easily assign notes to team members, track progress,
          and ensure timely completion. Our login feature allows each employee
          to view their assigned notes, ensuring accountability and
          transparency. Say goodbye to disorganized note management and hello to
          productivity with Note Manager.
        </p>
      </div>
      <img src={welcome_image} alt="Welcome" className="welcome_image" />
    </main>
  );
};

export default Welcome;
