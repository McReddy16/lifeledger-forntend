const DashboardHome = () => {
  return (
    <div className="home-wrapper">

      {/* HERO SECTION */}
      <div className="hero-section">
        <h1>Life Ledger</h1>
        <p className="tagline">
          Where Discipline Meets Wealth.
        </p>
        <p className="sub-text">
          Track your habits. Master your money. Design your future.
        </p>
      </div>

      {/* CORE PHILOSOPHY */}
      <div className="philosophy-grid">

        <div className="philosophy-card">
          <h3>💡 Why Life Ledger?</h3>
          <p>
            Success is not built only on income.
            It is built on discipline.
            Habits create momentum.
            Money creates freedom.
            Life Ledger connects both into one system.
          </p>
        </div>

        <div className="philosophy-card">
          <h3>📈 Habits + Finance</h3>
          <p>
            Your daily actions shape your financial future.
            Consistent habits increase productivity.
            Productivity increases income.
            Smart tracking protects that income.
          </p>
        </div>

        <div className="philosophy-card">
          <h3>🚀 Founder’s Note</h3>
          <p>
            I’m <strong>Chinnapa Reddy Muli</strong>.
            Life Ledger began as my personal discipline system.
            When I started tracking habits and money together,
            my clarity improved, my spending reduced,
            and my execution became consistent.
            Now I’m building it to help others build the same clarity.
          </p>
        </div>

      </div>

      {/* IMPACT SECTION */}
      <div className="impact-section">
        <div className="impact-box">
          <h4>🧠 Discipline</h4>
          <p>Small habits compound into powerful results.</p>
        </div>

        <div className="impact-box">
          <h4>💰 Financial Awareness</h4>
          <p>Tracking money gives control. Control creates growth.</p>
        </div>

        <div className="impact-box">
          <h4>🎯 Life System</h4>
          <p>This is not a tracker. It’s your personal operating system.</p>
        </div>
      </div>

      {/* VISION */}
      <div className="vision-section">
        <h2>Our Vision</h2>
        <p>
          To build a powerful personal system where productivity
          and finance work together — not separately.
        </p>
      </div>

      {/* COPYRIGHT FOOTER */}
      <footer className="home-footer">
        © {new Date().getFullYear()} Life Ledger™. Built & Designed by 
        <strong> Chinnapa Reddy Muli</strong>. All Rights Reserved.
      </footer>

    </div>
  );
};

export default DashboardHome;