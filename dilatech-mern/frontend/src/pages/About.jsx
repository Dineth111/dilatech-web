export default function About() {
  const team = [
    {
      name: 'Dilshan Rathnayaka',
      role: 'Founder / CEO',
      image: 'https://ui-avatars.com/api/?name=Dilshan+Rathnayaka&background=3b82f6&color=fff&size=250&font-size=0.33',
      icon: 'bx-crown'
    },
    {
      name: 'Sachin Weerakoon',
      role: 'CMO / CPO',
      image: 'https://ui-avatars.com/api/?name=Sachin+Weerakoon&background=10b981&color=fff&size=250&font-size=0.33',
      icon: 'bx-trending-up'
    },
    {
      name: 'Dineth Sanjula',
      role: 'CTO / PM',
      image: 'https://ui-avatars.com/api/?name=Dineth+Sanjula&background=f59e0b&color=fff&size=250&font-size=0.33',
      icon: 'bx-code-alt'
    }
  ];

  return (
    <div className="container">
      <div className="page-hero" style={{ textAlign: 'center', margin: '4rem 0 2rem' }}>
        <span className="badge">About Us</span>
        <h1 style={{ marginTop: '1rem' }}>Who We <span className="text-primary-gradient">Are</span></h1>
      </div>

      <div className="prose-stack" style={{ maxWidth: '800px', margin: '0 auto 6rem' }}>
        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <p>
            diLA Tech Solution was founded with a clear vision: to create mobile applications that people genuinely enjoy using. We are passionate about mobile technology and committed to delivering solutions that are both functional and user-centric.
          </p>

          <p>
            As a technology-driven company, we focus on understanding user behavior, identifying real-world problems, and designing mobile applications that offer practical and efficient solutions. Every product we develop is guided by careful planning, attention to detail, and a strong focus on performance and usability.
          </p>

          <p>
            We believe that technology should be accessible and meaningful. That belief shapes how we design interfaces, structure features, and optimize performance across all our applications.
          </p>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Our Approach to Mobile App Development</h2>
          <p>Our development process is centered around quality, simplicity, and reliability. From concept to release, we follow a structured and thoughtful approach to ensure every application meets high standards.</p>
          
          <ol style={{ marginTop: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '1.5rem' }}>
              <strong style={{ color: 'white' }}>Understanding the Problem:</strong>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem' }}>Before development begins, we focus on understanding the problem the application is meant to solve. This includes analyzing user needs, use cases, and expectations. We believe that successful applications start with a clear purpose.</p>
            </li>
            <li style={{ marginBottom: '1.5rem' }}>
              <strong style={{ color: 'white' }}>Clean and Intuitive Design:</strong>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem' }}>User experience (UX) and user interface (UI) design are core priorities. We design interfaces that are easy to navigate, visually clean, and intuitive for users of all backgrounds. Our goal is to minimize complexity and maximize clarity.</p>
            </li>
            <li style={{ marginBottom: '1.5rem' }}>
              <strong style={{ color: 'white' }}>Efficient and Scalable Development:</strong>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem' }}>We use modern development tools, frameworks, and best practices to build applications that are efficient, scalable, and easy to maintain. Performance optimization is a key part of our workflow.</p>
            </li>
            <li style={{ marginBottom: '1.5rem' }}>
              <strong style={{ color: 'white' }}>Testing and Optimization:</strong>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem' }}>Before release, every application is carefully tested to ensure stability, responsiveness, and compatibility across devices. We continuously improve performance and fix issues to provide the best possible user experience.</p>
            </li>
            <li>
              <strong style={{ color: 'white' }}>Continuous Improvement:</strong>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem' }}>Our work does not end after publishing an app. We listen to user feedback, monitor performance, and release updates to improve features, fix bugs, and enhance usability.</p>
            </li>
          </ol>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Our Expertise</h2>
          <p>diLA Tech Solution specializes in mobile application development, with a strong focus on modern cross-platform and native solutions.</p>
          <ul style={{ marginTop: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.8rem' }}>Android application development</li>
            <li style={{ marginBottom: '0.8rem' }}>Cross-platform mobile apps</li>
            <li style={{ marginBottom: '0.8rem' }}>Clean and responsive UI/UX design</li>
            <li style={{ marginBottom: '0.8rem' }}>Performance optimization</li>
            <li style={{ marginBottom: '0.8rem' }}>Local data storage and offline support</li>
            <li style={{ marginBottom: '0.8rem' }}>Secure app architecture</li>
            <li>Feature-rich productivity and utility apps</li>
          </ul>
          <p style={{ marginTop: '1.5rem' }}>
            We aim to build applications that work smoothly even on low-resource devices while still offering a polished and modern experience.
          </p>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Focus on User Experience</h2>
          <p>User experience is at the heart of everything we do. We believe that even the most powerful features are useless if an app is difficult to use.</p>
          <ul style={{ marginTop: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.8rem' }}>Simple navigation</li>
            <li style={{ marginBottom: '0.8rem' }}>Clear layouts</li>
            <li style={{ marginBottom: '0.8rem' }}>Logical feature flow</li>
            <li style={{ marginBottom: '0.8rem' }}>Fast loading times</li>
            <li>Minimal distractions</li>
          </ul>
          <p style={{ marginTop: '1.5rem' }}>
            We carefully design each screen to ensure users can accomplish tasks quickly and effortlessly. Every design decision is made with the user in mind.
          </p>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Our Values</h2>
          <ul style={{ marginTop: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '1rem' }}>
              <strong style={{ color: 'white' }}>Quality:</strong> We never compromise on quality. From code structure to visual design, every detail matters.
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong style={{ color: 'white' }}>Simplicity:</strong> We believe the best solutions are often the simplest. Our apps are designed to be easy to understand and use.
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong style={{ color: 'white' }}>User Satisfaction:</strong> User feedback is incredibly valuable to us. We listen, learn, and improve based on real user experiences.
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong style={{ color: 'white' }}>Transparency:</strong> We aim to be clear and honest in how our applications work and how user data is handled.
            </li>
            <li>
              <strong style={{ color: 'white' }}>Reliability:</strong> We build applications users can depend on in their daily lives.
            </li>
          </ul>
        </div>

        <div className="glass-card prose-card" style={{ padding: '3rem' }}>
          <h2>Final Thoughts</h2>
          <p>
            diLA Tech Solution is more than just a mobile application development company. We are a team driven by passion, curiosity, and a desire to create meaningful digital experiences.
          </p>
          <p>
            Every app we build reflects our dedication to quality, simplicity, and user satisfaction. We are grateful for every user who downloads, uses, and supports our applications.
          </p>
          <p>
            Thank you for trusting diLA Tech Solution.
          </p>
        </div>
        
        {/* Meet the Team Section */}
        <div style={{ padding: '2rem 0 1rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Meet the <span className="text-primary-gradient">Team</span></h2>
          <p style={{ marginBottom: '3rem' }}>The minds behind diLA Tech</p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem'
          }}>
            {team.map((member, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      borderRadius: '50%', 
                      border: '4px solid var(--card-border)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                      objectFit: 'cover'
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '36px',
                    height: '36px',
                    background: 'var(--card-bg)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    fontSize: '1.2rem'
                  }}>
                    <i className={`bx ${member.icon}`}></i>
                  </div>
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>{member.name}</h3>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem', fontWeight: '500' }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="cta-panel glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))', marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Ready to Start a Project?</h2>
          <p style={{ marginBottom: '2rem' }}>We are always looking for exciting new challenges.</p>
          <a href="/contact" className="btn btn-primary">
            Contact Us Today
          </a>
        </div>
      </div>
    </div>
  );
}
