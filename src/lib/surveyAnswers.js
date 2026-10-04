export function choiceSelection(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value.selected;
  }
  return value;
}

export function choiceOtherText(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value.other_text || ""
    : "";
}

export function setChoiceSelection(question, value, selected) {
  if (!question.other_option) return selected;
  const includesOther = Array.isArray(selected)
    ? selected.includes(question.other_option)
    : selected === question.other_option;
  return {
    selected,
    other_text: includesOther ? choiceOtherText(value) : "",
  };
}

export function setChoiceOtherText(value, text) {
  return { ...value, other_text: text };
}

export function answerError(question, value) {
  const selected = choiceSelection(value);
  const otherText = choiceOtherText(value).trim();
  const options = question.options || [];
  const hasOther = Boolean(question.other_option);
  const maxOtherLength = question.other_text_max_length || 160;

  if (question.question_type === "single_choice") {
    if (!selected) return question.required ? "Responde esta pregunta para continuar." : null;
    if (!options.includes(selected)) return "Selecciona una opción válida.";
    if (selected === question.other_option) {
      if (!otherText) return "Describe tu respuesta en ‘Otra’.";
      if (otherText.length > maxOtherLength) return `Escribe hasta ${maxOtherLength} caracteres.`;
    } else if (hasOther && otherText) {
      return "El texto de ‘Otra’ solo corresponde a esa opción.";
    }
    return null;
  }

  if (question.question_type === "multi_choice") {
    if (!Array.isArray(selected) || selected.length === 0) {
      return question.required ? "Responde esta pregunta para continuar." : null;
    }
    if (selected.some((option) => !options.includes(option)) || new Set(selected).size !== selected.length) {
      return "Selecciona opciones válidas, sin repetir.";
    }
    if (question.max_selections && selected.length > question.max_selections) {
      return `Puedes elegir hasta ${question.max_selections} opciones.`;
    }
    if ((question.exclusive_options || []).some((option) => selected.includes(option)) && selected.length > 1) {
      return "Esta opción no puede combinarse con otras.";
    }
    if (selected.includes(question.other_option)) {
      if (!otherText) return "Describe tu respuesta en ‘Otra’.";
      if (otherText.length > maxOtherLength) return `Escribe hasta ${maxOtherLength} caracteres.`;
    } else if (hasOther && otherText) {
      return "El texto de ‘Otra’ solo corresponde a esa opción.";
    }
    return null;
  }

  if (question.question_type === "scale") {
    if (value === undefined || value === null) {
      return question.required ? "Responde esta pregunta para continuar." : null;
    }
    return Number.isInteger(value) && value >= question.scale_min && value <= question.scale_max
      ? null
      : "Selecciona un valor de la escala.";
  }

  if (question.question_type === "long_text") {
    if (!value || !String(value).trim()) {
      return question.required ? "Responde esta pregunta para continuar." : null;
    }
    return typeof value === "string" && value.length <= (question.text_max_length || 1000)
      ? null
      : "La respuesta supera el límite de caracteres.";
  }

  return "Esta pregunta no tiene un tipo válido.";
}

export function hasAnswer(question, value) {
  if (!question) return false;
  const selected = choiceSelection(value);
  if (question.question_type === "multi_choice") return Array.isArray(selected) && selected.length > 0;
  if (question.question_type === "single_choice") return typeof selected === "string" && selected.length > 0;
  if (question.question_type === "long_text") return typeof value === "string" && value.trim().length > 0;
  return value !== undefined && value !== null;
}
