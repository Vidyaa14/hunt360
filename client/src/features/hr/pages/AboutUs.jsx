// import React from 'react';
// import styled from 'styled-components';

// const purple = '#a000c8';
// const darkPurple = '#8a00c2';

// const AboutUsContainer = styled.div`
//   min-height: 100vh;
//   padding-top: 60px; /* Default for mobile */
//   background-color: #fff;
//   display: flex;
//   flex-direction: column;

//   @media (min-width: 641px) {
//     padding-top: 70px; /* Tablet */
//   }

//   @media (min-width: 1025px) {
//     padding-top: 80px; /* Desktop */
//   }
// `;

// const MainContent = styled.div`
//   flex: 1;
//   padding: 1rem; /* Default for mobile */
//   display: flex;
//   flex-direction: column;
//   gap: 1.5rem;

//   @media (min-width: 641px) {
//     padding: 1.5rem;
//     gap: 1.75rem;
//   }

//   @media (min-width: 1025px) {
//     padding: 2rem;
//     gap: 2rem;
//   }
// `;

// const AboutSection = styled.div`
//   display: flex;
//   gap: 1rem; /* Default for mobile */
//   align-items: center;

//   @media (max-width: 640px) {
//     flex-direction: column;
//   }

//   @media (min-width: 641px) {
//     gap: 1.5rem;
//   }

//   @media (min-width: 1025px) {
//     gap: 2rem;
//     flex-direction: row;
//   }
// `;

// const AboutText = styled.div`
//   flex: 1;

//   @media (max-width: 640px) {
//     text-align: center;
//   }
// `;

// const Title = styled.h1`
//   font-size: 1.8rem; /* Default for mobile */
//   color: ${purple};
//   margin-bottom: 0.75rem;

//   @media (min-width: 641px) {
//     font-size: 2rem;
//     margin-bottom: 0.875rem;
//   }

//   @media (min-width: 1025px) {
//     font-size: 2.5rem;
//     margin-bottom: 1rem;
//   }
// `;

// const MissionText = styled.p`
//   font-size: 1rem; /* Default for mobile */
//   color: #4A5568;
//   margin-bottom: 0.75rem;

//   @media (min-width: 641px) {
//     font-size: 1.1rem;
//     margin-bottom: 0.875rem;
//   }

//   @media (min-width: 1025px) {
//     font-size: 1.2rem;
//     margin-bottom: 1rem;
//   }
// `;

// const KeyPoint = styled.div`
//   margin-bottom: 0.75rem;

//   @media (min-width: 641px) {
//     margin-bottom: 0.875rem;
//   }

//   @media (min-width: 1025px) {
//     margin-bottom: 1rem;
//   }
// `;

// const KeyPointTitle = styled.h3`
//   font-size: 1rem; /* Default for mobile */
//   color: ${purple};
//   margin-bottom: 0.3rem;

//   @media (min-width: 641px) {
//     font-size: 1.1rem;
//     margin-bottom: 0.4rem;
//   }

//   @media (min-width: 1025px) {
//     font-size: 1.2rem;
//     margin-bottom: 0.5rem;
//   }
// `;

// const KeyPointText = styled.p`
//   font-size: 0.9rem; /* Default for mobile */
//   color: #4A5568;

//   @media (min-width: 641px) {
//     font-size: 0.95rem;
//   }

//   @media (min-width: 1025px) {
//     font-size: 1rem;
//   }
// `;

// const AboutImage = styled.div`
//   flex: 1;
//   background-image: url('/mainbg.jpg');
//   background-size: cover;
//   background-position: center;
//   height: 250px; /* Default for mobile */
//   width: 100%; /* Full width on mobile */
//   max-width: 300px; /* Cap width on mobile */
//   border-radius: 0.5rem;

//   @media (min-width: 641px) {
//     height: 350px;
//     max-width: 400px;
//   }

//   @media (min-width: 1025px) {
//     height: 400px;
//     max-width: 500px;
//   }
// `;

// const CoreValuesSection = styled.div`
//   padding: 1rem; /* Default for mobile */
//   text-align: center;

//   @media (min-width: 641px) {
//     padding: 1.5rem;
//   }

//   @media (min-width: 1025px) {
//     padding: 2rem;
//   }
// `;

// const CoreValuesTitle = styled.h2`
//   font-size: 1.5rem; /* Default for mobile */
//   color: ${purple};
//   margin-bottom: 1.5rem;

//   @media (min-width: 641px) {
//     font-size: 1.75rem;
//     margin-bottom: 1.75rem;
//   }

//   @media (min-width: 1025px) {
//     font-size: 2rem;
//     margin-bottom: 2rem;
//   }
// `;

// const CoreValuesList = styled.div`
//   display: flex;
//   gap: 1rem; /* Default for mobile */
//   justify-content: center;
//   flex-wrap: wrap;

//   @media (min-width: 641px) {
//     gap: 1.5rem;
//   }

//   @media (min-width: 1025px) {
//     gap: 2rem;
//   }
// `;

// const CoreValueCard = styled.div`
//   width: 150px; /* Default for mobile */
//   text-align: center;

//   @media (min-width: 641px) {
//     width: 175px;
//   }

//   @media (min-width: 1025px) {
//     width: 200px;
//   }
// `;

// const CoreValueIcon = styled.div`
//   font-size: 1.5rem; /* Default for mobile */
//   color: ${purple};
//   margin-bottom: 0.3rem;

//   @media (min-width: 641px) {
//     font-size: 1.75rem;
//     margin-bottom: 0.4rem;
//   }

//   @media (min-width: 1025px) {
//     font-size: 2rem;
//     margin-bottom: 0.5rem;
//   }
// `;

// const CoreValueTitle = styled.h3`
//   font-size: 1rem; /* Default for mobile */
//   color: ${purple};
//   margin-bottom: 0.3rem;

//   @media (min-width: 641px) {
//     font-size: 1.1rem;
//     margin-bottom: 0.4rem;
//   }

//   @media (min-width: 1025px) {
//     font-size: 1.2rem;
//     margin-bottom: 0.5rem;
//   }
// `;

// const CoreValueText = styled.p`
//   font-size: 0.9rem; /* Default for mobile */
//   color: #4A5568;

//   @media (min-width: 641px) {
//     font-size: 0.95rem;
//   }

//   @media (min-width: 1025px) {
//     font-size: 1rem;
//   }
// `;

// const Footer = styled.footer`
//   background-color: #1a202c;
//   color: #fff;
//   padding: 1rem; /* Default for mobile */
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 0.75rem;

//   @media (min-width: 641px) {
//     padding: 1.5rem;
//     gap: 1rem;
//   }

//   @media (min-width: 1025px) {
//     padding: 2rem;
//     gap: 1rem;
//   }
// `;

// const NewsletterSection = styled.div`
//   display: flex;
//   gap: 0.5rem; /* Default for mobile */
//   align-items: center;
//   margin-bottom: 0.75rem;

//   @media (max-width: 640px) {
//     flex-direction: column;
//   }

//   @media (min-width: 641px) {
//     gap: 0.75rem;
//     margin-bottom: 1rem;
//   }

//   @media (min-width: 1025px) {
//     gap: 1rem;
//   }
// `;

// const NewsletterLabel = styled.label`
//   font-size: 0.9rem; /* Default for mobile */

//   @media (min-width: 641px) {
//     font-size: 0.95rem;
//   }

//   @media (min-width: 1025px) {
//     font-size: 1rem;
//   }
// `;

// const NewsletterInput = styled.input`
//   padding: 0.4rem; /* Default for mobile */
//   border: 1px solid #e2e8f0;
//   border-radius: 0.25rem;
//   font-size: 0.9rem;
//   width: 100%; /* Full width on mobile */
//   max-width: 250px;

//   @media (min-width: 641px) {
//     padding: 0.5rem;
//     font-size: 0.95rem;
//     max-width: 300px;
//   }

//   @media (min-width: 1025px) {
//     font-size: 1rem;
//     max-width: 350px;
//   }
// `;

// const SubscribeButton = styled.button`
//   padding: 0.4rem 0.8rem; /* Default for mobile */
//   background-color: ${purple};
//   color: #fff;
//   border: none;
//   border-radius: 0.25rem;
//   cursor: pointer;
//   transition: background-color 0.3s ease;
//   font-size: 0.9rem;

//   &:hover {
//     background-color: ${darkPurple};
//   }

//   @media (min-width: 641px) {
//     padding: 0.5rem 1rem;
//     font-size: 0.95rem;
//   }

//   @media (min-width: 1025px) {
//     font-size: 1rem;
//   }
// `;

// const FooterLinks = styled.div`
//   display: flex;
//   gap: 0.5rem; /* Default for mobile */
//   flex-wrap: wrap;
//   justify-content: center;

//   @media (min-width: 641px) {
//     gap: 0.75rem;
//   }

//   @media (min-width: 1025px) {
//     gap: 1rem;
//   }
// `;

// const FooterLink = styled.a`
//   color: #fff;
//   text-decoration: none;
//   font-size: 0.8rem; /* Default for mobile */

//   &:hover {
//     text-decoration: underline;
//   }

//   @media (min-width: 641px) {
//     font-size: 0.85rem;
//   }

//   @media (min-width: 1025px) {
//     font-size: 0.9rem;
//   }
// `;

// const FooterBottom = styled.div`
//   display: flex;
//   justify-content: space-between;
//   width: 100%;
//   max-width: 1200px;
//   margin-top: 0.75rem; /* Default for mobile */
//   font-size: 0.8rem;

//   @media (max-width: 640px) {
//     flex-direction: column;
//     align-items: center;
//     gap: 0.5rem;
//   }

//   @media (min-width: 641px) {
//     margin-top: 0.875rem;
//     font-size: 0.85rem;
//   }

//   @media (min-width: 1025px) {
//     margin-top: 1rem;
//     font-size: 0.9rem;
//   }
// `;

// const LanguageSelect = styled.select`
//   background-color: #2d3748;
//   color: #fff;
//   border: none;
//   padding: 0.2rem; /* Default for mobile */
//   border-radius: 0.25rem;

//   @media (min-width: 641px) {
//     padding: 0.25rem;
//   }
// `;

// const SocialIcons = styled.div`
//   display: flex;
//   gap: 0.5rem;
// `;

// const SocialIcon = styled.a`
//   color: #fff;
//   font-size: 1rem; /* Default for mobile */
//   text-decoration: none;

//   &:hover {
//     color: ${purple};
//   }

//   @media (min-width: 641px) {
//     font-size: 1.1rem;
//   }

//   @media (min-width: 1025px) {
//     font-size: 1.2rem;
//   }
// `;

// const AboutUs = () => {
//   return (
//     <div>
//       <AboutUsContainer>
//         <MainContent>
//           <AboutSection>
//             <AboutText>
//               <Title>About Us</Title>
//               <MissionText>
//                 At HR Hunt, our mission is to simplify HR processes and foster a culture of collaboration and innovation in the workplace.
//               </MissionText>
//               <KeyPoint>
//                 <KeyPointTitle>Innovation</KeyPointTitle>
//                 <KeyPointText>We leverage cutting-edge technology and human-centric design to revolutionize how businesses manage their human resources.</KeyPointText>
//               </KeyPoint>
//               <KeyPoint>
//                 <KeyPointTitle>Customer-Centric</KeyPointTitle>
//                 <KeyPointText>Our commitment lies in delivering tailored solutions that empower our clients and enhance their employee engagement.</KeyPointText>
//               </KeyPoint>
//               <KeyPoint>
//                 <KeyPointTitle>Expertise</KeyPointTitle>
//                 <KeyPointText>With a team of seasoned HR professionals and tech enthusiasts, we bring unparalleled expertise and insight to every project.</KeyPointText>
//               </KeyPoint>
//               <KeyPoint>
//                 <KeyPointTitle>Integrity</KeyPointTitle>
//                 <KeyPointText>Transparency and integrity are at the core of everything we do, ensuring trust and long-lasting partnerships with our clients.</KeyPointText>
//               </KeyPoint>
//             </AboutText>
//             <AboutImage />
//           </AboutSection>
//           <CoreValuesSection>
//             <CoreValuesTitle>Our Core Values</CoreValuesTitle>
//             <CoreValuesList>
//               <CoreValueCard>
//                 <CoreValueIcon>🤝</CoreValueIcon>
//                 <CoreValueTitle>Commitment</CoreValueTitle>
//                 <CoreValueText>At HR Hunt, we are dedicated to providing exceptional service and support to our clients and their employees.</CoreValueText>
//               </CoreValueCard>
//               <CoreValueCard>
//                 <CoreValueIcon>👥</CoreValueIcon>
//                 <CoreValueTitle>Respect</CoreValueTitle>
//                 <CoreValueText>We treat everyone with dignity and respect, fostering a positive and collaborative work environment.</CoreValueText>
//               </CoreValueCard>
//               <CoreValueCard>
//                 <CoreValueIcon>🌟</CoreValueIcon>
//                 <CoreValueTitle>Integrity</CoreValueTitle>
//                 <CoreValueText>We uphold the highest standards of integrity and honesty in all our interactions.</CoreValueText>
//               </CoreValueCard>
//               <CoreValueCard>
//                 <CoreValueIcon>💡</CoreValueIcon>
//                 <CoreValueTitle>Innovation</CoreValueTitle>
//                 <CoreValueText>We encourage creative and innovative thinking to drive the best solutions for our clients and their employees.</CoreValueText>
//               </CoreValueCard>
//             </CoreValuesList>
//           </CoreValuesSection>
//         </MainContent>
//         <Footer>
//           <NewsletterSection>
//             <NewsletterLabel>Subscribe to our newsletter</NewsletterLabel>
//             <NewsletterInput placeholder="Input your email" />
//             <SubscribeButton>Subscribe</SubscribeButton>
//           </NewsletterSection>
//           <FooterLinks>
//             <FooterLink href="/pricing">Pricing</FooterLink>
//             <FooterLink href="/about">About us</FooterLink>
//             <FooterLink href="/features">Features</FooterLink>
//             <FooterLink href="/help">Help Center</FooterLink>
//             <FooterLink href="/contact">Contact us</FooterLink>
//             <FooterLink href="/faqs">FAQs</FooterLink>
//             <FooterLink href="/careers">Careers</FooterLink>
//             <FooterLink href="/blog">Blog</FooterLink>
//             <FooterLink href="/events">Events</FooterLink>
//             <FooterLink href="/partners">Partners</FooterLink>
//           </FooterLinks>
//           <FooterBottom>
//             <div>
//               <LanguageSelect>
//                 <option>English</option>
//                 <option>Spanish</option>
//                 <option>French</option>
//               </LanguageSelect>
//               <span style={{ marginLeft: '1rem' }}>
//                 © 2025 HR Hunt Inc. • <FooterLink href="/privacy">Privacy</FooterLink> • <FooterLink href="/terms">Terms</FooterLink> • <FooterLink href="/sitemap">Sitemap</FooterLink>
//               </span>
//             </div>
//             <SocialIcons>
//               <SocialIcon href="https://twitter.com/hrhunt">🐦</SocialIcon>
//               <SocialIcon href="https://facebook.com/hrhunt">📘</SocialIcon>
//               <SocialIcon href="https://linkedin.com/company/hrhunt">💼</SocialIcon>
//               <SocialIcon href="https://instagram.com/hrhunt">📷</SocialIcon>
//             </SocialIcons>
//           </FooterBottom>
//         </Footer>
//       </AboutUsContainer>
//     </div>
//   );
// };

// export default AboutUs;
import React from 'react';
import styled from 'styled-components';

const purple = '#a000c8';
const darkPurple = '#8a00c2';

/* ---------- CONTAINER ---------- */
const AboutUsContainer = styled.div`
  min-height: 100vh;
  padding-top: 0; /* Hero handles spacing */
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

/* ---------- HERO SECTION ---------- */
const HeroSection = styled.div`
  background: linear-gradient(rgba(160, 0, 200, 0.7), rgba(138, 0, 194, 0.7)),
    url('/mainbg.jpg') center/cover no-repeat;
  color: white;
  text-align: center;
  padding: 4rem 1rem;

  @media (min-width: 768px) {
    padding: 6rem 2rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-top: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

/* ---------- MAIN CONTENT ---------- */
const MainContent = styled.div`
  flex: 1;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (min-width: 1025px) {
    padding: 4rem;
  }
`;

/* ---------- ABOUT SECTION ---------- */
const AboutSection = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-direction: column;

  @media (min-width: 1025px) {
    flex-direction: row;
  }
`;

const AboutText = styled.div`
  flex: 1;
  text-align: center;

  @media (min-width: 1025px) {
    text-align: left;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: ${purple};
  margin-bottom: 1rem;
`;

const MissionText = styled.p`
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const KeyPoint = styled.div`
  margin-bottom: 1rem;
`;

const KeyPointTitle = styled.h3`
  font-size: 1.2rem;
  color: ${purple};
  margin-bottom: 0.3rem;
`;

const KeyPointText = styled.p`
  font-size: 1rem;
  color: #4a5568;
`;

const AboutImage = styled.div`
  flex: 1;
  background-image: url('/mainbg.jpg');
  background-size: cover;
  background-position: center;
  height: 350px;
  border-radius: 1rem;
`;

/* ---------- CORE VALUES ---------- */
const CoreValuesSection = styled.div`
  text-align: center;
`;

const CoreValuesTitle = styled.h2`
  font-size: 2rem;
  color: ${purple};
  margin-bottom: 2rem;
`;

const CoreValuesList = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const CoreValueCard = styled.div`
  width: 200px;
  text-align: center;
  padding: 1.5rem;
  border-radius: 1rem;
  background: #fafafa;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0px 6px 20px rgba(160, 0, 200, 0.2);
  }
`;

const CoreValueIcon = styled.div`
  font-size: 2rem;
  color: ${purple};
  margin-bottom: 0.5rem;
`;

const CoreValueTitle = styled.h3`
  font-size: 1.2rem;
  color: ${purple};
  margin-bottom: 0.5rem;
`;

const CoreValueText = styled.p`
  font-size: 1rem;
  color: #4a5568;
`;

/* ---------- TEAM SECTION ---------- */
const FeaturesSection = styled.div`
  text-align: center;
`;

const FeaturesTitle = styled.h2`
  font-size: 2rem;
  color: ${purple};
  margin-bottom: 2rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  justify-items: center;
`;

const FeatureCard = styled.div`
  background: #fafafa;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0px 6px 18px rgba(160, 0, 200, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: ${purple};
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  color: ${purple};
  margin-bottom: 0.5rem;
`;

const FeatureText = styled.p`
  font-size: 1rem;
  color: #4a5568;
`;
/* ---------- FOOTER ---------- */
const Footer = styled.footer`
  background-color: #1a202c;
  color: #fff;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FooterLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
    color: ${purple};
  }
`;

/* ---------- COMPONENT ---------- */
const AboutUs = () => {
  return (
    <AboutUsContainer>
      {/* HERO */}
      <HeroSection>
        <HeroTitle>Welcome to HR Hunt</HeroTitle>
        <HeroSubtitle>
          Empowering businesses with smart HR solutions to simplify work, engage teams, and boost success.
        </HeroSubtitle>
      </HeroSection>

      {/* MAIN CONTENT */}
      <MainContent>
        {/* ABOUT */}
        <AboutSection>
          <AboutText>
            <Title>About Us</Title>
            <MissionText>
              At HR Hunt, our mission is to simplify HR processes and foster a culture of collaboration and innovation in the workplace.
            </MissionText>
            <KeyPoint>
              <KeyPointTitle>Innovation</KeyPointTitle>
              <KeyPointText>We leverage cutting-edge technology and human-centric design to revolutionize HR.</KeyPointText>
            </KeyPoint>
            <KeyPoint>
              <KeyPointTitle>Customer-Centric</KeyPointTitle>
              <KeyPointText>Delivering tailored solutions that empower our clients and enhance engagement.</KeyPointText>
            </KeyPoint>
          </AboutText>
          <AboutImage />
        </AboutSection>

        {/* CORE VALUES */}
        <CoreValuesSection>
          <CoreValuesTitle>Our Core Values</CoreValuesTitle>
          <CoreValuesList>
            <CoreValueCard>
              <CoreValueIcon>🤝</CoreValueIcon>
              <CoreValueTitle>Commitment</CoreValueTitle>
              <CoreValueText>Dedicated to providing exceptional service & support.</CoreValueText>
            </CoreValueCard>
            <CoreValueCard>
              <CoreValueIcon>💡</CoreValueIcon>
              <CoreValueTitle>Innovation</CoreValueTitle>
              <CoreValueText>We embrace creativity to drive better HR solutions.</CoreValueText>
            </CoreValueCard>
          </CoreValuesList>
        </CoreValuesSection>

        {/* TEAM */}
       <FeaturesSection>
  <FeaturesTitle>Why Choose Hunt?</FeaturesTitle>
  <FeaturesGrid>
    <FeatureCard>
      <FeatureIcon>⚡</FeatureIcon>
      <FeatureTitle>Efficiency</FeatureTitle>
      <FeatureText>
        Automate and streamline your HR tasks to save valuable time.
      </FeatureText>
    </FeatureCard>
    <FeatureCard>
      <FeatureIcon>🔒</FeatureIcon>
      <FeatureTitle>Security</FeatureTitle>
      <FeatureText>
        Protect sensitive data with enterprise-grade security protocols.
      </FeatureText>
    </FeatureCard>
    <FeatureCard>
      <FeatureIcon>📊</FeatureIcon>
      <FeatureTitle>Insights</FeatureTitle>
      <FeatureText>
        Gain actionable analytics to make smarter workforce decisions.
      </FeatureText>
    </FeatureCard>
    <FeatureCard>
      <FeatureIcon>🌍</FeatureIcon>
      <FeatureTitle>Scalability</FeatureTitle>
      <FeatureText>
        Built to grow with your business, no matter the size.
      </FeatureText>
    </FeatureCard>
  </FeaturesGrid>
</FeaturesSection>
      </MainContent>

      {/* FOOTER */}
      <Footer>
        <FooterLinks>
          <FooterLink href="/pricing">Pricing</FooterLink>
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </FooterLinks>
        <p>© 2025 HR Hunt Inc. All rights reserved.</p>
      </Footer>
    </AboutUsContainer>
  );
};

export default AboutUs;
