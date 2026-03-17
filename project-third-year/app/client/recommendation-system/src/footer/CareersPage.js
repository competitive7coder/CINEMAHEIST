import React from 'react';

const CareersPage = () => {
  const customStyles = `
    .card-hover:hover {
      transform: translateY(-5px);
      box-shadow: 0 0.5rem 1.5rem rgba(var(--bs-primary-rgb), 0.25) !important;
      border-color: var(--bs-primary) !important;
    }
    .btn-hover-lift:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.25) !important;
    }
    .card {
      transition: all 0.3s ease-in-out;
      background-color: rgba(17, 25, 40, 0.85) !important; /* match FAQ card bg */
    }
    .btn {
      transition: all 0.2s ease-in-out;
    }
  `;

  const IconWrapper = ({ children }) => (
    <div
      className="d-flex justify-content-center align-items-center mb-4 text-info"
      style={{ width: '3rem', height: '3rem', margin: '0 auto 1.5rem' }}
    >
      {React.cloneElement(children, { width: '100%', height: '100%', 'aria-hidden': 'true' })}
    </div>
  );

  return (
    <div className="bg-dark text-light" style={{ backgroundColor: '#05080f' }}>
      <style>{customStyles}</style>

      {/* Header/Hero Section */}
      <header className="bg-gradient text-white py-5" style={{ background: 'linear-gradient(90deg, #0d6efd, #6f42c1)' }}>
        <div className="container-lg text-center">
          <h1 className="display-3 fw-bold lh-tight">Join Our Mission</h1>
          <p className="lead fs-5 text-white-50 mt-4">
            We're building the future of technology, and we're looking for passionate, innovative, and driven individuals to come along for the ride.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Open Positions */}
        <section id="openings" className="py-5">
          <div className="container-lg">
            <h2 className="display-5 fw-bold text-center text-white mb-5">Current Openings</h2>

            <div className="d-flex flex-column gap-4">
              {/* Job Cards */}
              {[
                { title: 'Senior Frontend Engineer', dept: 'Engineering', location: 'Remote (USA)' },
                { title: 'Product Marketing Manager', dept: 'Marketing', location: 'New York, NY' },
                { title: 'Staff Backend Engineer (Go)', dept: 'Engineering', location: 'Remote (Global)' },
              ].map((job, idx) => (
                <div key={idx} className="card text-light shadow-lg rounded-3 border border-dark card-hover">
                  <div className="card-body p-4 p-sm-5 d-sm-flex justify-content-sm-between align-items-sm-center">
                    <div>
                      <h3 className="h4 fw-semibold text-white">{job.title}</h3>
                      <p className="mt-1 fs-6 text-info fw-medium">
                        {job.dept} &middot; {job.location}
                      </p>
                    </div>
                    <div className="mt-4 mt-sm-0 ms-sm-4 flex-shrink-0">
                      <a href="#!" className="btn btn-primary btn-lg fw-bold py-2 px-4 rounded-pill shadow btn-hover-lift">
                        Apply Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Perks */}
        <section id="perks" className="py-5">
          <div className="container-xl">
            <h2 className="display-5 fw-bold text-center text-white mb-5">Why You'll Love Working Here</h2>

            <div className="row g-4">
              {[
                { title: 'Innovative Projects', desc: 'Work on cutting-edge problems with a talented team and make a real impact on the industry.', icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>) },
                { title: 'Flexible Work', desc: 'Enjoy flexible hours and remote-friendly options.', icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>) },
                { title: 'Great Benefits', desc: 'Competitive salary, comprehensive health coverage, and generous paid time off.', icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12 12 0 0012 21.417a12 12 0 008.618-15.447z" /></svg>) },
              ].map((perk, idx) => (
                <div className="col-md-4" key={idx}>
                  <div className="card text-light shadow-lg text-center rounded-3 h-100 p-4 border border-dark card-hover">
                    <IconWrapper>{perk.icon}</IconWrapper>
                    <div className="card-body p-0">
                      <h3 className="h5 fw-semibold text-white mb-2">{perk.title}</h3>
                      <p className="text-white-50">{perk.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="py-5">
          <div className="container-lg text-center">
            <h2 className="display-5 fw-bold text-white">Don't See Your Role?</h2>
            <p className="lead fs-5 text-white-50 mt-4">
              We're always looking for talented people to join our team. Send us your resume, and we'll keep you in mind for future opportunities.
            </p>
            <div className="mt-4">
              <a href="#!" className="btn btn-outline-light btn-lg fw-bold py-2 px-5 rounded-pill shadow btn-hover-lift">
                Get In Touch
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CareersPage;
