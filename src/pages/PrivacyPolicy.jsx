import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Eye, Mail } from 'lucide-react';
import { APP_NAME } from '../constants';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gridBorder sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft size={24} className="text-primaryPurple" />
          </button>
          <h1 className="ml-4 text-xl font-bold text-gray-800">Privacy Policy</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-10">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gridBorder">
          <div className="flex items-center mb-8">
            <div className="bg-primaryPurple/10 p-3 rounded-2xl mr-4">
              <ShieldCheck size={32} className="text-primaryPurple" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Privacy Matters</h2>
              <p className="text-gray-500 text-sm">Last updated: August 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            {/* Section 1 */}
            <section>
              <h3 className="text-lg font-bold text-secondaryBlue flex items-center mb-3">
                <Eye size={20} className="mr-2" /> 1. Information We Collect
              </h3>
              <p>
                At <strong>{APP_NAME}</strong>, we value your privacy. We do not require users to create an account. 
                However, we may collect minimal data such as device type, operating system, and app usage statistics 
                to improve our services.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-lg font-bold text-accentPink flex items-center mb-3">
                <Lock size={20} className="mr-2" /> 2. Local Storage
              </h3>
              <p>
                Your "Saved Prompts" are stored locally on your device using browser local storage or phone memory. 
                We do not upload your personal collections to our servers. If you clear your data or uninstall the app, 
                this information may be lost.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="text-lg font-bold text-primaryPurple flex items-center mb-3">
                <ShieldCheck size={20} className="mr-2" /> 3. Third-Party Services
              </h3>
              <p>
                We use third-party services like Render (for hosting) and Supabase (for database management). 
                These services have their own privacy policies regarding data handling. We also display images 
                hosted on external servers.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3">4. Analytics</h3>
              <p>
                We track the number of views, copies, and shares for each prompt. This data is anonymous and 
                is used only to show trending content to our community.
              </p>
            </section>

            {/* Contact Section */}
            <div className="mt-12 p-6 bg-promptBox rounded-2xl border border-gridBorder border-dashed text-center">
              <Mail className="mx-auto mb-3 text-primaryPurple" size={30} />
              <h4 className="font-bold text-gray-900">Have Questions?</h4>
              <p className="text-sm text-gray-600 mb-4">Feel free to reach out to our support team.</p>
              <a href="mailto:support@antimgroups.com" className="text-primaryPurple font-bold hover:underline">
                support@antimprompt.com
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;