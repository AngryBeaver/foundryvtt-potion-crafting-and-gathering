// =======================
// Mastercrafted models
// =======================

/**
 * @typedef {Object} ComponentMasterCrafted
 * @property {string} id -
 * @property {string} uuid -
 * @property {number} quantity -
 * @property {string} name -
 */

/**
 * @typedef {Object} IngredientMasterCrafted
 * @property {string} id -
 * @property {string} name -
 * @property {RecipeMasterCrafted} recipe -
 * @property {ComponentMasterCrafted[]} components -
 */

/**
 * @typedef {Object} ProductMasterCrafted
 * @property {string} id -
 * @property {string} name -
 * @property {ComponentMasterCrafted[]} components -
 */

// =======================
// Beaver Crafting models
// =======================
//ComponentData: https://github.com/AngryBeaver/beavers-system-interface/blob/main/src/types.ts#L79
//RecipeData: https://github.com/AngryBeaver/beavers-crafting/blob/main/src/types.ts#L162
//A component extends componentData
/**
 * @typedef {Object} ComponentDataBeaversCrafting
 * @property {string} id -
 * @property {string} uuid -
 * @property {string} type -
 * @property {string} name -
 * @property {string} img -
 * @property {number} quantity -
 * @property {string?} itemType -
 * @property {Object?} flags -
 */

/**
 * interface ComponentData {
 *     id: string
 *     uuid: string;
 *     type: string;
 *     name: string;
 *     img: string;
 *     quantity: number;
 *     itemType?: string;      //if it is of type item there is an itemType
 *     jsonData?: string;      //to store a component completly
 *     flags?: {[moduleId:string]:any}          //module specific flags
 *     [key: string]: unknown; //this is system dependent information! do not relay on it. It is only needed for internal behavior e.g. isSame.
 * }
 */

/**
 * interface RecipeData {
 *     input: {
 *         [key: string]: {
 *             [key: string]: ComponentData
 *         }
 *     }
 *     output: {
 *         [key: string]: {
 *             [key: string]: ComponentData
 *         }
 *     }
 *     required: {
 *         [key: string]: {
 *             [key: string]: ComponentData
 *         }
 *     }
 *     ingredients?: {  //for compatibility migrated to input
 *         [key: string]: ComponentData
 *     }
 *     results?: { //for compatibility migrated to output
 *         [key: string]: ComponentData
 *     }
 *     attendants?: { //for compatibility migrated to required
 *         [key: string]: ComponentData
 *     },
 *     tests?: Tests;
 *     skill?: Skill; //for compatibility migrated to tests
 *     currency?: Currency;
 *     tool?: string; //for compatibility had been migrated to attendants
 *     macro?: string
 *     folder?: string
 *     instruction?: string
 * }
 */
/**
 * @typedef {Object} RecipeBeaverCrafting
 * @property {string} input -
 * @property {string} output -
 * @property {string} required -
 * @property {object?} tests -
 * @property {object?} currency -
 * @property {string?} macro -
 * @property {string?} folder -
 * @property {string?} instruction -
 */

// =======================
// Macros for conversion models
// =======================

/**
 * @param {Object} [recipeMasterCrafted={}]
 * @param {string} [recipeMasterCrafted.id=null] (default null)
 * @param {RecipeBook} [recipeMasterCrafted.recipeBook=null] (default null)
 * @param {string} [recipeMasterCrafted.sound=""] (default "")
 * @param {number} [recipeMasterCrafted.time=null] (default null)
 * @param {string} [recipeMasterCrafted.name=""] (default "")
 * @param {string} [recipeMasterCrafted.macroName=""] (default "")
 * @param {description} [recipeMasterCrafted.description=""] (default "")
 * @param {Object} [recipeMasterCrafted.ownership={}] (default {})
 * @param {IngredientMasterCrafted[]} [recipeMasterCrafted.ingredients=[]] (default [])
 * @param {ProductMasterCrafted[]} [recipeMasterCrafted.products=[]] (default [])
 * @param {string[]} [recipeMasterCrafted.tools=[]] (default [])
 * @param {(0|1)} [recipeMasterCrafted.ingredientsInspection=0] (default 0)
 * @param {(0|1)} [recipeMasterCrafted.productInspection=0] (default 0)
 * @param {string} [recipeMasterCrafted.img="icons/sundries/documents/document-bound-white-tan.webp"] (default "icons/sundries/documents/document-bound-white-tan.webp")
 *
 * @returns {RecipeBeaverCrafting} recipeBeaverCrafting
 */

//i would recommend to use existing functionality so you should have beavers-crafting module enabled or at least beavers-system-interface
//usually you would need to register your module to systemInterface but this functionality here is not main
//you could have some of your packs system independent as of v11 you can create own subtypes
//but haven't played with that will probably only work good for ingridients with no other functionality.

export function convertJsonRecipeGathererToJsonRecipeBeaverCrafting({
  //destructuring of mastercraftedRecipe
  id,
  recipeBook,
  sound,
  time,
  name,
  macroName,
  description,
  ownership,
  ingredients,
  products,
  tools,
  ingredientsInspection,
  productInspection,
  img,
}) {
  //productInspection/ingredientsInspection i think this is a global setting on my module and is not configurable per recipe -> ignore.
  //tools will only work in dnd5e and you would need to convert the name into a full component by finding the name in the item compendium packs of dnd5e and then set it into the required list.
  //macroName this is rather complex sometimes this includs money and is diffrently reflected on beavers-recipes.
  //also as far as i have seen it gets more complex with mastercrafted latest resource object.
  //recipeBook I am not sure about this i think it can be translated to beaverscrafting folder structure but i do not have the mastercrafted source.
  //time: i decided against real timeing but if at all it is a global configuration setting -> ignore.
  //sound: can not be translated directly but you may write it as a macro that plays that sound when the recipe is executed.

  // BeaversCraftingRecipe is an Item so we need to create one.
  // A recipe is of type RecipeData with functionality (OOP)
  // of type beaversSystemInterface.configLootItemType
  // with flags `flags.beavers-crafting.subtype` = game["beavers-crafting"].Settings.RECIPE_SUBTYPE
  const itemData = {
    name: name,
    img: img,
    ownership: ownership, //todo not sure how that is set in reality
    uuid: id, // todo not sure if the format is correct or if this is generated when the item is created.
    type: beaversSystemInterface.configLootItemType,
    flags: {
      "beavers-crafting": {
        subtype: game["beavers-crafting"].Settings.RECIPE_SUBTYPE,
      },
    },
  };

  const item = {}; // create Item of itemData ???

  const recipeData = {
    input: {},
    output: {},
    required: {},
    instruction: description,
  };
  //not sure which is or and which is and on mastercrafted:
  ingredients.forEach((ingridient, index) => {
    recipeData.input[index] = {};
    ingridient.components.forEach((component, index2) => {
      recipeData.input[index][index2] = convertMasterCraftedComponentToBeaversCraftedComponent(component);
    });
  });
  products.forEach((product, index) => {
    recipeData.output[index] = {};
    product.components.forEach((component, index2) => {
      recipeData.output[index][index2] = convertMasterCraftedComponentToBeaversCraftedComponent(component);
    });
  });
  const recipeBeaversCrafting = new game["beavers-crafting"].Recipe(
    item.uuid,
    item.id,
    item.name,
    item.img,
    recipeData
  );
  recipeBeaversCrafting.update(); // will store the new item again.
  return recipeBeaverCrafting;
}

/**
 * @param {ComponentMasterCrafted} [recipeMasterCrafted]
 * @returns {ComponentDataBeaversCrafting} component
 */
export function convertMasterCraftedComponentToBeaversCraftedComponent({ uuid }) {
  //destructuring of ComponentMasterCrafted
  var entity = beaversSystemInterface.uuidToDocument(uuid); //this will also look into compendiums,
  // i am not aware of that there is such method in foundry but if there is you can replace this.
  return beaversSystemInterface.componentFromEntity(entity); //this will return a Component as of OOP it has functionality and data usually your would need here only the data structur but the Object is also of type data structur.
}
