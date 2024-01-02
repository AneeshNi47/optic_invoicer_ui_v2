import {CREATE_MESSAGE, REFETCH_INVENTORY} from './types'

export const  setShouldFetchInventory = (value) => {
  return {
    type: REFETCH_INVENTORY,
    payload: value,
  }
}
