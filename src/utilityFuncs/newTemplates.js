function newWizardTemplate(
  name,
  ownerId,
  classId,
  pspellsArray,
  aspellsArray,
  nspellsArray,
  backstory
) {
  const wizardTemplate = structuredClone(
    require("../testData/warbandData/wizards.json").find(
      (w) => w.wizard_id == "_TEMPLATE_"
    )
  );

  wizardTemplate.name = name;
  wizardTemplate.ownerId = parseInt(ownerId);
  wizardTemplate.classId = parseInt(classId) || wizardTemplate.classId;
  wizardTemplate.primarySpellIds = pspellsArray.map(Number);
  wizardTemplate.alignedSpellIds = aspellsArray.map(Number);
  wizardTemplate.neutralSpellIds = nspellsArray.map(Number);
  wizardTemplate.backstory = backstory;
  return wizardTemplate;
}

function newApprenticeTemplate(name, wizardId) {
  const apprenticeTemplate = structuredClone(
    require("../testData/warbandData/apprentices.json").find(
      (a) => a.wizardId == "_TEMPLATE_"
    )
  );
  apprenticeTemplate.name = name;
  apprenticeTemplate.wizardId = wizardId;

  return apprenticeTemplate;
}

function newPersonnelTemplate(name, wizardId) {
  const personnelTemplate = structuredClone(
    require("../testData/warbandData/personnel.json").find(
      (p) => p.wizardId == "_TEMPLATE_"
    )
  );
  personnelTemplate.name = name;
  personnelTemplate.wizardId = wizardId;
  return personnelTemplate;
}

function newUserTemplate(name) {
  const userTemplate = structuredClone(
    require("../testData/userData/users.json").find((u) => u.id == "_TEMPLATE_")
  );
  userTemplate.name = name;
  return userTemplate;
}

module.exports = {
  newWizardTemplate,
  newApprenticeTemplate,
  newPersonnelTemplate,
  newUserTemplate,
};
