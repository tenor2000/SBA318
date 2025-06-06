export function newWizardTemplate(
  name,
  ownerId,
  classId,
  pspellsArray,
  aspellsArray,
  nspellsArray,
  backstory
) {
  const wizardTemplate = structuredClone(
    require("../../testData/warbandData/wizards.json").find(
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

export function newApprenticeTemplate(name, id) {
  const apprenticeTemplate = structuredClone(
    require("../../testData/warbandData/apprentices.json").find(
      (a) => a.wizard_id == "_TEMPLATE_"
    )
  );
  apprenticeTemplate.name = name;
  apprenticeTemplate.wizard_id = id;

  return apprenticeTemplate;
}

export function newPersonnelTemplate(name, rosterPosition, id) {
  const personnelTemplate = structuredClone(
    require("../../testData/warbandData/personnel.json").find(
      (p) => p.wizard_id == "_TEMPLATE_"
    )
  );
  personnelTemplate.name = name;
  personnelTemplate.rosterPosition = rosterPosition;
  personnelTemplate.wizard_id = id;
  return personnelTemplate;
}

export function newUserTemplate(name) {
  const userTemplate = structuredClone(
    require("../../testData/userData/users.json").find(
      (u) => u.id == "_TEMPLATE_"
    )
  );
  userTemplate.name = name;
  return userTemplate;
}
