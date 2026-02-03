const DashboardHome = () => {
  return (
    <>
      <div className="card highlight">
        <h3>🔥 Today’s Focus</h3>
        <p>Finish 3 tasks to keep your streak alive.</p>
      </div>

      <div className="stats">
        <div className="card">
          <h4>Tasks Completed</h4>
          <p>3 / 10</p>
        </div>

        <div className="card">
          <h4>Current Streak</h4>
          <p>5 Days</p>
        </div>

        <div className="card">
          <h4>Motivation</h4>
          <p>Consistency beats intensity.</p>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;

