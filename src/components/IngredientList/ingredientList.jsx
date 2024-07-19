import React from "react"

export default function IngredientList (props) {

  return (
    <div>
      {props.ingredients.map((input) => {
        return (
          <div key={input.id}>
            <input name='name' placeholder='Ingredient' onChange={(e) => props.handleFormChange(input.id, e)} />
            <input name='quantity' placeholder='Quantity' type={'number'} step={0.25} onChange={(e) => props.handleFormChange(input.id, e)} />
            <input name='unit' placeholder='Unit' onChange={(e) => props.handleFormChange(input.id, e)} />
            <button onClick={() => props.removeIngredient(input.id)}>Remove</button>
          </div>
        )}
      )}
    </div>
  );
}
