import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  otp: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName, otp
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>Your OTP is {otp}</p>
  </div>
);
