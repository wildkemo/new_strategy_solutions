"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const getSlug = (title) =>
  title
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

export default function ServicePage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [accentColor, setAccentColor] = useState("#60a5fa");

  useEffect(() => {
    const colors = ["#60a5fa", "#34d399", "#fbbf24", "#ef4444"];
    setAccentColor(colors[Math.floor(Math.random() * colors.length)]);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch("/api/get_services/");
        const services = await res.json();
        let found = services.find((s) => getSlug(s.title) === slug);
        if (found) {
          found.features = JSON.parse(found.features || "[]");
          setService(found);
        } else {
          setService(null);
        }
      } catch (err) {
        console.error("Error:", err);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="sd-wrapper">
        <style jsx>{`
          .sd-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #e2e8f0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            position: relative;
            overflow: hidden;
          }
          
          .sd-loader {
            text-align: center;
            padding: 2rem;
            z-index: 10;
          }
          
          .sd-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top: 3px solid #60a5fa;
            border-radius: 50%;
            margin: 0 auto 1rem;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .sd-loader p {
            font-size: 1rem;
            color: rgba(226, 232, 240, 0.85);
          }
          
          .sd-gradient-bg {
            position: absolute;
            top: -200px;
            right: -200px;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%);
            z-index: 1;
            filter: blur(30px);
            animation: float 15s infinite ease-in-out;
          }
          
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-20px, -20px); }
          }
        `}</style>
        
        <div className="sd-loader">
          <div className="sd-spinner"></div>
          <p>Loading service details...</p>
        </div>
        <div className="sd-gradient-bg"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="sd-wrapper">
        <style jsx>{`
          .sd-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #e2e8f0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            position: relative;
            overflow: hidden;
          }
          
          .sd-box {
            background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 
              0 8px 20px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
            width: 90%;
            max-width: 700px;
            position: relative;
            z-index: 10;
            border: 1px solid rgba(255, 255, 255, 0.05);
            text-align: center;
            margin-top: 4rem;
          }
          
          .sd-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, #60a5fa, #8b5cf6);
            z-index: 2;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
          }
          
          .sd-not-found-title {
            font-size: 1.8rem;
            color: #f8fafc;
            margin-bottom: 0.8rem;
          }
          
          .sd-not-found-text {
            font-size: 1rem;
            color: rgba(226, 232, 240, 0.85);
            margin-bottom: 1.5rem;
            line-height: 1.6;
          }
          
          .sd-back-link {
            color: #60a5fa;
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.95rem;
            transition: all 0.2s ease;
          }
          
          .sd-back-link:hover {
            color: #3b82f6;
            gap: 0.6rem;
          }
          
          .sd-gradient-bg {
            position: absolute;
            top: -150px;
            right: -150px;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%);
            z-index: 1;
            filter: blur(25px);
          }
        `}</style>
        
        <div className="sd-box">
          <h1 className="sd-not-found-title">Service Not Found</h1>
          <p className="sd-not-found-text">
            The service you're looking for doesn't exist or may have been removed
          </p>
          <a href="/services" className="sd-back-link">
            ← Back to Services
          </a>
        </div>
        <div className="sd-gradient-bg"></div>
      </div>
    );
  }

  return (
    <div className="sd-wrapper">
      <style jsx>{`
        .sd-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
          overflow: hidden;
        }
        
        .sd-box {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 
            0 8px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          width: 90%;
          max-width: 900px;
          position: relative;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          margin-top: 4rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .sd-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, ${accentColor}, #8b5cf6);
          z-index: 2;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }
        
        .sd-box::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, 
                      rgba(255, 255, 255, 0.08) 0%, 
                      transparent 80%);
          z-index: -1;
          border-radius: 16px;
          opacity: 0.8;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        
        .sd-header {
          grid-column: 1;
          margin-bottom: 0;
        }
        
        .sd-service-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 1rem;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          position: relative;
          display: inline-block;
        }
        
        .sd-service-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 50px;
          height: 3px;
          background: ${accentColor};
          border-radius: 2px;
        }
        
        .sd-service-description {
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(226, 232, 240, 0.85);
          margin-top: 1.2rem;
        }
        
        .sd-image-container {
          grid-column: 2;
          grid-row: 1 / span 2;
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          align-self: center;
          height: 100%;
        }
        
        .sd-service-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        
        .sd-image-container:hover .sd-service-image {
          transform: scale(1.03);
        }
        
        .sd-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.7) 0%, transparent 60%);
          pointer-events: none;
        }
        
        .sd-content-section {
          grid-column: 1;
          margin: 1.5rem 0 0 0;
        }
        
        .sd-features-title {
          font-size: 1.6rem;
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.4rem;
        }
        
        .sd-features-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 35px;
          height: 2px;
          background: ${accentColor};
          border-radius: 2px;
        }
        
        .sd-features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .sd-feature-item {
          background: rgba(15, 23, 42, 0.6);
          border-left: 2px solid ${accentColor};
          border-radius: 0 6px 6px 0;
          padding: 1.2rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .sd-feature-item:hover {
          transform: translateX(5px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .sd-feature-icon {
          flex-shrink: 0;
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${accentColor};
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .sd-feature-icon svg {
          width: 16px;
          height: 16px;
        }
        
        .sd-feature-content {
          flex: 1;
        }
        
        .sd-feature-name {
          font-size: 1.1rem;
          color: #f8fafc;
          display: block;
          margin-bottom: 0.3rem;
        }
        
        .sd-feature-desc {
          font-size: 0.95rem;
          line-height: 1.5;
          color: rgba(226, 232, 240, 0.85);
          margin: 0;
        }
        
        .sd-back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.8rem 1.5rem;
          background: rgba(255, 255, 255, 0.08);
          color: #e2e8f0;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 1.5rem;
          grid-column: 1;
        }
        
        .sd-back-button:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
        }
        
        .sd-gradient-bg {
          position: absolute;
          top: -150px;
          right: -150px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%);
          z-index: 1;
          filter: blur(25px);
          animation: float 12s infinite ease-in-out;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-15px, -15px); }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .sd-box {
            grid-template-columns: 1fr;
            max-width: 600px;
            margin-top: 3rem;
            padding: 2rem;
          }
          
          .sd-image-container {
            grid-column: 1;
            grid-row: auto;
            height: 250px;
            margin-bottom: 1.5rem;
          }
          
          .sd-service-title {
            font-size: 2rem;
          }
          
          .sd-service-description {
            font-size: 1rem;
          }
          
          .sd-features-title {
            font-size: 1.4rem;
          }
          
          .sd-feature-item {
            padding: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .sd-wrapper {
            padding: 0.8rem;
          }
          
          .sd-box {
            padding: 1.5rem;
            width: 95%;
            margin-top: 2rem;
          }
          
          .sd-service-title {
            font-size: 1.7rem;
          }
          
          .sd-feature-icon {
            width: 26px;
            height: 26px;
          }
          
          .sd-feature-icon svg {
            width: 14px;
            height: 14px;
          }
          
          .sd-feature-name {
            font-size: 1rem;
          }
          
          .sd-feature-desc {
            font-size: 0.9rem;
          }
        }
      `}</style>
      
      <div 
        className="sd-box"
        style={{
          '--mouse-x': mousePosition.x + 'px',
          '--mouse-y': mousePosition.y + 'px',
        }}
      >
        <div className="sd-header">
          <h1 className="sd-service-title">{service.title}</h1>
          <p className="sd-service-description">{service.description}</p>
        </div>
        
        {service.image && (
          <div className="sd-image-container">
            <img 
              src={service.image} 
              alt={service.title} 
              className="sd-service-image"
            />
            <div className="sd-image-overlay"></div>
          </div>
        )}
        
        <div className="sd-content-section">
          <h2 className="sd-features-title">Key Features</h2>
          <ul className="sd-features-list">
            {service.features?.map((f, i) => (
              <li
                key={i}
                className="sd-feature-item"
                style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
              >
                <div className="sd-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="sd-feature-content">
                  <strong className="sd-feature-name">{f.name}</strong>
                  <p className="sd-feature-desc">{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <a href="/services" className="sd-back-button">
          ← View All Services
        </a>
        <button style={{
  backgroundColor: '#22c55e',
  color: 'white',
  padding: '12px 24px',
  border: 'none',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  textAlign: 'center'
}}
onMouseOver={e => e.currentTarget.style.backgroundColor = '#16a34a'}
onMouseOut={e => e.currentTarget.style.backgroundColor = '#22c55e'}
>
  <span>Request this Service</span>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</button>

      </div>
      
      <div className="sd-gradient-bg"></div>
    </div>
  );
}