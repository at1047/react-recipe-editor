import React from "react"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Ingredient } from "../Ingredient/ingredient";

export const IngredientList = ({ingredients, handleFormChange, removeIngredient}) => {

  return (
    <div>
      <SortableContext items={ingredients} strategy={verticalListSortingStrategy}>
        {ingredients.map((ingredient) => (
          <Ingredient key={ingredient.id} id={ingredient.id} ingredient={ingredient} handleFormChange={handleFormChange} removeIngredient={removeIngredient}/>
        ))}
      </SortableContext>
    </div>
  );
}

          // return (
          //   <div key={input.id}>
          //     <input name='name' placeholder='Ingredient' onChange={(e) => handleFormChange(input.id, e)} />
          //     <input name='quantity' placeholder='Quantity' type={'number'} step={0.25} onChange={(e) => handleFormChange(input.id, e)} />
          //     <input name='unit' placeholder='Unit' onChange={(e) => handleFormChange(input.id, e)} />
          //     <button onClick={() => removeIngredient(input.id)}>Remove</button>
          //   </div>
