// Provider.js
import { createContext, Dispatch, Reducer, useContext, useReducer } from 'react'
import { ProcessModel } from '../lib/api/types'

export enum ModelAction {
  UPDATE_FILES,
  REMOVE_FILES,
  RENAME,
}

interface Action {
  type: ModelAction
  payload: any
}

const initialState: ProcessModel = {
  name: 'Unset',
  files: {},
}

const reducer: Reducer<ProcessModel, Action> = (state, action) => {
  switch (action.type) {
    case ModelAction.UPDATE_FILES:
      const files = {
        ...state.files,
        ...action.payload,
      }
      return {
        ...state,
        files,
      }
    case ModelAction.REMOVE_FILES:
      return {
        ...state,
        files: Object.entries(state.files).reduce((acc, [key, val]) => {
          if (!action.payload.includes(key)) {
            acc[key] = val
          }
          return acc
        }, {} as ProcessModel['files']),
      }
    case ModelAction.RENAME:
      return {
        ...state,
        name: action.payload,
      }
    default:
      throw new Error()
  }
}

export const ModelContext = createContext({
  state: {} as ProcessModel,
  dispatch: (() => {
    throw new Error(
      'Model context must be initialized inside the provider first, and was not'
    )
  }) as Dispatch<Action>,
})

export const ModelContextProvider: React.FC<{ model: ProcessModel }> = ({
  model,
  ...props
}) => {
  const [state, dispatch] = useReducer(reducer, model || initialState)
  return (
    <ModelContext.Provider value={{ state, dispatch }}>
      {props.children}
    </ModelContext.Provider>
  )
}

export const useModelContext = () => useContext(ModelContext)
