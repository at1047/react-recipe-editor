import React, {useState} from "react"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Ingredient = ({id, ingredient, handleFormChange, removeIngredient}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return(
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="ingredient"
      key = {ingredient.id}
    >
      <input name='name' placeholder='Ingredient' type='text' onChange={(e) => handleFormChange(ingredient.id, e)} />
      <input name='quantity' placeholder='Quantity' type={'number'} step={0.25} onChange={(e) => handleFormChange(ingredient.id, e)} />
      <input name='unit' placeholder='Unit' onChange={(e) => handleFormChange(ingredient.id, e)} />
      <button onClick={() => removeIngredient(ingredient.id)}>Remove</button>
    </div>
  )
}
