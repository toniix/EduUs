import test from "node:test";
import assert from "node:assert/strict";
import {
  answerError,
  choiceSelection,
  hasAnswer,
  setChoiceOtherText,
  setChoiceSelection,
} from "./surveyAnswers.js";

const supportQuestion = {
  question_type: "multi_choice",
  required: true,
  options: ["Familia", "Profesionales", "No tengo a quién recurrir", "Otra"],
  max_selections: 2,
  other_option: "Otra",
  other_text_max_length: 160,
  exclusive_options: ["No tengo a quién recurrir"],
};

test("Otra requiere un texto y cuenta como una de las dos selecciones", () => {
  const selection = setChoiceSelection(supportQuestion, null, ["Familia", "Otra"]);
  assert.deepEqual(choiceSelection(selection), ["Familia", "Otra"]);
  assert.match(answerError(supportQuestion, selection), /Describe/);
  assert.equal(answerError(supportQuestion, setChoiceOtherText(selection, "Otra persona")), null);
  assert.match(
    answerError(supportQuestion, { selected: ["Familia", "Profesionales", "Otra"], other_text: "Alguien" }),
    /hasta 2/,
  );
});

test("una opción excluyente no se puede combinar con otras", () => {
  assert.equal(answerError(supportQuestion, ["No tengo a quién recurrir"]), null);
  assert.match(answerError(supportQuestion, ["Familia", "No tengo a quién recurrir"]), /combinarse/);
});

test("al quitar Otra se descarta su texto y se rechazan opciones repetidas", () => {
  const first = setChoiceOtherText(setChoiceSelection(supportQuestion, null, ["Otra"]), "Tutor");
  assert.deepEqual(setChoiceSelection(supportQuestion, first, ["Familia"]), {
    selected: ["Familia"], other_text: "",
  });
  assert.match(answerError(supportQuestion, ["Familia", "Familia"]), /sin repetir/);
});

test("las preguntas opcionales vacías no bloquean y un objeto vacío no cuenta como respuesta", () => {
  assert.equal(answerError({ question_type: "long_text", required: false }, ""), null);
  assert.equal(hasAnswer(supportQuestion, { selected: [], other_text: "" }), false);
  assert.equal(hasAnswer(supportQuestion, { selected: ["Familia"], other_text: "" }), true);
});

test("las escalas solo aceptan enteros dentro del rango", () => {
  const question = { question_type: "scale", required: true, scale_min: 1, scale_max: 5 };
  assert.equal(answerError(question, 3), null);
  assert.match(answerError(question, 2.5), /escala/);
  assert.match(answerError(question, 6), /escala/);
});
