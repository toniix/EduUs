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

const SocialButton = ({
  network,
  icon: Icon,
  name,
  selectedNetwork,
  onSelect,
}) => (
  <div
    role="button"
    tabIndex={0}
    className={`flex flex-col items-center cursor-pointer transition-all ${
      selectedNetwork === network
        ? "scale-110 opacity-100"
        : "opacity-70 hover:opacity-100 hover:scale-105"
    }`}
    onClick={() => onSelect(network)}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(network)}
  >
    <div
      className={`w-12 h-12 rounded-2xl flex justify-center items-center text-white mb-2 shadow-md transition-all ${getSocialColor(
        network,
      )} ${
        selectedNetwork === network ? "ring-2 ring-offset-2 ring-[#f5ba3c]" : ""
      }`}
    >
      {Icon && <Icon className="text-xl" />}
    </div>
    <span className="text-xs font-medium text-gray-700">{name}</span>
  </div>
);

export default SocialButton;
