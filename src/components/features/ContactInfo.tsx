import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ContactInfoProps {
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  workingHours?: string; // e.g., "Monday to Friday: 9:00 - 18:00"
  socialLinks?: {
    wechat?: string;
    linkedin?: string;
    bilibili?: string; // Or other relevant social media
  };
}

const ContactInfo = ({
  companyName = "PRSPARES",
  address = "Huaqiangbei, Shenzhen, China",
  phone = "+86 123 4567 8900",
  email = "sales@prspares.com",
  description = "Your trusted source for mobile repair parts and expert advice. We are committed to providing quality components and excellent customer service.",
  workingHours = "Monday to Friday: 9:00 - 18:00",
  socialLinks = {}
}: ContactInfoProps) => {
  return (
    <div className="bg-gray-50 p-6 md:p-8 rounded-xl shadow-lg h-full">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
        {companyName} Information
      </h2>
      
      {description && (
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
      )}

      <div className="space-y-6">
        {phone && (
          <div className="flex items-start">
            <Phone className="text-[#00B140] mr-4 mt-1 flex-shrink-0" size={22} />
            <div>
              <h3 className="font-semibold text-lg text-gray-700">Phone</h3>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-[#00B140] transition-colors">
                {phone}
              </a>
              {/* Add secondary phone if needed */}
            </div>
          </div>
        )}
        
        {email && (
          <div className="flex items-start">
            <Mail className="text-[#00B140] mr-4 mt-1 flex-shrink-0" size={22} />
            <div>
              <h3 className="font-semibold text-lg text-gray-700">Email</h3>
              <a href={`mailto:${email}`} className="text-gray-600 hover:text-[#00B140] transition-colors">
                {email}
              </a>
              {/* Add secondary email if needed */}
            </div>
          </div>
        )}
        
        {address && (
          <div className="flex items-start">
            <MapPin className="text-[#00B140] mr-4 mt-1 flex-shrink-0" size={22} />
            <div>
              <h3 className="font-semibold text-lg text-gray-700">Office Address</h3>
              <p className="text-gray-600">{address}</p>
            </div>
          </div>
        )}
        
        {workingHours && (
          <div className="flex items-start">
            <Clock className="text-[#00B140] mr-4 mt-1 flex-shrink-0" size={22} />
            <div>
              <h3 className="font-semibold text-lg text-gray-700">Working Hours</h3>
              <p className="text-gray-600">{workingHours}</p>
              <p className="text-gray-600">Saturday & Sunday: Closed</p>
            </div>
          </div>
        )}
      </div>
      
      {(socialLinks.wechat || socialLinks.linkedin || socialLinks.bilibili) && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-lg text-gray-700 mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            {socialLinks.wechat && (
              <a href={socialLinks.wechat} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-green-500 hover:text-white transition-all duration-300 rounded-full" aria-label="WeChat">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.6 8.2a7.43 7.43 0 0 0-14 3.9c0 1.5.5 2.7 1.3 3.6.8 1 1.9 1.5 3.2 1.5 1.2 0 2.4-.6 3.2-1.5.8-.9 1.3-2.1 1.3-3.6 0-1.2-.4-2.2-1-3 1.7-1 3.7-1.6 6-.9z"></path><path d="M8.8 16.7a2.38 2.38 0 0 0 2.4-2.4 2.38 2.38 0 0 0-4.8 0c0 1.3 1.1 2.4 2.4 2.4z"></path><path d="M16 14.3a2.38 2.38 0 0 0-2.4 2.4 2.38 2.38 0 0 0 4.8 0c0-1.3-1.1-2.4-2.4-2.4z"></path></svg>
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-full" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            )}
             {/* Add other social links like Bilibili if needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
