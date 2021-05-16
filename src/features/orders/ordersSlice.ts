import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { requestOrder, takeOrder, approveToken } from './orderAPI'

export interface OrdersState {
  order: object | null
  tx: object | null
  status: 'idle' | 'requesting' | 'taking' | 'failed'
}

const initialState: OrdersState = {
  order: null,
  tx: null,
  status: 'idle',
}

export const request = createAsyncThunk(
  'orders/request',
  async (params: any) => {
    try {
      return await requestOrder(
        params.url,
        params.chainId,
        params.signerToken,
        params.senderToken,
        params.senderAmount,
        params.senderWallet,
      )
    } catch (e) {
      console.error(e)
    }
  },
)

export const approve = createAsyncThunk('orders/take', async (params: any) => {
  try {
    return await approveToken(params.token, params.library)
  } catch (e) {
    console.error(e)
  }
})

export const take = createAsyncThunk('orders/take', async (params: any) => {
  try {
    return await takeOrder(params.order, params.library)
  } catch (e) {
    console.error(e)
  }
})

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clear: (state) => {
      state.order = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(request.pending, (state) => {
        state.status = 'requesting'
      })
      .addCase(request.fulfilled, (state, action) => {
        state.status = 'idle'
        state.order = action.payload
      })
      .addCase(take.pending, (state) => {
        state.status = 'taking'
      })
      .addCase(take.fulfilled, (state, action) => {
        state.status = 'idle'
        state.tx = action.payload
      })
  },
})

export const { clear } = ordersSlice.actions

export const selectOrder = (state: RootState) => state.orders.order
export const selectTX = (state: RootState) => state.orders.tx

export default ordersSlice.reducer
