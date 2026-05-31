import * as Icons from "lucide-react";
import PropTypes from "prop-types";

export default function ProjectIcon({ name, ...props }) {
  if (!name) return <Icons.HelpCircle {...props} />;

  // Buscar el componente del icono
  const IconComponent = Icons[name] || Icons.HelpCircle;
  return <IconComponent {...props} />;
}

ProjectIcon.propTypes = {
  name: PropTypes.string,
};
