import React, {useState} from "react"

type Props = {
  ingredients: string;
  // handleFormChange: string;
  // removeIngredient: string;
}

export const IngredientList: React.FC<Props> = ({ingredients}) => {
  return(
    {ingredients.map((input: any) => {
      return (
        <div key={input.id}>
          /*
                <input name='name' placeholder='Ingredient' onChange={(e) => handleFormChange(input.id, e)} />
                <input name='quantity' placeholder='Quantity' type={'number'} step={0.25} onChange={(e) => handleFormChange(input.id, e)} />
                <input name='unit' placeholder='Unit' onChange={(e) => handleFormChange(input.id, e)} />
                <button onClick={() => removeIngredient(input.id)}>Remove</button>
              */
        </div>

            )
          })}
    ) as any;
}
