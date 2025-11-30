import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-4xl font-bold text-center">
        Privacy Policy of Bulkwala
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Welcome to Bulkwala.com. We value the trust you place in us and
            recognize the importance of secure transactions and information
            privacy. This Privacy Policy describes how www.bulkwala.com online
            marketplace and its affiliates (collectively "Bulkwala”, we, our,
            us) collect, use, share or otherwise process your personal data
            through the website, mobile application, and m-site (hereinafter
            referred to as the "Platform").
          </p>
          <p>
            By using our Platform, providing information, or availing
            products/services, you agree to be bound by this Privacy Policy, the
            Terms of Use, and applicable laws of India.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Collection & Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            We collect and analyze your personal data relating to your buying
            behavior, browsing patterns, preferences, and other information you
            provide. This helps us understand your needs, provide a better user
            experience, protect users, and optimize products and services.
          </p>
          <p>
            Collected information may include URLs visited, browser information,
            IP address, and aggregated insights shared with affiliates,
            partners, and third parties to personalize your experience.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Data Collected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            We may collect personal data such as email, delivery address, name,
            phone number, payment details, and account information when you
            register, transact, or participate in contests/events.
          </p>
          <p>
            User-generated content (messages, feedback, voice commands, etc.)
            may also be collected for internal research, dispute resolution,
            customer support, and analysis.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cookies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            We use cookies to analyze website flow, improve services, and
            provide a personalized experience. Cookies do not contain personal
            data.
          </p>
          <p>
            Third-party cookies (e.g., Google Analytics) may also be used for
            marketing and analytics. You can opt-out of these via browser
            settings or Google Analytics opt-out tools.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sharing of Personal Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Personal data may be shared with Bulkwala group companies,
            affiliates, business partners, sellers, third-party service
            providers, and regulatory authorities as required for order
            fulfillment, credit checks, marketing, and legal compliance.
          </p>
          <p>
            In case of mergers, acquisitions, or restructuring, your data may be
            shared with new business entities under the same privacy standards.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Precautions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We maintain reasonable safeguards to protect your information. Users
            are responsible for protecting login and password details.
            Transmission of data over the internet may carry inherent security
            risks.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Choice / Opt-Out</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Users can opt-out of non-essential communications via the
            Notification Preference page:
            <a
              href="https://www.Bulkwala.com/communication-preferences/email"
              target="_blank"
              className="text-blue-600"
            >
              {" "}
              Unsubscribe/Opt-out
            </a>
            .
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Children Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            The Platform is available only to users who can form legally binding
            contracts under Indian law. We do not knowingly collect personal
            data from children under 18.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Personal data is retained in accordance with applicable laws. Data
            may be anonymized for research, or retained to prevent fraud, defend
            legal rights, or comply with legal obligations.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Rights & Consent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Users can access, correct, update, or delete personal data via
            Platform settings or by contacting us. Consent can be withdrawn, but
            withdrawal may limit Platform access.
          </p>
          <p>
            By using the Platform, you consent to data collection, storage, and
            processing by Bulkwala and its partners as described in this Privacy
            Policy.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Changes to Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We may update this Privacy Policy from time to time. Users are
            encouraged to review it periodically. Significant changes will be
            notified via Platform notice or email.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
