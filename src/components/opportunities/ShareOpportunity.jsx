import React, { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa6";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const ShareOpportunity = ({ opportunity, closeModal }) => {
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [shareMessage, setShareMessage] = useState(
    "¡Mira esta increíble oportunidad que encontré!",
  );

  const selectSocialNetwork = (network) => {
    setSelectedNetwork(network);
  };

  const shareContent = () => {
    if (!selectedNetwork) return;

    const message =
      shareMessage || "¡Mira esta increíble oportunidad que encontré!";

    const opportunityUrl = `${window.location.origin}/edutracker/oportunidad/${opportunity.id}`;
    const encodedUrl = encodeURIComponent(opportunityUrl);

    let shareUrl = "";

    const title = opportunity.title;
    const hashtags = "educacion,oportunidades,aprendizaje";

    switch (selectedNetwork) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer.php?u=${encodedUrl}`;
        break;

      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          message,
        )}&url=${encodedUrl}&hashtags=${encodeURIComponent(hashtags)}`;
        break;

      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          `${message} ${opportunityUrl}`,
        )}`;
        break;

      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;

      case "instagram":
        navigator.clipboard.writeText(opportunityUrl).then(() => {
          alert(
            "El enlace ha sido copiado. Puedes pegarlo en tu historia de Instagram.",
          );
        });
        return;

      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }

    toast.success(`¡Contenido compartido exitosamente en ${selectedNetwork}!`);
    closeModal();
  };

  const SocialButton = ({ network, icon: Icon, name }) => (
    <div
      className={`flex flex-col items-center cursor-pointer transition-all ${
        selectedNetwork === network
          ? "scale-110 opacity-100"
          : "opacity-70 hover:opacity-100 hover:scale-105"
      }`}
      onClick={() => selectSocialNetwork(network)}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex justify-center items-center text-white mb-2 shadow-md transition-all ${getSocialColor(
          network,
        )} ${
          selectedNetwork === network
            ? "ring-2 ring-offset-2 ring-[#f5ba3c]"
            : ""
        }`}
      >
        {Icon && <Icon className="text-xl" />}
      </div>
      <span className="text-xs font-medium text-gray-700">{name}</span>
    </div>
  );

  const getSocialColor = (network) => {
    const baseStyle = "transition-all duration-200 hover:opacity-90";

    switch (network) {
      case "facebook":
        return `${baseStyle} bg-[#1877F2] hover:bg-[#166FE5]`;
      case "twitter":
        return `${baseStyle} bg-[#1DA1F2] hover:bg-[#1A91DA]`;
      case "instagram":
        return `${baseStyle} bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]`;
      case "whatsapp":
        return `${baseStyle} bg-[#25D366] hover:bg-[#20BD5A]`;
      case "telegram":
        return `${baseStyle} bg-[#0088CC] hover:bg-[#0077B5]`;
      case "linkedin":
        return `${baseStyle} bg-[#0A66C2] hover:bg-[#0956A5]`;
      default:
        return `${baseStyle} bg-[#4db9a9] hover:bg-[#3da395]`;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-2xl w-11/12 max-w-md p-8 relative border border-gray-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-[#ec451d] transition-colors"
          onClick={closeModal}
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold mb-6 text-[#1a1a1a]">
          Compartir oportunidad
        </h3>

        <div className="flex bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
          <div className="w-20 h-20 bg-[#4db9a9] rounded-lg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {opportunity.title.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4 overflow-hidden">
            <p className="font-bold text-[#1a1a1a] truncate">
              {opportunity.title}
            </p>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {opportunity.description}
            </p>
            <p className="text-xs text-[#4db9a9] font-medium mt-2 truncate">
              {opportunity.url}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="share-message"
            className="block mb-2 text-gray-700 font-medium"
          >
            Mensaje personalizado:
          </label>
          <textarea
            id="share-message"
            className="w-full p-3 bg-white border border-gray-200 rounded-xl resize-none min-h-[100px] 
                     focus:ring-2 focus:ring-[#4db9a9] focus:border-transparent transition-all
                     text-gray-800 placeholder-gray-400 text-sm"
            placeholder="¡Mira esta increíble oportunidad que encontré en Edu-Us! 🚀"
            value={shareMessage}
            onChange={(e) => setShareMessage(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4 text-center">
            Compartir en:
          </p>
          <div className="grid grid-cols-5 gap-4 mb-6">
            <SocialButton
              network="facebook"
              icon={FaFacebook}
              name="Facebook"
            />
            <SocialButton network="twitter" icon={FaTwitter} name="Twitter" />
            <SocialButton
              network="instagram"
              icon={FaInstagram}
              name="Instagram"
            />
            <SocialButton
              network="whatsapp"
              icon={FaWhatsapp}
              name="WhatsApp"
            />
            {/* <SocialButton
              network="telegram"
              icon={FaTelegram}
              name="Telegram"
            /> */}
            <SocialButton
              network="linkedin"
              icon={FaLinkedin}
              name="LinkedIn"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={shareContent}
            disabled={!selectedNetwork}
            className={`px-8 py-3 rounded-full text-white font-medium transition-all shadow-md ${
              selectedNetwork
                ? "bg-gradient-to-r from-[#4db9a9] to-[#3da395] hover:from-[#3da395] hover:to-[#2d8f82] transform hover:-translate-y-0.5"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {selectedNetwork ? "Compartir ahora" : "Selecciona una red"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareOpportunity;
